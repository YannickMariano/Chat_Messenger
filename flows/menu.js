// Arbre des messages automatiques. Fichier .js (et non .json) pour pouvoir commenter des sections.
module.exports = {
  "accueil": {
    "message": "Bonjour 👋 Bienvenue sur la page de Spentana Academy !\nJe suis SPENTA. Comment souhaitez-vous être aidé ?",
    "options": [
      {
        "next": "spenta",
        "label": "🤖 Parler à SPENTA"
      },
      {
        "next": "menu_auto",
        "label": "📋 Menu automatique"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  "spenta": {
    "message": "🤖 Je suis SPENTA, l'assistant de Spentana Academy.\nPosez-moi votre question (français, anglais ou malgache).\nTapez « menu » à tout moment pour revenir à l'accueil.",
    "options": [
      {
        "next": "accueil",
        "label": "🏠 Accueil"
      }
    ]
  },
  "menu_auto": {
    "message": "Que souhaitez-vous savoir ?",
    "options": [
      {
        "next": "activite",
        "label": "🏆 Nos activités"
      },
      {
        "next": "infos",
        "label": "📍 Lieu & contact"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  "humain": {
    "message": "Merci de patienter 🙏\nUne responsable va prendre en charge votre demande dans les plus brefs délais.",
    "options": [
      {
        "next": "accueil",
        "label": "❌ Annuler"
      }
    ]
  },
  "activite": {
    "message": "Spentana propose diverses activités. Choisissez ce qui vous intéresse :",
    "cards": [
      /* ── COURS DE VACANCES (désactivé jusqu'en juin) : supprimer cette ligne et la ligne FIN pour réactiver ──
      {
        "title": "⚽ Cours de Vacances Foot",
        "subtitle": "4 à 18 ans • 100.000 Ar/mois",
        "options": [
          {
            "next": "vacances_foot",
            "label": "En savoir plus"
          }
        ]
      },
      {
        "title": "🏀 Cours de Vacances Basket",
        "subtitle": "12 à 18 ans • 100.000 Ar/mois",
        "options": [
          {
            "next": "vacances_basket",
            "label": "En savoir plus"
          }
        ]
      },
      ── FIN COURS DE VACANCES ── */
      {
        "title": "⚽ École de Foot",
        "subtitle": "4 à 18 ans • 50.000 Ar/mois",
        "options": [
          {
            "next": "foot",
            "label": "En savoir plus"
          }
        ]
      },
      {
        "title": "🏀 École de Basket",
        "subtitle": "10 à 18 ans • 50.000 Ar/mois",
        "options": [
          {
            "next": "basket",
            "label": "En savoir plus"
          }
        ]
      },
      {
        "title": "🏊 École de Natation",
        "subtitle": "À partir de 4 ans • 50.000 Ar/mois",
        "options": [
          {
            "next": "natation",
            "label": "En savoir plus"
          }
        ]
      },
      {
        "title": "🎵 Cours de Musique",
        "subtitle": "À partir de 6 ans • 50.000 Ar/mois",
        "options": [
          {
            "next": "musique",
            "label": "En savoir plus"
          }
        ]
      },
      {
        "title": "🎓 Sports-Études",
        "subtitle": "À partir de 6 ans • 200.000 Ar/mois",
        "options": [
          {
            "next": "sports-etudes",
            "label": "En savoir plus"
          }
        ]
      },
      {
        "title": "🏠 Retour au menu",
        "subtitle": "Revenir au menu automatique",
        "options": [
          {
            "next": "menu_auto",
            "label": "🏠 Menu"
          }
        ]
      }
    ]
  },
  "infos": {
    "message": "📍 Complexe Sportif Spentana Academy\nBy-Pass Alasora, en face du Domaine\n🚗 Accessible via la route By-Pass\n🚌 Arrêt de bus : Domaine Alasora\n🅿️ Parking\n\n📲 +261 38 06 003 53\n📩 spentanaofficiel@gmail.com",
    "options": [
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  /* ── COURS DE VACANCES (désactivé jusqu'en juin) : supprimer cette ligne et la ligne FIN pour réactiver ──
  "vacances_foot": {
    "message": "⚽ Cours de Vacances Foot\n\nGarçons et filles de 4 à 18 ans\nÉcolage : 100.000 Ar/mois\nCatégories : U7 - U9 - U11 - U13 - U15-U17 - Foot féminin\n🕐 Lundi, mardi, jeudi, vendredi de 09h à 11h\n\n📄 Dossier : 2 photos d'identité\nInscription sur place au bureau de Spentana Academy.",
    "options": [
      {
        "next": "activite",
        "label": "⬅️ Retour"
      },
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  "vacances_basket": {
    "message": "🏀 Cours de Vacances Basket\n\nGarçons et filles de 12 à 18 ans\nÉcolage : 100.000 Ar/mois\nCatégories : U10 - U12 - U14 - U16\n🕐 Lundi, mardi, jeudi, vendredi de 09h à 11h\n\n📄 Dossier : 2 photos d'identité\nInscription sur place au bureau de Spentana Academy.",
    "options": [
      {
        "next": "activite",
        "label": "⬅️ Retour"
      },
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  ── FIN COURS DE VACANCES ── */
  "foot": {
    "message": "⚽ École de Foot\n\nGarçons et filles de 4 à 18 ans\nDroit : 30.000 Ar\nÉcolage : 50.000 Ar/mois\nCatégories : U7 - U9 - U11 - U13 - U15-U17 - Foot féminin\n👕 2 maillots obligatoires : 30.000 Ar x 2\n(tenue blanche le mercredi, bleue le samedi)\n\n🕐 Mercredi 14h-15h30 / Samedi 09h-10h30 :\nU7-U9, U11 Formation, U13 Formation et Équipe type\n🕐 Mercredi 15h30-17h / Samedi 10h30-12h :\nU11 Équipe type, U15-U17 Formation et Équipe type, Foot féminin\n\n📄 Dossier :\n- 4 photos d'identité\n- 1 copie ou bulletin de naissance\n- 1 certificat de résidence",
    "options": [
      {
        "next": "activite",
        "label": "⬅️ Retour"
      },
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  "basket": {
    "message": "🏀 École de Basket\n\nGarçons et filles de 10 à 18 ans\nDroit : 30.000 Ar\nÉcolage : 50.000 Ar/mois\nCatégories : U10 - U12 - U14 - U16\n👕 2 maillots obligatoires : 30.000 Ar x 2\n(tenue blanche le mercredi, bleue le samedi)\n\n🕐 Mercredi 14h-15h30 / Samedi 09h-10h30 : U10 et U12\n🕐 Mercredi 15h30-17h / Samedi 10h30-12h : U14 et U16\n\n📄 Dossier :\n- 4 photos d'identité\n- 1 copie ou bulletin de naissance\n- 1 certificat de résidence",
    "options": [
      {
        "next": "activite",
        "label": "⬅️ Retour"
      },
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  "natation": {
    "message": "🏊 École de Natation\n\nÀ partir de 4 ans • Débutant, intermédiaire, avancé\nDroit : 30.000 Ar\nÉcolage : 50.000 Ar/mois\n🕐 Mercredi à 13h ou samedi à 13h\n\n📄 Dossier :\n- 4 photos d'identité\n- 1 copie ou bulletin de naissance\n- 1 certificat de résidence\n\n📌 Adultes (+18 ans) : 50.000 Ar/mois seulement, samedi à 10h",
    "options": [
      {
        "next": "activite",
        "label": "⬅️ Retour"
      },
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  "musique": {
    "message": "🎵 Cours de Musique\n\n🎹 Piano • 🎸 Guitare • 🎤 Chant\nÀ partir de 6 ans\nDroit : 30.000 Ar\nÉcolage : 50.000 Ar/mois\n🕐 Samedi à 08h30\n\n📄 Dossier :\n- 4 photos d'identité\n- 1 copie ou bulletin de naissance\n- 1 certificat de résidence",
    "options": [
      {
        "next": "activite",
        "label": "⬅️ Retour"
      },
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  },
  "sports-etudes": {
    "message": "🎓 Sports-Études\n\nÀ partir de 6 ans\nDroit : 100.000 Ar\nÉcolage : 200.000 Ar/mois\nMaillot : 30.000 Ar\n\n📚 Système éducatif français, enseignement général\n\n🏠 Hébergement (facultatif) :\n- Loyer : 100.000 Ar\n- Nourriture : 25.000 Ar/jour\n\n📄 Dossier :\n- 4 photos d'identité\n- 1 copie ou bulletin de naissance\n- 1 certificat de résidence",
    "options": [
      {
        "next": "activite",
        "label": "⬅️ Retour"
      },
      {
        "next": "menu_auto",
        "label": "🏠 Menu"
      },
      {
        "next": "humain",
        "label": "👤 Service client"
      }
    ]
  }
};
