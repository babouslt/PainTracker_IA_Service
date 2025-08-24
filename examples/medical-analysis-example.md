# Exemple d'utilisation du Template d'Analyse Médicale

## Template : medical_analysis

Ce template permet d'analyser des symptômes médicaux basés sur une image du corps avec une zone encadrée et les informations du patient.

## Utilisation

### Requête API

```bash
POST /api/ai/analyze
Content-Type: multipart/form-data

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

### Exemple de réponse attendue

```json
{
  "success": true,
  "data": {
    "response": "Ceci est une analyse préliminaire uniquement. Consultez un professionnel de santé pour un diagnostic définitif.

## ANALYSE PRÉLIMINAIRE

### 1. Hypothèses diagnostiques possibles

**a) Entorse ligamentaire du genou**
- Explication : Lésion des ligaments stabilisateurs du genou
- Facteurs de risque : Activités sportives, mouvements brusques
- Symptômes typiques : Douleur, gonflement, instabilité

**b) Méniscopathie**
- Explication : Lésion du cartilage méniscal
- Facteurs de risque : Sports de pivot, âge, surcharge
- Symptômes typiques : Douleur mécanique, blocages, craquements

**c) Tendinite rotulienne**
- Explication : Inflammation du tendon rotulien
- Facteurs de risque : Sports de saut, surcharge mécanique
- Symptômes typiques : Douleur antérieure du genou

### 2. Tests d'identification

**Tests à faire à la maison :**
- Test de stabilité : Debout, genou légèrement fléchi
- Test de douleur : Palpation de la rotule
- Test de mobilité : Flexion/extension complète

**Signes à surveiller :**
- Aggravation de la douleur
- Apparition d'instabilité
- Augmentation du gonflement

### 3. Conseils de soulagement temporaire

**Méthodes non-médicamenteuses :**
- Repos relatif (éviter les activités douloureuses)
- Application de glace 15-20 min, 3-4 fois/jour
- Surélévation de la jambe
- Bandage de contention léger

**Positions à adopter :**
- Genou en position neutre
- Éviter la flexion complète
- Utiliser des béquilles si nécessaire

**Activités à limiter :**
- Sports de contact
- Escaliers
- Position accroupie prolongée

### 4. Signes d'alerte

**Consultez immédiatement si :**
- Douleur insupportable
- Gonflement important et rapide
- Sensation d'instabilité majeure
- Fièvre associée
- Déformation visible du genou

### 5. Recommandation finale

**Type de professionnel à consulter :**
- Médecin généraliste en premier
- Orthopédiste si nécessaire
- Kinésithérapeute pour la rééducation

**Délai recommandé :**
- Consultation dans les 48-72h si douleur modérée
- Consultation immédiate si signes d'alerte

⚠️ **IMPORTANT :** Cette analyse ne remplace pas une consultation médicale. Consultez un professionnel de santé pour un diagnostic précis et un traitement adapté.",
    "usage": {
      "prompt_tokens": 450,
      "completion_tokens": 380,
      "total_tokens": 830
    },
    "analysisId": "64f8a1b2c3d4e5f6a7b8c9d0",

  }
}
```

## Autres exemples d'utilisation

### Exemple 2 : Douleur au dos

```bash
# Données du formulaire
age: 45
sexe: Femme
taille: 160
poids: 65
symptomes: Douleur chronique dans le bas du dos, irradiant vers la jambe droite, aggravée par la position assise prolongée, améliorée par le repos
niveauDouleur: 6

# Fichier image
image: [fichier image dos uploadé]
```

### Exemple 3 : Douleur à l'épaule

```bash
# Données du formulaire
age: 32
sexe: Homme
taille: 180
poids: 75
symptomes: Douleur lors de l'élévation du bras, difficulté à dormir sur le côté gauche, douleur qui s'aggrave la nuit
niveauDouleur: 5

# Fichier image
image: [fichier image épaule uploadé]
```

## Points importants

1. **Limitation de responsabilité** : Le template inclut toujours des avertissements sur le caractère préliminaire de l'analyse
2. **Recommandation systématique** : Chaque réponse recommande de consulter un professionnel
3. **Structure cohérente** : Format standardisé pour faciliter la lecture
4. **Langage accessible** : Terminologie médicale expliquée simplement

## Champs requis

- `userId` : ID de l'utilisateur (chaîne de caractères)
- `age` : Âge du patient (en années)
- `sexe` : Sexe du patient (Homme/Femme)
- `taille` : Taille en centimètres
- `poids` : Poids en kilogrammes
- `image` : Fichier image du corps avec la zone concernée encadrée
- `symptomes` : Description détaillée des symptômes
- `niveauDouleur` : Niveau de douleur sur une échelle de 1 à 10

## Format d'image

L'image doit :

- Être uploadée via le champ `image`
- Montrer clairement la zone du corps concernée
- Idéalement avoir la zone douloureuse encadrée ou mise en évidence
- Être au format JPEG, PNG, WebP ou GIF
- Ne pas dépasser 5MB
