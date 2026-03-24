const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'votre_db',
  password: process.env.DB_PASSWORD || 'votre_mot_de_passe',
  port: process.env.DB_PORT || 5432,
});

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database connection successful',
      time: result.rows[0].now 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes CRUD pour enseignants
app.get('/enseignants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enseignant ORDER BY numens');
    // Transformer les données pour correspondre au format attendu par le frontend
    const transformedData = result.rows.map(row => ({
      numens: row.numens,
      nom: row.nom,
      nbheures: parseFloat(row.nbheures),
      tauxHoraire: parseFloat(row.tauxhoraire) // Corriger le nom du champ
    }));
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching enseignants:', error);
    res.status(500).json({ error: 'Failed to fetch enseignants' });
  }
});

app.post('/enseignants', async (req, res) => {
  const { nom, nbheures, tauxHoraire } = req.body; // Corriger le nom du champ
  try {
    const result = await pool.query(
      'INSERT INTO enseignant (nom, nbheures, tauxhoraire) VALUES ($1, $2, $3) RETURNING *',
      [nom, nbheures, tauxHoraire]
    );
    // Transformer la réponse pour correspondre au format attendu
    const newRow = result.rows[0];
    const transformedData = {
      numens: newRow.numens,
      nom: newRow.nom,
      nbheures: parseFloat(newRow.nbheures),
      tauxHoraire: parseFloat(newRow.tauxhoraire)
    };
    res.status(201).json(transformedData);
  } catch (error) {
    console.error('Error creating enseignant:', error);
    res.status(500).json({ error: 'Failed to create enseignant' });
  }
});

app.put('/enseignants/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, nbheures, tauxHoraire } = req.body; // Corriger le nom du champ
  try {
    const result = await pool.query(
      'UPDATE enseignant SET nom = $1, nbheures = $2, tauxhoraire = $3 WHERE numens = $4 RETURNING *',
      [nom, nbheures, tauxHoraire, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enseignant not found' });
    }
    // Transformer la réponse pour correspondre au format attendu
    const updatedRow = result.rows[0];
    const transformedData = {
      numens: updatedRow.numens,
      nom: updatedRow.nom,
      nbheures: parseFloat(updatedRow.nbheures),
      tauxHoraire: parseFloat(updatedRow.tauxhoraire)
    };
    res.json(transformedData);
  } catch (error) {
    console.error('Error updating enseignant:', error);
    res.status(500).json({ error: 'Failed to update enseignant' });
  }
});

app.delete('/enseignants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM enseignant WHERE numens = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enseignant not found' });
    }
    res.json({ message: 'Enseignant deleted successfully' });
  } catch (error) {
    console.error('Error deleting enseignant:', error);
    res.status(500).json({ error: 'Failed to delete enseignant' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
