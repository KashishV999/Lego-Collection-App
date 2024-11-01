/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: ______Kashish Verma________________ Student ID: 151579232______________ Date: ______31 October 2024________
*
* Published URL: ______________________https://web322-lovat.vercel.app/_____________________________________
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require("path");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));


app.set('view engine', 'ejs'); 
app.use(express.static('public'));

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
    res.render("sets", { sets }); 
  } catch (err) {
    res.status(404).render("404", { message: err });
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
