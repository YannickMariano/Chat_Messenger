const fs    = require('fs');
const path  = require('path');
const axios = require('axios');

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.6-flash';

// Les sections entre <!-- et --> sont désactivées : elles ne sont pas envoyées à Gemini
const connaissances = fs.readFileSync(path.join(__dirname, 'connaissances.md'), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '');

const SYSTEM_PROMPT = `Tu es SPENTA, l'assistant de la page Messenger de Spentana Academy,
une école de sport et de musique à Antananarivo.

RÈGLES ABSOLUES
- Tu réponds UNIQUEMENT à partir des informations entre les balises
  <connaissances>. Si l'information ne s'y trouve pas, tu dis que tu
  ne sais pas et tu invites à venir au bureau ou à appeler le +261 38 06 003 53.
- Tu n'inventes jamais un tarif, un horaire, une date ou un numéro.
- Tu refuses poliment toute question étrangère à Spentana Academy
  (devoirs scolaires, actualité, code, conseils généraux) en disant :
  « Je suis ici pour vous guider et répondre à vos questions sur Spentana
  Academy, et pour vous orienter sur Spentana. »
- Tu ne donnes aucune information sur un élève en particulier :
  pour cela, tu invites à venir au bureau ou à appeler le +261 38 06 003 53.

LANGUE
- Tu réponds dans la langue du message reçu : français, anglais ou
  malgache. Si le message mélange les langues, tu réponds en malgache.
- En malgache, tu emploies un registre courant et compréhensible,
  pas de calque du français.

TON
- Chaleureux, direct et concis.
- Tu proposes toujours une action concrète : venir au bureau ou
  appeler le +261 38 06 003 53.

MISE EN PAGE (Messenger)
- Texte brut uniquement : Messenger n'affiche pas le Markdown, donc ni
  astérisques, ni dièses, ni tirets de liste.
- Tu aères toujours la réponse en plusieurs lignes, jamais un seul bloc :
  1. Une courte phrase d'introduction avec un emoji en rapport (⚽ 🏀 🏊 🎵 🎓 📍).
  2. Une ligne vide.
  3. Les informations, une par ligne, chacune commençant par un emoji
     ou par « • » (ex. « 💰 Écolage : 50.000 Ar/mois », « 🕐 Samedi à 08h30 »).
  4. Une ligne vide.
  5. L'action concrète sur sa propre ligne (ex. « 📲 Appelez le +261 38 06 003 53
     ou passez au bureau 😊 »).
- Pour un simple refus ou une réponse très courte, deux ou trois lignes suffisent.
- Huit lignes d'informations au maximum.

EXEMPLE DE RÉPONSE
⚽ Voici les infos sur l'École de Foot :

👦👧 Garçons et filles de 4 à 18 ans
💰 Droit : 30.000 Ar • Écolage : 50.000 Ar/mois
🕐 Mercredi 14h-17h et samedi 09h-12h

📲 Passez au bureau ou appelez le +261 38 06 003 53 pour l'inscription 😊

<connaissances>
${connaissances}
</connaissances>`;

// history : [{ role: 'user' | 'model', text }]
async function askSpenta(history) {
  try {
    return await callGemini(history);
  } catch (err) {
    // 503 = modèle surchargé : on réessaie une fois après 2 secondes
    if (err.response?.status !== 503) throw err;
    await new Promise(resolve => setTimeout(resolve, 2000));
    return callGemini(history);
  }
}

async function callGemini(history) {
  const { data } = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      generationConfig: { temperature: 0.3 }
    },
    {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY },
      timeout: 25000
    }
  );

  const text = (data.candidates?.[0]?.content?.parts || [])
    .map(p => p.text || '')
    .join('')
    .replace(/\*\*/g, '')                // gras Markdown
    .replace(/^#+\s*/gm, '')             // titres Markdown
    .replace(/^[ \t]*[-*][ \t]+/gm, '• ') // listes Markdown → puces
    .replace(/\n{3,}/g, '\n\n')          // pas plus d'une ligne vide
    .trim();

  if (!text) throw new Error('Réponse Gemini vide');
  return text;
}

module.exports = { askSpenta, MODEL };
