-- Création de la table enseignant
CREATE TABLE IF NOT EXISTS enseignant (
    numens SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    nbheures DECIMAL(10,2) NOT NULL DEFAULT 0,
    tauxhoraire DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- Insertion de données de test (optionnel)
INSERT INTO enseignant (nom, nbheures, tauxhoraire) VALUES
('Dupont', 20.5, 35.00),
('Martin', 15.0, 40.00),
('Bernard', 25.0, 32.50)
ON CONFLICT DO NOTHING;
