# Service IA - ChatGPT Integration

Ce service permet d'intégrer l'IA de ChatGPT dans votre application via une API REST.

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Configurer les variables d'environnement :

   - Copier `.env_exemple` vers `.env`
   - Remplacer `your_openai_api_key_here` par votre vraie clé API OpenAI
   - Vérifier que MongoDB est configuré correctement

3. Démarrer le serveur :

```bash
npm run dev
```

## Utilisation

### Analyse Médicale Préliminaire

Le service fournit une analyse médicale préliminaire basée sur les informations du patient et les symptômes décrits.

#### Endpoint

```bash
POST /api/ai/analyze
Content-Type: application/json
```

#### Body de la requête (multipart/form-data)

```bash
# Données du formulaire
userId: user123
age: 28
sexe: Homme
taille: 175
poids: 70
symptomes: Douleur vive lors de la flexion du genou, gonflement visible, difficulté à monter les escaliers, craquement lors du mouvement
niveauDouleur: 8

# Fichier image
image: [fichier image uploadé]
```

#### Réponse

```json
{
  "success": true,
  "data": {
    "response": "Ceci est une analyse préliminaire uniquement. Consultez un professionnel de santé pour un diagnostic définitif.\n\n## ANALYSE PRÉLIMINAIRE\n\n### 1. Hypothèses diagnostiques possibles\n\n**a) Entorse ligamentaire du genou**\n- Explication : Lésion des ligaments stabilisateurs du genou\n- Facteurs de risque : Activités sportives, mouvements brusques\n- Symptômes typiques : Douleur, gonflement, instabilité\n\n[... suite de l'analyse ...]",
    "usage": {
      "prompt_tokens": 450,
      "completion_tokens": 380,
      "total_tokens": 830
    }
  }
}
```

### Validation des données

Le service valide automatiquement :

- **ID Utilisateur** : Chaîne de caractères requise
- **Âge** : Entre 1 et 120 ans
- **Sexe** : "Homme" ou "Femme"
- **Taille** : Entre 50 et 250 cm
- **Poids** : Entre 1 et 300 kg
- **Image** : Fichier image uploadé (max 5MB)
- **Symptômes** : Entre 10 et 1000 caractères
- **Niveau de douleur** : Entre 1 et 10

### Format d'image supporté

L'image uploadée peut être au format :

- JPEG, JPG
- PNG
- WebP
- GIF (première frame)

**Taille maximum** : 5MB

Voir `examples/medical-analysis-example.md` pour des exemples détaillés.

## Configuration

- **Model** : GPT-4o-mini
- **Max tokens** : 1000
- **Temperature** : 0.7 (créativité modérée)

## Base de données

Le service sauvegarde automatiquement :

- **Demande** : Toutes les données de la requête
- **Réponse** : L'analyse générée par l'IA
- **Métadonnées** : Timestamp, usage des tokens, etc.
- **Liaison** : Chaque analyse est liée à l'utilisateur

## Historique des analyses

### Récupérer l'historique d'un utilisateur

```bash
GET /api/history/user/:userId?page=1&limit=10
```

### Récupérer une analyse spécifique

```bash
GET /api/history/analysis/:analysisId?userId=user123
```

### Supprimer une analyse

```bash
DELETE /api/history/analysis/:analysisId
Content-Type: application/json

{
  "userId": "user123"
}
```

## Variables d'environnement requises

- `OPENAI_API_KEY` : Votre clé API OpenAI
- `PORT` : Port du serveur (défaut: 3001)
- `NODE_ENV` : Environnement (development/production)
