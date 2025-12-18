# 🚀 Guide de Déploiement sur Railway

Ce guide vous explique comment déployer gratuitement votre application **Gestionnaire de Chats** sur Railway avec une base de données MySQL.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Un compte Railway (gratuit - $5 de crédit/mois)
- Git installé sur votre machine

---

## 🎯 Étape 1 : Préparer votre Code pour GitHub

### 1.1 Initialiser Git (si ce n'est pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit - Ready for Railway deployment"
```

### 1.2 Créer un Repository sur GitHub

1. Allez sur [GitHub](https://github.com)
2. Cliquez sur **"New repository"**
3. Nommez-le `gestionnaire-de-chats`
4. **Ne cochez PAS** "Initialize with README" (vous avez déjà du code)
5. Cliquez sur **"Create repository"**

### 1.3 Pousser votre Code vers GitHub

```bash
git remote add origin https://github.com/VOTRE-USERNAME/gestionnaire-de-chats.git
git branch -M main
git push -u origin main
```

---

## 🚂 Étape 2 : Créer un Compte Railway

1. Allez sur [Railway.app](https://railway.app)
2. Cliquez sur **"Start a New Project"**
3. Connectez-vous avec votre compte GitHub
4. Autorisez Railway à accéder à vos repositories

---

## 🗄️ Étape 3 : Créer la Base de Données MySQL

### 3.1 Créer un Nouveau Projet

1. Dans Railway, cliquez sur **"New Project"**
2. Sélectionnez **"Provision MySQL"**
3. Railway va créer automatiquement une base de données MySQL

### 3.2 Récupérer les Variables de Connexion

1. Cliquez sur votre service **MySQL**
2. Allez dans l'onglet **"Variables"**
3. Vous verrez automatiquement :
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_PORT`

> **Note** : Railway génère ces variables automatiquement, vous n'avez rien à faire !

### 3.3 Importer le Schéma de la Base de Données

1. Cliquez sur votre service MySQL
2. Allez dans l'onglet **"Data"**
3. Cliquez sur **"Query"**
4. Copiez-collez le contenu du fichier `database.sql`
5. Cliquez sur **"Execute"**

Ou utilisez un client MySQL (comme MySQL Workbench) avec les informations de connexion.

---

## 🚀 Étape 4 : Déployer l'Application Backend

### 4.1 Ajouter le Service Backend

1. Dans votre projet Railway, cliquez sur **"New Service"**
2. Sélectionnez **"GitHub Repo"**
3. Choisissez votre repository `gestionnaire-de-chats`
4. Railway va automatiquement détecter que c'est une application Node.js

### 4.2 Configurer les Variables d'Environnement

Railway va **automatiquement** lier votre application à la base de données MySQL ! Les variables suivantes seront disponibles :

- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT`
- `PORT` (géré par Railway)

> **Astuce** : Vous n'avez rien à configurer manuellement, Railway fait tout automatiquement ! 🎉

### 4.3 Vérifier le Déploiement

1. Railway va automatiquement :
   - Installer les dépendances (`npm install`)
   - Démarrer l'application (`npm start`)
2. Attendez quelques minutes
3. Vous verrez **"Success"** quand c'est prêt

---

## 🌐 Étape 5 : Obtenir l'URL Publique

### 5.1 Générer un Domaine Public

1. Cliquez sur votre service **Backend**
2. Allez dans l'onglet **"Settings"**
3. Trouvez la section **"Networking"**
4. Cliquez sur **"Generate Domain"**
5. Railway va créer une URL comme : `https://votre-app.up.railway.app`

### 5.2 Tester votre Application

Ouvrez votre navigateur et testez :

- **Interface** : `https://votre-app.up.railway.app/`
- **API Cats** : `https://votre-app.up.railway.app/cats`
- **API Tags** : `https://votre-app.up.railway.app/tags`

---

## ✅ Étape 6 : Vérification Finale

### Checklist de Vérification

- [ ] La page d'accueil s'affiche correctement
- [ ] Les chats sont affichés (données de la base de données)
- [ ] Le filtre par tag fonctionne
- [ ] La recherche fonctionne
- [ ] L'ajout d'un nouveau chat fonctionne
- [ ] La modification d'un chat fonctionne
- [ ] La suppression d'un chat fonctionne

---

## 🔄 Déploiement Automatique

Railway est configuré pour le **déploiement automatique** :

1. Faites des modifications dans votre code local
2. Committez et poussez vers GitHub :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```
3. Railway va **automatiquement** redéployer votre application ! 🚀

---

## 💰 Plan Gratuit Railway

Le plan gratuit de Railway offre :

- ✅ **$5 de crédit gratuit par mois**
- ✅ **Backend Node.js + MySQL** sur la même plateforme
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **SSL/HTTPS automatique**
- ✅ **Pas de carte de crédit requise**

Pour votre application, cela représente :
- ~500 heures d'exécution par mois
- Largement suffisant pour un projet personnel ou de démonstration

---

## 🆘 Dépannage

### Problème : L'application ne démarre pas

1. Vérifiez les logs dans Railway :
   - Cliquez sur votre service Backend
   - Allez dans l'onglet **"Deployments"**
   - Cliquez sur le dernier déploiement
   - Consultez les logs

### Problème : Erreur de connexion à la base de données

1. Vérifiez que le service MySQL est bien démarré
2. Vérifiez que les variables d'environnement sont bien liées
3. Dans les paramètres du Backend, vérifiez la section **"Variables"**

### Problème : Les images ne s'affichent pas

Les images doivent être dans le dossier `public/`. Assurez-vous qu'elles sont bien committées dans Git.

---

## 📚 Ressources Utiles

- [Documentation Railway](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Repository](https://github.com/VOTRE-USERNAME/gestionnaire-de-chats)

---

## 🎉 Félicitations !

Votre application est maintenant déployée et accessible publiquement ! Vous pouvez partager l'URL avec qui vous voulez ! 🚀

**URL de votre application** : `https://votre-app.up.railway.app`
