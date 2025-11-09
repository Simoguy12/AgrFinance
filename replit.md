# AGR Finance - Application de Gestion Financière

## Vue d'ensemble
Application mobile-first de gestion financière pour le suivi des crédits, épargnes et comptes clients. L'application utilise une navigation à trois pages (Home, Add, Profile) avec six catégories principales.

## Architecture
- **Frontend**: React avec Vite, TypeScript, Wouter pour le routing
- **Backend**: Express.js avec API REST
- **Stockage**: In-memory storage (MemStorage)
- **UI**: Material Design avec Shadcn/UI, Tailwind CSS
- **Thème**: Vert primaire (#22c55e), police Inter

## Structure des données

### Types de clients
1. **Crédit** (code: CR-YYYY-XXX)
   - Calcul automatique des intérêts: 1 compte = 30 000 FCFA + 5 650 intérêts = 35 650 FCFA
   - Champs: nom, prénom, téléphone, activité, adresse, zone, nombre de comptes, garantie, échéance, date création

2. **Compte courant** (code: CC-YYYY-XXX)
   - Champs: nom, prénom, téléphone, activité, adresse, zone, date création

3. **Carte de pointage** (code: CP-YYYY-XXX)
   - Champs: nom, prénom, téléphone, activité, zone, montant, date création

### Statuts des clients
- `active`: Client actif
- `settled`: Compte soldé
- `litigation`: En contentieux

## Pages principales

### 1. Home (/)
Menu principal avec navigation vers:
- Crédit
- Épargne (avec onglets Carte de pointage et Compte courant)
- Soldé (avec onglets Crédit et Épargne)
- Contentieux
- Performance
- Corbeille

### 2. Add (/add)
Sélection du type de formulaire:
- Nouveau crédit
- Nouveau compte courant
- Nouvelle carte de pointage

### 3. Formulaires de création
- `/add/credit`: Formulaire de création de crédit
- `/add/compte-courant`: Formulaire de création de compte courant
- `/add/carte-pointage`: Formulaire de création de carte de pointage

### 4. Pages de liste
- `/credit`: Liste des crédits actifs
- `/epargne`: Liste des épargnes (onglets Carte de pointage et Compte courant)
- `/solde`: Comptes soldés (onglets Crédit et Épargne)
- `/contencieux`: Comptes en contentieux

## Zones disponibles
Marchés et quartiers de Pointe-Noire:
- Marché Total
- Marché Fond Tié Tié
- Marché Châteaux
- Marché Mongali
- Marché Vindoulou
- Tié-Tié
- Mvou-Mvou
- Loandjili
- Ngoyo
- Mpaka
- Centre-ville

## API Endpoints

### GET /api/clients
Récupère tous les clients

### POST /api/clients
Crée un nouveau client
Body: InsertClient (codeCompte, type, nom, prenom, telephone, activite, zone, etc.)

### PATCH /api/clients/:id
Met à jour un client (changement de statut, etc.)

### DELETE /api/clients/:id
Supprime un client

## Flux de travail

1. **Création**: Utilisateur remplit un formulaire → Client créé avec code auto-généré
2. **Liste active**: Client apparaît dans sa liste respective (Crédit ou Épargne)
3. **Solder**: Bouton "Solder" → Client déplacé vers page Soldé
4. **Contentieux**: Bouton "Contentieux" (crédits uniquement) → Client déplacé vers page Contentieux

## Calcul automatique des intérêts
Pour les crédits:
- Base par compte: 30 000 FCFA
- Intérêt par compte: 5 650 FCFA
- Total par compte: 35 650 FCFA
- Exemple: 6 comptes = 180 000 FCFA base + 33 900 FCFA intérêts = 213 900 FCFA

## Technologies utilisées
- React Query (@tanstack/react-query) pour la synchronisation des données
- Wouter pour le routing
- Zod pour la validation
- date-fns pour la gestion des dates
- Lucide React pour les icônes
