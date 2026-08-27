# Portfolio PWA — Yahya Haroun

Portfolio professionnel Next.js 14 + Supabase, avec espace public et dashboard d'administration.

## ⚠️ État de ce livrable — à lire avant de commencer

Ce projet est un **socle fonctionnel et réel** (pas des maquettes) couvrant :

✅ Livré et opérationnel :
- Toutes les pages publiques (Accueil, À propos, Projets, Expériences, Galerie, Témoignages, Blog, Contact, Partenariat)
- Authentification admin + Dashboard avec statistiques
- CRUD complet des projets (créer / modifier / supprimer / publier-masquer)
- Génération de CV en PDF à la volée depuis les données admin
- Schéma de base de données complet avec Row Level Security
- Formulaires de contact et partenariat fonctionnels (avec upload de pièce jointe)
- Base PWA (manifest, service worker via next-pwa)
- Design responsive, mobile-first, en thème sombre premium

⚙️ Volontairement simplifié dans cette v1, à enrichir ensuite :
- Le mini-jeu "Architecture Builder" (section 9 du cahier des charges) n'est pas encore implémenté — nécessite une session dédiée pour le concevoir avec retours visuels
- Curseur magnétique, animations Three.js/GSAP avancées : non inclus (impact important sur les performances Lighthouse, à valider en priorisant soigneusement)
- Notifications push : nécessitent une configuration Supabase Edge Functions + clés VAPID, non générée ici
- Gestion admin de la galerie, des témoignages, des certifications, du blog et des expériences : les tables et la lecture publique existent, mais les écrans CRUD admin dédiés (au-delà des projets) restent à construire sur le même modèle que `admin/projects`
- Les icônes PWA (icon-192.png, icon-512.png) sont à fournir vous-même dans `public/icons/`

Le CRUD "Projets" est fourni en entier et sert de **modèle exact** à dupliquer pour la Galerie, les Témoignages, le Blog, etc. — la structure (page liste + formulaire + boutons delete/publish) est identique pour chaque module.

---

## 🛠️ Stack technique

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, Storage, Row Level Security)
- **PDF** : @react-pdf/renderer
- **PWA** : next-pwa
- **Déploiement recommandé** : Vercel (frontend) + Supabase (backend)

---

## 📦 Installation locale

### 1. Prérequis
- Node.js 18.17 ou supérieur
- Un compte Supabase (gratuit) : https://supabase.com

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer le projet Supabase

1. Allez sur https://app.supabase.com et créez un nouveau projet.
2. Dans **SQL Editor**, ouvrez une nouvelle requête, collez tout le contenu du fichier
   `supabase/schema.sql` de ce projet, puis exécutez-le. Cela crée toutes les tables,
   les policies de sécurité (RLS) et le bucket de stockage `media`.
3. Dans **Project Settings > API**, récupérez :
   - `Project URL`
   - `anon public key`
   - `service_role key` (⚠️ à garder secrète, jamais exposée côté client)

### 4. Configurer les variables d'environnement

Copiez `.env.example` en `.env.local` et remplissez les valeurs :

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Créer votre compte administrateur

1. Dans Supabase, allez dans **Authentication > Users > Add user**.
2. Créez un utilisateur avec votre email et un mot de passe.
3. Le trigger SQL (`handle_new_user`) crée automatiquement votre profil admin
   dans la table `profiles` — vous n'avez rien d'autre à faire.

### 6. Lancer le projet en local

```bash
npm run dev
```

Ouvrez http://localhost:3000 pour le site public,
et http://localhost:3000/admin/login pour vous connecter au dashboard.

### 7. Ajouter votre premier contenu

Une fois connecté à `/admin` :
1. Allez dans **CV** pour renseigner votre titre, résumé et compétences.
2. Allez dans **Projets** pour ajouter vos projets (LUMA, Regionale Express Voyage, etc.).
3. Cochez "Publié" pour qu'ils apparaissent sur le site public.

Pour les images (couverture de projet, galerie...), uploadez-les manuellement dans
**Supabase > Storage > media**, puis copiez l'URL publique dans le champ correspondant.

---

## 🚀 Déploiement en production

### Frontend (Vercel)

```bash
npm install -g vercel
vercel
```

Renseignez les mêmes variables d'environnement que `.env.local` dans les
**Environment Variables** du projet Vercel.

### Backend

Rien à déployer : Supabase est déjà hébergé. Vérifiez simplement que les URLs
de redirection d'authentification (Supabase > Authentication > URL Configuration)
incluent bien votre domaine de production.

---

## 📁 Structure du projet

```
portfolio-pwa/
├── public/
│   ├── manifest.json          # Config PWA
│   └── icons/                 # Icônes PWA (à fournir)
├── supabase/
│   └── schema.sql             # Schéma complet + RLS + triggers
├── src/
│   ├── middleware.ts          # Protection des routes /admin/*
│   ├── lib/supabase/          # Clients Supabase (browser + server)
│   ├── types/                 # Types TypeScript partagés
│   ├── components/            # Composants publics
│   │   └── admin/             # Composants spécifiques au dashboard
│   └── app/
│       ├── page.tsx           # Accueil
│       ├── about/              À propos
│       ├── projects/           Liste + détail projet
│       ├── experiences/        Timeline
│       ├── gallery/             Galerie
│       ├── testimonials/        Témoignages
│       ├── blog/                Liste + article
│       ├── contact/             Formulaire de contact
│       ├── partnership/         Formulaire de partenariat
│       ├── api/
│       │   ├── contact/route.ts       # Traite le formulaire contact
│       │   ├── partnership/route.ts   # Traite le formulaire partenariat + upload
│       │   └── cv/route.tsx           # Génère le CV en PDF
│       └── admin/
│           ├── login/           Connexion
│           ├── page.tsx         Dashboard + stats
│           ├── projects/        CRUD projets (modèle à dupliquer)
│           └── cv/              Édition des données du CV
└── package.json
```

---

## 🔒 Sécurité

- Toutes les tables sensibles sont protégées par Row Level Security : seul un
  utilisateur avec `role = 'admin'` dans `profiles` peut écrire.
- Les routes `/admin/*` sont protégées côté serveur par `middleware.ts` (pas
  seulement côté client), donc pas de contournement possible en désactivant le JS.
- Les formulaires publics valident les données côté serveur avec `zod` avant
  toute insertion en base.

## 📈 Prochaines étapes suggérées

1. Dupliquer le CRUD "Projets" pour Galerie, Témoignages, Blog, Expériences, Certifications.
2. Ajouter la page admin de traitement des messages de contact / partenariat (marquer comme lu/traité).
3. Construire le mini-jeu Architecture Builder en composant client isolé, testé indépendamment.
4. Introduire Framer Motion / GSAP progressivement, en mesurant l'impact Lighthouse après chaque ajout.
5. Ajouter les icônes PWA réelles et tester l'installation sur mobile.
