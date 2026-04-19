require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const flows   = require('./flows/menu.json');

const app = express();
app.use(express.json());

// Mémoire temporaire de l'étape de chaque utilisateur
const userState = {};

app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});


// Vérification du webhook Meta
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Réception des messages
app.post('/webhook', async (req, res) => {
  console.log('📩 Webhook reçu :', JSON.stringify(req.body, null, 2));
  
  const body = req.body;
  if (body.object !== 'page') {
    console.log('❌ Objet non reconnu :', body.object);
    return res.sendStatus(404);
  }

  for (const entry of body.entry) {
    const event = entry.messaging[0];
    console.log('📨 Event :', JSON.stringify(event, null, 2));
    
    const senderId = event.sender.id;

    if (event.postback) {
      console.log('🔘 Postback reçu :', event.postback.payload);
      await sendStep(senderId, event.postback.payload);
    }

    if (event.message && !event.message.is_echo) {
      console.log('💬 Message reçu :', event.message.text);
      await sendStep(senderId, 'accueil');
    }
  }

  res.sendStatus(200);
});

// Envoyer une étape de l'arbre
async function sendStep(recipientId, stepKey) {
  const step = flows[stepKey];
  if (!step) {
    console.log('❌ Étape introuvable :', stepKey);
    return;
  }

  console.log('📤 Envoi étape :', stepKey, 'à', recipientId);

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
    const payload = {
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
    };

    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
        payload
      );
      console.log('✅ Boutons envoyés');
    } catch (err) {
      console.log('❌ Erreur boutons :', err.response?.data || err.message);
    }
  }
}

async function sendCarousel(recipientId, step) {
  const payload = {
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
  };

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      payload
    );
    console.log('✅ Carrousel envoyé');
  } catch (err) {
    console.log('❌ Erreur carrousel :', err.response?.data || err.message);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Bot démarré sur le port ${PORT}`));