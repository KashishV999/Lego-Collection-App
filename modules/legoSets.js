require('dotenv').config(); // Load environment variables
require('pg');
const Sequelize = require('sequelize'); // Import Sequelize

// Set up Sequelize to point to our Postgres database
const sequelize = new Sequelize(
  process.env.PGDATABASE, 
  process.env.PGUSER,     
  process.env.PGPASSWORD, 
  {
    host: process.env.PGHOST, 
    dialect: 'postgres',     
    port: 5432,              
    dialectOptions: {
      ssl: { rejectUnauthorized: false }, 
    },
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Theme model
const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt
});

// Set model
const Set = sequelize.define('Set', {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  year: {
    type: Sequelize.INTEGER,
  },
  num_parts: {
    type: Sequelize.INTEGER,
  },
  theme_id: {
    type: Sequelize.INTEGER,
  },
  img_url: {
    type: Sequelize.STRING,
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt
});

// Define association
Set.belongsTo(Theme, { foreignKey: 'theme_id' });


// **Define the initialize function**
function initialize() {
  return sequelize.sync() 
    .then(() => {
      return "Database initialized successfully."; 
    })
    .catch((err) => {
      return Promise.reject(`Failed to initialize database: ${err.message}`); 
    });
}

// Function to get all sets
function getAllSets() {
  return Set.findAll({ include: [Theme] })
    .then((sets) => sets)
    .catch((err) => Promise.reject(`Failed to retrieve sets: ${err.message}`));
}

// Function to get a specific set by set_num
function getSetByNum(setNum) {
  return Set.findOne({
    where: { set_num: setNum },
    include: [Theme],
  })
    .then((set) => {
      if (set) return set;
      throw new Error("Unable to find requested set");
    })
    .catch((err) => Promise.reject(`Failed to retrieve set: ${err.message}`));
}

// Function to get sets by theme name
function getSetsByTheme(theme) {
  return Set.findAll({
    include: [Theme],
    where: {
      '$Theme.name$': {
        [Sequelize.Op.iLike]: `%${theme}%`, 
      },
    },
  })
    .then((sets) => {
      if (sets.length > 0) return sets;
      throw new Error(`No sets found for theme: ${theme}`);
    })
    .catch((err) => Promise.reject(`Failed to retrieve sets: ${err.message}`));
}

//addSet
function addSet(setData) {
  return Set.create(setData)
    .then(() => "Set added successfully.")
    .catch((err) => Promise.reject(err.errors[0].message)); 
}

//getAllThemes
function getAllThemes() {
  return Theme.findAll()
    .then((themes) => themes)
    .catch((err) => Promise.reject(`Failed to retrieve themes: ${err.message}`));
}

//editSet
function editSet(set_num, setData) {
  return Set.update(setData, {
    where: { set_num: set_num },
  })
    .then(() => "Set updated successfully.")
    .catch((err) => Promise.reject(err.errors[0].message));
}


// deleteSet function to delete a set based on set_num
function deleteSet(set_num) {
  return Set.destroy({
    where: { set_num: set_num } 
  })
    .then((deleted) => {
      if (deleted === 0) {
        return Promise.reject(`No set found with set_num: ${set_num}`); 
      }
      return "Set deleted successfully."; 
    })
    .catch((err) => {
      return Promise.reject(err.errors ? err.errors[0].message : err.message);
    });
}





// Testing initialize function
initialize()
  .then((message) => {
    console.log(message); // Log the success message
  })
  .catch((error) => {
    console.error("Error during initialization:", error); // Log the error if it fails
  });

// Export functions for use in other files
module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  getAllThemes,
  editSet,
  deleteSet
};
