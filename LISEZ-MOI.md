# Portfolio de Rose Pagotto

Le site est une simple mise en page : **tout le contenu vit dans le dossier `contenu/`** et se modifie sans toucher au code.

## Mettre le site en ligne

1. Dans le dépôt `rosepagotto/Portfolio`, remplace les anciens fichiers (`index.html`, `rose_portfolio.css`, `rose_portfolio.js`, `site-data.json`, `server.js`) par le contenu de ce dossier.
2. GitHub Pages republie tout seul en une à deux minutes.

## Modifier le contenu avec Pages CMS

1. Va sur <https://app.pagescms.org> et connecte-toi avec GitHub.
2. Installe l'application GitHub de Pages CMS sur le dépôt `Portfolio`.
3. Ouvre le dépôt : tu vois les formulaires (Profil, Compétences, Projets, Parcours, Galerie, Appréciations, Menu « Plus », Qui suis-je ?).
4. Enregistre : le CMS écrit directement dans le dépôt et le site se met à jour.

Les formulaires sont décrits dans `.pages.yml`.

## Où mettre quoi

| Ce que tu veux changer | Où |
|---|---|
| Nom, texte « À propos », contact, LinkedIn | Profil |
| Photos et images | envoyées via les champs image (dossier `images/`) |
| CV et rapports de stage (PDF) | champs « Document PDF » (dossier `fichiers/`) |
| Parcours | Parcours (le tri est automatique, du plus récent au plus ancien) |

## Où déposer les fichiers à la main

- **PDF** : dans le dossier `fichiers/`. Le menu « Plus » cherche `cv.pdf` et `stage-girofard.pdf`.
- **Images** : dans le dossier `images/`. Dans les fichiers de contenu, écris le chemin sous la forme `/images/mon-image.jpg`.

Avec Pages CMS, les champs d'envoi font ça tout seuls.

## Tampons et filtres des projets

Chaque projet a un champ « Tampon » (Vidéo, Podcast, Excel…). Les boutons de filtre se créent tout seuls d'après les tampons utilisés. Le champ « Type précis » (Court métrage, Projet vidéo…) s'affiche sous le titre.

## Dates du parcours

Écris une année (`2025`) ou une année et un mois (`2025-03`). Le site affiche « mars 2025 ». Laisse vide si tu ne sais pas : l'entrée passe en bas de liste. Coche « En cours » pour afficher « depuis … ».

## Compétences : le champ « Vu dans »

Écris le titre exact d'un projet (par exemple `Cin'EHPAD`) ou le nom d'une structure du parcours (par exemple `Ricochet`). Le lien se crée tout seul. `Galerie` renvoie vers la galerie.

## Voir le site sur ton ordinateur

Ouvrir `index.html` directement ne marche pas (le navigateur bloque la lecture des fichiers de contenu). Dans ce dossier :

    python3 -m http.server 8000

puis ouvre <http://localhost:8000>.

## Images : taille et poids conseillés

- **Photos de la galerie et des projets** : 1600 px de large maximum, format JPG (qualité 80) ou WebP, **300 Ko idéalement, 500 Ko maximum**.
- **Image de partage** (`images/partage.png`) : 1200 × 630 px, moins de 300 Ko.
- **PDF** (CV, rapports de stage) : 3 Mo maximum.
- Outils gratuits : <https://squoosh.app> ou <https://tinypng.com>. Pages CMS ne compresse pas : fais-le avant l'envoi.
- GitHub refuse les fichiers de plus de 100 Mo.

## Référencement (SEO)

- Titre, description, aperçu de partage (Open Graph / Twitter) et données structurées sont dans l'en-tête de `index.html`. Ils sont écrits en dur : modifie-les à la main si ton titre ou ton adresse change.
- L'adresse officielle (`rosepagotto.github.io/Portfolio/`) est déclarée dans la balise `canonical` : à changer si tu prends un nom de domaine.
- `sitemap.xml` liste la page d'accueil. Dans Google Search Console (<https://search.google.com/search-console>), ajoute le site puis envoie `sitemap.xml`.
- La page « Qui suis-je ? » est en `noindex` tant que ses textes sont provisoires. Quand ils sont prêts, supprime la ligne `<meta name="robots" content="noindex, follow">` dans `qui-suis-je.html` et ajoute la page au sitemap.
- Un fichier `robots.txt` ne serait pas lu pour un site hébergé dans un sous-dossier de GitHub Pages : il n'y en a donc pas.

## Décor, sons et mini-jeu

- Le décor est tiré au hasard dans un stock d’objets à chaque chargement (`js/deco.js`). Les bandes de pellicule restent visibles sur les grands écrans ; sur « Qui suis-je ? », seuls quatre objets flottants apparaissent. Chaque objet réagit au clic.
- Les effets sonores sont synthétisés dans le navigateur, sans fichier audio. Ils sont désactivés par défaut ; le bouton « Son : non/oui » dans la navigation permet de les activer et mémorise ce choix sur l’appareil. Les sons sont discrets et tactiles ; le filtre garde son petit son clair.
- L’easter egg « Service en cuisine » s’ouvre uniquement avec le code Konami (↑ ↑ ↓ ↓ ← → ← → B A Entrée). Le mini-jeu propose un contre-la-montre de 60 secondes, une difficulté progressive, des recettes de 2 à 5 ingrédients (les recettes de 5 sont très rares), des ingrédients agrandis, les commandes sous forme de liste à gauche sur grand écran, un temps de préparation de 10 secondes (hors chrono), une composition libre sans choisir la commande (la commande exacte qui expire le plus tôt est servie automatiquement), des commandes qui expirent, un combo multiplicateur, un historique des services, un scoreboard local (sans serveur) et une musique synthétique originale dont le tempo accélère à l’approche de la fin. Le bouton musical dans le HUD permet de la désactiver ou de la réactiver. Les records sont enregistrés dans le navigateur utilisé. Échap pour quitter.

## Ce qui a changé par rapport à l'ancien site

- Plus d'espace admin ni de mot de passe : c'est GitHub qui décide qui peut modifier (`server.js` n'est plus utile).
- Plus de mode sombre, de version anglaise, de loader ni de carrousel.
- Les polices sont hébergées avec le site (dossier `polices/`) : aucune requête vers Google.

## Musiques de fond (Pages CMS)

1. Dans Pages CMS, ouvre la médiathèque **Musiques de fond** et téléverse un fichier audio dans `audios/` (MP3 recommandé pour une compatibilité large).
2. Ouvre **Musiques de fond et crédits** et ajoute une entrée, puis sélectionne le fichier audio.
3. Renseigne le titre, l'auteur/compositeur, le titulaire des droits, la licence ou l'autorisation et, si utile, la source. Le titre peut rester vide : le nom du fichier sera alors utilisé.
4. Les pistes sont proposées aléatoirement par le lecteur flottant. La lecture commence après un clic du visiteur, car les navigateurs bloquent généralement la lecture sonore automatique. La piste suivante est choisie aléatoirement à la fin du morceau.
5. Le lien **Crédits musicaux** du pied de page affiche les informations enregistrées dans le CMS.

**Limite des métadonnées :** Pages CMS ne fournit pas de mécanisme natif permettant de lire les tags d'un fichier audio téléversé puis de préremplir automatiquement les champs du formulaire. Les informations de crédit doivent donc être saisies ou collées dans les champs modifiables. Les droits et licences ne sont de toute façon pas présents de façon fiable dans tous les fichiers audio. Vérifie toujours que tu disposes des autorisations nécessaires avant de publier un morceau.
