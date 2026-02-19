require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/public'));
const PORT = 3000;

//app.use(express.json());
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.hubapi.com/crm/v3/objects/2-225653018',
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
        params: {
          properties: 'name,author,genre'
        }
      }
    );

    res.render('homepage', {
      title: 'Homepage | Integrating With HubSpot I Practicum',
      objects: response.data.results
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error fetching data');
  }
});


app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  const { name, author, genre } = req.body;

  try {
    await axios.post(
      'https://api.hubapi.com/crm/v3/objects/2-225653018',
      {
        properties: {
          name,
          author,
          genre
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.redirect('/');

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error creating record');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000}`);
});



// * Localhost
//app.listen(3000, () => console.log('Listening on http://localhost:3000'));