# Évolution du Projet

## 15/08/2025

### Création de la Classe `UI` dans `src/ui.js`
- Intégration des potentiomètres ADSR et des gestionnaires d'événements pour mettre à jour les paramètres ADSR des voix actives.
- Ajout de la logique pour créer et afficher la timeline avec 4 pistes.
- Ajout de la méthode `addNoteIndicator` pour ajouter des indicateurs de note sur les pistes.
- Ajout de la logique pour sélectionner une piste en cliquant dessus ou en appuyant sur une touche du clavier (1 à 4).
- Correction de la sélection de la piste par clic et utilisation de la classe `selected` pour appliquer un dégradé bleu.

### Modification de `src/main.js`
- Création d'une instance de `UI` et passage de l'instance de `Synth` et `noteEmitter` à cette classe.
- Fusion des imports de `computeFrequency` et `Synth` en une seule ligne.
- Modification de l'appel de `playNote` pour inclure la piste sélectionnée et la position de la barre de défilement.
- Transmission des informations de la piste sélectionnée et de la position à `uiInstance`.
- Ajout de l'import de `timeline.css` pour charger les styles spécifiques à la timeline.
- Utilisation de `performance.now()` pour enregistrer les événements MIDI avec le temps en secondes.

### Modification du CSS pour Structurer Correctement l'Élément `main` et Supprimer les Doublons
- Réduction de la hauteur de `indicators` à 50px.
- Ajout d'une hauteur de 200px à `timeline`.
- Création de l'élément `main` pour structurer les éléments `indicators`, `timeline`, `controls` et `adsr-controls`.
- Suppression des doublons dans le CSS pour `#timeline`, `#track` et `#note-indicator`.
- Ajout de la classe `.track.selected` pour utiliser un dégradé bleu pour la sélection de la piste.

### Création de `timeline.js`
- Création de la classe `Timeline` pour gérer la timeline, la barre de défilement et les interactions avec les pistes.
- Ajout de la logique pour démarrer et arrêter la barre de défilement.
- Émission des événements de jeu de notes avec la position de la barre de défilement.

### Modification de `src/audio/synth.js`
- Ajout de la position de la barre de défilement comme paramètre dans la méthode `playNote`.
- Utilisation de la position pour ajuster la fréquence de la note dans la méthode `generate` de `PianoVoice`.

### Modification de `src/audio/pianoVoice.js`
- Ajout de la position de la barre de défilement comme paramètre dans le constructeur de `PianoVoice`.
- Utilisation de la position pour ajuster la fréquence de la note dans la méthode `generate`.

### Extraction des Styles de la Timeline dans `timeline.css`
- Extraction des styles spécifiques à la timeline dans `timeline.css`.
- Suppression des styles spécifiques à la timeline de `style.css`.

### Création de `record.js`
- Création de la classe `Record` pour gérer l'enregistrement des événements MIDI sur 4 pistes.
- Ajout des méthodes `startRecording`, `stopRecording` et `playRecording` dans `record.js`.
- Utilisation de `performance.now()` pour enregistrer les événements MIDI avec le temps en secondes.
- Sauvegarde des enregistrements dans des fichiers `.json` pour faciliter la lecture ultérieure.

### Modification de `src/ui.js` pour Utiliser la Classe `Record`
- Suppression des méthodes d'enregistrement redondantes dans `src/ui.js`.
- Ajout de l'import de `record.js` et utilisation de la classe `Record` pour gérer l'enregistrement.
- Ajout d'un gestionnaire d'événements pour la case à cocher de boucle pour activer ou désactiver la boucle lors de la lecture de l'enregistrement.
- Ajout de la logique pour rendre les boutons `record` et `play-record` actifs pendant leurs opérations respectives.
