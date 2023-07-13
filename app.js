const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const dbConfig = require('./config');

app.listen(8080, () => {
    console.log('Serveur démarré sur le port 8080');
});

// Fonction de résolution pour la requête dayOfWeek
const getDayOfWeek = (args) => {
  const { date } = args;

  // Effectuer les calculs pour obtenir le jour de la semaine correspondant à la date
  const [day, month, year] = date.split('-');
  const jsDate = new Date(year, month - 1, day);
  const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const dayOfWeek = daysOfWeek[jsDate.getDay()];

  // Enregistrer l'historique dans la base de données
  const searchDate = new Date().toISOString();
  const searchItems = JSON.stringify({ request: date, response: { date, day: dayOfWeek } });
  const query = `INSERT INTO historique (searchDate, searchItems) VALUES (?, ?)`;
  dbConfig.query(query, [searchDate, searchItems]);

  return { date, day: dayOfWeek };
};


const app = express();

// Endpoint GraphQL
app.use('/dayfinder', graphqlHTTP({
  schema: schema,
  rootValue: { dayOfWeek: getDayOfWeek },
  graphiql: true,
}));

// Route pour accéder à l'historique
app.get('/dayfinder/historique', (req, res) => {
  const query = `SELECT * FROM historique`;
  dbConfig.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'historique :', error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération de l\'historique.' });
    } else {
      res.json(results);
    }
  });
});
