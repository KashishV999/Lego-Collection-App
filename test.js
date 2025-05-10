const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

client
  .connect()
  .then(() => {
    console.log('Connected to the database successfully!');
    return client.end();
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });