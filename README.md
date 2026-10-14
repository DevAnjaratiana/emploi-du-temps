# 📅 Emploi du Temps - Gestion Académique

Application fullstack de gestion d'emploi du temps pour un institut scolaire.


## 📖 Description

Application web complète permettant de gérer :
- Les **enseignants**
- Les **salles**
- Les **cours**
- Les **séances** (avec calendrier visuel)

Le système détecte automatiquement les **conflits de planning** (enseignant ou salle déjà occupé) et propose un **dashboard** avec statistiques et graphiques.

---

## ✨ Fonctionnalités

### 📊 Dashboard
- Cartes de statistiques (enseignants, salles, cours, séances)
- Graphique barres : séances par jour (14 derniers jours)
- Graphique camembert : occupation des salles
- Graphique horizontal : séances par enseignant
- Séances du jour en temps réel

### 👨‍🏫 Gestion des Enseignants
- Liste avec recherche par nom/spécialité
- Ajouter un enseignant
- Modifier un enseignant
- Supprimer (bloqué si l'enseignant a des séances)

### 🏫 Gestion des Salles
- Liste avec capacité et équipement
- Ajouter / Modifier / Supprimer
- Voir le taux d'occupation de chaque salle
- Bloqué si la salle a des séances actives

### 📚 Gestion des Cours
- Liste avec l'enseignant responsable
- Ajouter / Modifier / Supprimer
- Lien vers les séances du cours

### 📅 Gestion des Séances
- Calendrier visuel (FullCalendar) avec vue semaine/mois
- Ajouter une séance via clic sur un créneau
- Modifier / Supprimer une séance
- **Détection automatique des conflits** :
  - ❌ Enseignant déjà occupé à ce créneau
  - ❌ Salle déjà réservée à ce créneau
- Filtres : par enseignant, par salle, par cours, par date

### ⚠️ Gestion des erreurs
- Messages d'erreur clairs
- Confirmation avant suppression
- Notifications de succès

---

## 🛠 Technologies

### Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Python** | 3.12 | Langage |
| **Django** | 6.1 | Framework |
| **Django REST Framework** | 3.18 | API REST |
| **MySQL** | 8.0 | Base de données |
| **django-cors-headers** | 4.9 | CORS |

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.3 | Framework UI |
| **Vite** | 8.2 | Build tool |
| **React Router** | 7.18 | Navigation |
| **Axios** | 1.6 | Requêtes HTTP |
| **Tailwind CSS** | 3.4 | Styles |
| **FullCalendar** | 6.1 | Calendrier |
| **Recharts** | 2.12 | Graphiques |

### Outils
- **WAMP** : Serveur local MySQL
- **phpMyAdmin** : Gestion BDD
- **Git** : Versioning
- **VS Code** : Éditeur

