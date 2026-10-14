-- ============================================================
--  Base de données : emploi_du_temps
--  Institut Sup'Horizons — Projet SGBDR


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Supprimer et recréer la base
DROP DATABASE IF EXISTS emploi_du_temps;
CREATE DATABASE emploi_du_temps
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE emploi_du_temps;

-- ============================================================
-- 1. TABLE ENSEIGNANT
-- ============================================================
CREATE TABLE Enseignant (
  id_enseignant VARCHAR(50)  NOT NULL,
  nom           VARCHAR(50)  NOT NULL,
  prenom        VARCHAR(50)  NOT NULL,
  email         VARCHAR(50)  NOT NULL,
  specialite    VARCHAR(50)  DEFAULT NULL,
  PRIMARY KEY (id_enseignant),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. TABLE SALLE
-- ============================================================
CREATE TABLE Salle (
  id_salle   VARCHAR(50) NOT NULL,
  nom_salle  VARCHAR(50) NOT NULL,
  capacite   INT         DEFAULT NULL,
  equipement VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id_salle),
  UNIQUE KEY uq_nom_salle (nom_salle),
  CONSTRAINT chk_capacite CHECK (capacite > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. TABLE COURS  (dépend de Enseignant)
-- ============================================================
CREATE TABLE Cours (
  id_cours       VARCHAR(50) NOT NULL,
  intitule       VARCHAR(50) DEFAULT NULL,
  volume_horaire INT         DEFAULT NULL,
  id_enseignant  VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_cours),
  CONSTRAINT fk_cours_enseignant
    FOREIGN KEY (id_enseignant)
    REFERENCES Enseignant(id_enseignant)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. TABLE SEANCE  (dépend de Enseignant, Salle, Cours)
-- ============================================================
CREATE TABLE Seance (
  id_seance     VARCHAR(50) NOT NULL,
  date_seance   DATE        NOT NULL,
  heure_debut   TIME        NOT NULL,
  heure_fin     TIME        NOT NULL,
  id_enseignant VARCHAR(50) NOT NULL,
  id_salle      VARCHAR(50) NOT NULL,
  id_cours      VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_seance),
  CONSTRAINT chk_horaires CHECK (heure_fin > heure_debut),
  CONSTRAINT fk_seance_enseignant
    FOREIGN KEY (id_enseignant)
    REFERENCES Enseignant(id_enseignant)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_seance_salle
    FOREIGN KEY (id_salle)
    REFERENCES Salle(id_salle)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_seance_cours
    FOREIGN KEY (id_cours)
    REFERENCES Cours(id_cours)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. INSERTION DES DONNÉES DE TEST
-- ============================================================

INSERT INTO Enseignant VALUES
  ('E01', 'Rakoto',  'Soa',   'soa@suphorizons.mg',   'SGBDR'),
  ('E02', 'Fenitra', 'Jaona', 'jaona@suphorizons.mg', 'Réseaux'),
  ('E03', 'Andry',   'Haja',  'haja@suphorizons.mg',  'Java');

INSERT INTO Salle VALUES
  ('S01', 'Salle A',    40, 'Projecteur'),
  ('S02', 'Salle B',    20, 'Tableau blanc'),
  ('S03', 'Labo Info',  25, 'PC + Projecteur');

INSERT INTO Cours VALUES
  ('C01', 'Base de données', 40, 'E01'),
  ('C02', 'Réseaux',         30, 'E02'),
  ('C03', 'Java',            35, 'E03');

INSERT INTO Seance VALUES
  ('SE01', '2025-09-01', '08:00', '10:00', 'E01', 'S01', 'C01'),
  ('SE02', '2025-09-01', '10:00', '12:00', 'E02', 'S02', 'C02'),
  ('SE03', '2025-09-02', '08:00', '10:00', 'E03', 'S03', 'C03'),
  ('SE04', '2025-09-02', '14:00', '16:00', 'E01', 'S01', 'C01');

-- ============================================================
-- 6. EXEMPLES DE REQUÊTES
-- ============================================================

-- Voir toutes les tables
-- SHOW TABLES;

-- Emploi du temps complet (jointures)
-- SELECT
--   s.id_seance,
--   s.date_seance,
--   s.heure_debut,
--   s.heure_fin,
--   CONCAT(e.nom, ' ', e.prenom) AS enseignant,
--   sa.nom_salle,
--   c.intitule AS cours
-- FROM Seance s
-- JOIN Enseignant e  ON s.id_enseignant = e.id_enseignant
-- JOIN Salle sa      ON s.id_salle      = sa.id_salle
-- JOIN Cours c       ON s.id_cours      = c.id_cours
-- ORDER BY s.date_seance, s.heure_debut;

-- Modifier l'email d'un enseignant
-- UPDATE Enseignant SET email = 'nouveau@mail.mg' WHERE id_enseignant = 'E01';

-- Supprimer dans le bon ordre
-- DELETE FROM Seance      WHERE id_seance = 'SE04';
-- DELETE FROM Cours       WHERE id_cours  = 'C03';
-- DELETE FROM Enseignant  WHERE id_enseignant = 'E03';

COMMIT;
