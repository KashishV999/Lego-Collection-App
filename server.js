/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: _____Kahsish Verma_________________ Student ID: ____151579232__________ Date: _____11 october 2024_________
*
* Published URL: _________________https://web322-8jom-pd15kw8ll-kashishv999s-projects.vercel.app__________________________________________
*
********************************************************************************/



const express = require('express'); 
const legoData = require("./modules/legoSets");
const path = require('path');

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8080;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize legoData before starting the server
legoData.initialize()
  .then(() => {
    console.log('Lego data initialized successfully.');

    // Route for home.html
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'home.html')); // Serve home.html file
    });

    // Route for about.html
    app.get('/about', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'about.html')); // Serve about.html file
    });

    // Route for /lego/sets with optional theme query parameter
    app.get('/lego/sets', (req, res) => {
      const theme = req.query.theme;

      if (theme) {
        legoData.getSetsByTheme(theme)
          .then((setsByTheme) => {
            if (setsByTheme.length > 0) {
              res.json(setsByTheme); // Return Lego sets filtered by theme
            } else {
              res.status(404).send(`No sets found for the theme: ${theme}`); // 404 if no sets match theme
            }
          })
          .catch((error) => {
            res.status(404).send('Error fetching Lego sets by theme: ' + error); // Handle error
          });
      } else {
        legoData.getAllSets()
          .then((allSets) => {
            res.json(allSets); // Return all Lego sets if no theme is provided
          })
          .catch((error) => {
            res.status(404).send('Error fetching Lego sets: ' + error); // Handle error
          });
      }
    });

    // Route for fetching Lego set by set_num
    app.get('/lego/sets/:set_num', (req, res) => {
      const setNum = req.params.set_num;

      legoData.getSetByNum(setNum)
        .then((set) => {
          if (set) {
            res.json(set); // Return Lego set by set_num
          } else {
            res.status(404).send(`No Lego set found with set_num: ${setNum}`); // 404 if set not found
          }
        })
        .catch((error) => {
          res.status(404).send('Error fetching Lego set: ' + error); // Handle error
        });
    });

    // Custom 404 error page
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); // Serve custom 404 page
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log(`Server is running on port ${HTTP_PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize lego data:', error);
  });
