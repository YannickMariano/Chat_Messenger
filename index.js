require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const flows   = require('./flows/menu');
const { askSpenta, MODEL } = require('./spenta');

const app = express();
app.use(express.json());

const GRAPH_URL      = 'https://graph.facebook.com/v18.0/me/messages';
const HUMAIN_DUREE   = 12 * 60 * 60 * 1000; // silence du bot en mode service client
const HISTORIQUE_MAX = 20;                  // ~10 échanges gardés pour SPENTA
const MESSENGER_MAX  = 2000;                // limite de caractères d'un message Messenger
const ERREUR_SPENTA  = "Désolé, je rencontre un petit souci technique 🙏\nVous pouvez venir au bureau ou appeler le +261 38 06 003 53.";

// Mémoire temporaire de chaque utilisateur : { mode: 'menu' | 'spenta' | 'humain', history, humainJusqua, vuLe }
const userState = {};
// Identifiants des messages déjà traités (Meta peut renvoyer le même événement)
const dejaTraites = new Set();

app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

console.log('PAGE_ACCESS_TOKEN présent:', !!process.env.PAGE_ACCESS_TOKEN);
console.log('VERIFY_TOKEN présent:', !!process.env.VERIFY_TOKEN);
console.log('GEMINI_API_KEY présent:', !!process.env.GEMINI_API_KEY, '| modèle:', MODEL);

// Vérification du webhook Meta
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Réception des messages : on répond 200 tout de suite, puis on traite
app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object !== 'page') return res.sendStatus(404);
  res.sendStatus(200);

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      handleEvent(event).catch(err => console.log('❌ Erreur traitement :', err.message));
    }
  }
});

function getState(senderId) {
  if (!userState[senderId]) userState[senderId] = { mode: 'menu', history: [] };
  userState[senderId].vuLe = Date.now();
  return userState[senderId];
}

function dejaVu(mid) {
  if (!mid) return false;
  if (dejaTraites.has(mid)) return true;
  dejaTraites.add(mid);
  if (dejaTraites.size > 1000) dejaTraites.delete(dejaTraites.values().next().value);
  return false;
}

async function handleEvent(event) {
  if (event.message?.is_echo) return;
  if (dejaVu(event.message?.mid || event.postback?.mid)) return;

  const senderId = event.sender.id;
  const state    = getState(senderId);

  // Clic sur un bouton (postback ou réponse rapide)
  const payload = event.postback?.payload || event.message?.quick_reply?.payload;
  if (payload) {
    console.log(`🔘 ${senderId} → ${payload}`);
    return goTo(senderId, state, payload);
  }

  if (!event.message) return;
  const text = (event.message.text || '').trim();

  // « menu » ramène toujours à l'accueil
  if (text.toLowerCase() === 'menu') return goTo(senderId, state, 'accueil');

  if (state.mode === 'humain') {
    if (Date.now() < state.humainJusqua) return; // la responsable prend le relais
    state.mode = 'menu';
  }

  if (state.mode === 'spenta') return replySpenta(senderId, state, text);

  await sendStep(senderId, 'accueil');
}

async function goTo(senderId, state, stepKey) {
  if (stepKey === 'spenta') {
    state.mode    = 'spenta';
    state.history = [];
  } else if (stepKey === 'humain') {
    state.mode         = 'humain';
    state.humainJusqua = Date.now() + HUMAIN_DUREE;
    await typing(senderId, 2000);
  } else {
    state.mode = 'menu';
  }
  await sendStep(senderId, stepKey);
}

async function replySpenta(senderId, state, text) {
  if (!text) {
    return sendText(senderId, 'Je ne peux lire que les messages écrits 🙂 Posez-moi votre question.');
  }

  await sendAction(senderId, 'typing_on');
  state.history.push({ role: 'user', text });

  let reponse;
  try {
    reponse = await askSpenta(state.history);
    state.history.push({ role: 'model', text: reponse });
  } catch (err) {
    console.log('❌ Erreur Gemini :', err.response?.data?.error?.message || err.message);
    state.history.pop();
    reponse = ERREUR_SPENTA;
  }
  state.history = state.history.slice(-HISTORIQUE_MAX);

  await sendText(senderId, reponse, [{ content_type: 'text', title: '🏠 Accueil', payload: 'accueil' }]);
}

// Envoyer une étape de l'arbre
async function sendStep(recipientId, stepKey) {
  const step = flows[stepKey];
  if (!step) {
    console.log('❌ Étape introuvable :', stepKey);
    return;
  }

  if (step.cards) {
    await sendCarousel(recipientId, step);
  } else {
    await sendButtons(recipientId, step);
  }
}

async function sendButtons(recipientId, step) {
  const message = Array.isArray(step.message)
    ? step.message.join('\n')
    : step.message;

  const chunks = chunkArray(step.options, 3);

  for (let i = 0; i < chunks.length; i++) {
    if (i > 0) await typing(recipientId, 800);
    await callSendAPI({
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: i === 0 ? message : 'Autres options :',
            buttons: chunks[i].map(opt => ({
              type: 'postback',
              title: opt.label,
              payload: opt.next
            }))
          }
        }
      }
    }, 'boutons');
  }
}

async function sendCarousel(recipientId, step) {
  await callSendAPI({
    recipient: { id: recipientId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: step.cards.map(card => ({
            title: card.title,
            subtitle: card.subtitle || '',
            buttons: card.options.map(opt => ({
              type: 'postback',
              title: opt.label,
              payload: opt.next
            }))
          }))
        }
      }
    }
  }, 'carrousel');
}

async function sendText(recipientId, text, quickReplies) {
  const message = { text: text.slice(0, MESSENGER_MAX) };
  if (quickReplies) message.quick_replies = quickReplies;
  await callSendAPI({ recipient: { id: recipientId }, message }, 'texte');
}

async function sendAction(recipientId, action) {
  await callSendAPI({ recipient: { id: recipientId }, sender_action: action }, action);
}

// Affiche « en train d'écrire » pendant un court instant
async function typing(recipientId, ms) {
  await sendAction(recipientId, 'typing_on');
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function callSendAPI(payload, label) {
  try {
    await axios.post(`${GRAPH_URL}?access_token=${process.env.PAGE_ACCESS_TOKEN}`, payload);
  } catch (err) {
    console.log(`❌ Erreur envoi ${label} :`, err.response?.data?.error?.message || err.message);
  }
}

// Découper un tableau en groupes de N
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// Nettoyage des utilisateurs inactifs depuis plus de 24h
setInterval(() => {
  const limite = Date.now() - 24 * 60 * 60 * 1000;
  for (const id in userState) {
    if (userState[id].vuLe < limite && !(userState[id].humainJusqua > Date.now())) delete userState[id];
  }
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Bot démarré sur le port ${PORT}`));
