# Horloge combinée — Analogique + Numérique

## Nom et description du projet

**Horloge combinée** est une application web qui affiche simultanément une horloge analogique et une horloge numérique. L'application permet d'afficher plusieurs fuseaux horaires, avec la possibilité de personnaliser les horloges en termes d'affichage (analogique, numérique) et de couleur. Elle est entièrement responsive et fonctionne sur tous les appareils modernes.

---

## Technologies utilisées

- **HTML5** : Structure de la page avec sémantique moderne.
- **CSS3** : Utilisation de variables CSS pour la personnalisation du thème, mise en page responsive et gestion des animations des aiguilles.
- **JavaScript (ES6+)** : Manipulation du DOM, gestion des fuseaux horaires avec `Intl.DateTimeFormat`, mise à jour en temps réel des horloges.
- **API `Intl.DateTimeFormat`** : Pour gérer les fuseaux horaires de manière précise.

---

## Fonctionnalités principales

- 🕒 **Horloge analogique** : Affichage de l'heure avec des aiguilles en temps réel.
- 💻 **Horloge numérique** : Affichage de l'heure au format 12h ou 24h.
- 🌍 **Support multi-fuseaux horaires** : Ajout de fuseaux horaires personnalisés avec une liste déroulante.
- 🎨 **Personnalisation** : Choix de la couleur d'accent et possibilité de masquer/afficher l'horloge analogique ou numérique.
- 📱 **Responsive** : L'application s'ajuste automatiquement à la taille de l'écran de l'utilisateur.
- ⏱️ **Mise à jour en temps réel** : Affichage de l'heure locale et des autres fuseaux horaires avec une mise à jour régulière (200ms).

---

## Lien vers la page GitHub Pages (rendu final)

https://walidboussetta.github.io/boussetta_walid_Horloge-numerique-et-analogique/
---

## Nouveautés explorées

Pendant le développement de ce projet, plusieurs concepts intéressants ont été explorés :

- **Manipulation des fuseaux horaires** : L'utilisation de l'API `Intl.DateTimeFormat` a permis de gérer efficacement les fuseaux horaires et de créer des horloges précises pour différents emplacements.
- **CSS moderne** : L'application des variables CSS pour gérer la couleur d'accent et la mise en page responsive a simplifié la gestion du thème et du design de l'interface.
- **Animations fluides avec CSS** : Les transitions des aiguilles de l'horloge ont été améliorées pour rendre l'expérience plus naturelle et fluide.

---

## Difficultés rencontrées

- **Problème avec les fuseaux horaires** : Certains navigateurs n'avaient pas un support complet pour l'API `Intl.supportedValuesOf('timeZone')`, ce qui a rendu la gestion des fuseaux horaires plus compliquée.
- **Précision des heures** : Calculer les angles de rotation des aiguilles de l'horloge de manière fluide a posé des défis, notamment en ce qui concerne la gestion de la transition de la trotteuse des secondes.
- **Compatibilité des navigateurs** : Certains anciens navigateurs n'avaient pas un support complet pour certaines fonctionnalités modernes du JavaScript, notamment la gestion de la date et de l'heure.

---

## Solutions apportées

- **Fallback pour les fuseaux horaires** : En cas de problème avec l'API `Intl.supportedValuesOf`, un tableau de fuseaux horaires prédéfini a été utilisé pour garantir que l'application fonctionne sur tous les navigateurs.
- **Optimisation des calculs d'angles** : Les angles des aiguilles ont été optimisés pour éviter les sauts ou les glitches lors du changement de seconde, minute et heure.
- **Tests de compatibilité** : Des tests ont été effectués sur différents navigateurs et des solutions de compatibilité ont été intégrées pour garantir un fonctionnement optimal.

---

## 🎛 Options d’interface

- **Bouton “+ Ajouter”** : Ajoute une horloge pour un fuseau horaire spécifique.
- **Basculement entre analogique et numérique** : Permet de cacher ou afficher l'horloge analogique ou numérique via des cases à cocher.
- **Personnalisation des couleurs** : Choisissez la couleur d’accent pour la trotteuse, le titre et l'arrière-plan.

---

## 👨‍💻 Auteur

Walid Boussetta (MI2A)

---

