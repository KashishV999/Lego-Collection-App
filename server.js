/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: ______Kashish Verma________________ Student ID: 151579232______________ Date: ______22 November 2024_______
*
* Published URL: _________https://web322-lovat.vercel.app/_________________________________________________
*
********************************************************************************/




const legoData = require("./modules/legoSets");
const path = require("path");
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const HTTP_PORT = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));


app.set('view engine', 'ejs'); 
app.use(express.static('public'));

const legoSets = require('./modules/legoSets'); 


//Get Route for addSet
app.get('/lego/addSet', (req, res) => {
  legoSets.getAllThemes()
    .then((themes) => {
      res.render('addSet', { themes, page: '/lego/addSet' }); // Pass the page variable
    })
    .catch((err) => {
      res.render('500', { message: `Error fetching themes: ${err.message}` });
    });
});


//Post Route for addSet
app.post('/lego/addSet', (req, res) => {
  legoSets.addSet(req.body)
    .then(() => {
      res.redirect('/lego/sets');
    })
    .catch((err) => {
      res.render('500', { message: `Error adding set: ${err}` });
    });
});

//Get Route for editSet
app.get('/lego/editSet/:num', (req, res) => {
  const setNum = req.params.num;
  Promise.all([
    legoSets.getSetByNum(setNum),
    legoSets.getAllThemes(),
  ])
    .then(([set, themes]) => {
      res.render('editSet', { set, themes });
    })
    .catch((err) => {
      res.status(404).render('404', { message: `Error loading set: ${err.message}` });
    });
});

//Post Route for editSet
app.post('/lego/editSet', (req, res) => {
  legoSets.editSet(req.body.set_num, req.body)
    .then(() => {
      res.redirect('/lego/sets');
    })
    .catch((err) => {
      res.render('500', { message: `Error updating set: ${err}` });
    });
});


// Route to delete a set by its set number
app.get('/lego/deleteSet/:num', (req, res) => {
  const setNum = req.params.num; 

  legoSets.deleteSet(setNum) 
    .then(() => {

      res.redirect('/lego/sets');
    })
    .catch((err) => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});


// Route for the home page
app.get('/', (req, res) => {
  res.render("home"); 
});

// Route for the about page
app.get('/about', (req, res) => {
  res.render("about"); 
});



app.get("/lego/sets", async (req, res) => {
  try {
    let sets;
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }
    console.log(sets); // Inspect the data structure
    res.render("sets", { sets });
  } catch (err) {
    res.status(404).render("404", { message: err.message });
  }
});


// Route for a specific Lego set by set number
app.get("/lego/sets/:num", async (req, res) => {
  try {
    let legoSet = await legoData.getSetByNum(req.params.num); 
    res.render("set", { set: legoSet }); 
  } catch (err) {
    res.status(404).render("404", { message: `Set with number ${req.params.num} not found.` });
  }
});

// Custom 404 page
app.use((req, res) => {
  res.status(404).render("404", { message: "I'm sorry, the page you're looking for does not exist." });
});

// Initialize data and start the server
legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
});