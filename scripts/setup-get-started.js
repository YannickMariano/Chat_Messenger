// À lancer une seule fois : active le bouton « Démarrer » de la page Messenger.
// Usage : npm run setup-get-started
require('dotenv').config();
const axios = require('axios');

axios.post(
  `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
  { get_started: { payload: 'accueil' } }
)
  .then(({ data }) => console.log('✅ Bouton Démarrer activé :', data))
  .catch(err => console.log('❌ Erreur :', err.response?.data || err.message));
