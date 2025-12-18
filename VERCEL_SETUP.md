# 🌍 Connecter Vercel à votre Base de Données TiDB Cloud

Pour que votre site sur Vercel fonctionne, il doit se connecter à votre base de données TiDB Cloud.

Le message "Impossible de charger les chats" (Erreur 500) signifie que Vercel n'a pas accès à votre base de données car il lui manque les informations de connexion (Mot de passe, Hôte, etc.).

## 1️⃣ Récupérer vos identifiants sur TiDB Cloud

1.  Connectez-vous à votre [Tableau de bord TiDB Cloud](https://tidbcloud.com/).
2.  Cliquez sur votre cluster (projet).
3.  Cliquez sur le bouton **Connect** (en haut à droite généralement).
4.  Dans la fenêtre qui s'ouvre, assurez-vous que l'onglet **"Standard Connection"** est sélectionné.
5.  Vous verrez les informations suivantes (notez-les ou gardez la fenêtre ouverte) :
    *   **Host** (ex: `gateway01.eu-central-1.prod.aws.tidbcloud.com`)
    *   **Port** (ex: `4000`)
    *   **User** (ex: `2N2Example.root`)
    *   **Password** (Si vous ne le connaissez pas, vous devrez peut-être le réinitialiser dans l'onglet "Security" ou "Users").
    *   **Database Name** (par défaut souvent `test`, mais assurez-vous d'utiliser le nom de votre base, ex: `animals` si vous l'avez créée).

## 2️⃣ Ajouter les Variables sur Vercel

1.  Allez sur votre tableau de bord [Vercel](https://vercel.com/dashboard).
2.  Cliquez sur votre projet **gestionnaire-de-chats**.
3.  Allez dans l'onglet **Settings** (Paramètres) en haut.
4.  Dans le menu de gauche, cliquez sur **Environment Variables**.
5.  Ajoutez les variables suivantes une par une :

| Nom (Key) | Valeur (Value) |
| :--- | :--- |
| `MYSQL_HOST` | *(Copiez le Host de TiDB)* |
| `MYSQL_PORT` | `4000` (TiDB utilise souvent 4000, vérifiez votre dashboard) |
| `MYSQL_USER` | *(Copiez le User de TiDB)* |
| `MYSQL_PASSWORD` | *(Votre mot de passe TiDB)* |
| `MYSQL_DATABASE` | `animals` (ou le nom de votre base créée sur TiDB) |

> **⚠️ Important :**
> *   TiDB nécessite une connexion sécurisée (SSL). J'ai déjà mis à jour votre code (`app.js`) pour gérer cela automatiquement.
> *   Assurez-vous que l'adresse IP de Vercel n'est pas bloquée. Dans TiDB Cloud, allez dans **"Network Access"** et cliquez sur **"Edit"** pour autoriser toutes les IP (`0.0.0.0/0`) si nécessaire pour le test.

## 3️⃣ Redéployer votre site

Une fois les variables ajoutées :

1.  Allez dans l'onglet **Deployments** sur Vercel.
2.  Cliquez sur le bouton **...** (trois points) à côté de votre dernier déploiement.
3.  Sélectionnez **Redeploy**.
4.  Confirmez en cliquant sur **Redeploy**.

⏳ **Attendez...**

Une fois redéployé, votre site devrait fonctionner !
