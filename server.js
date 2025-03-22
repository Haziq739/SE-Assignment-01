require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

// Serve static files (e.g., CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve manage-residents.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manage-residents.html'));
});

// Serve register-property.html at /register-property
app.get('/register-property', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register-property.html'));
});

// Initialize Admin and Resident classes
const Admin = require('./admin');
const Resident = require('./resident');

const admin = new Admin(pool);
const resident = new Resident(pool);

// Use the Admin and Resident routers
app.use('/residents', admin.manageResidentData());
app.use('/residents', resident.makePayment()); // Add the new payment router
app.use('/properties', resident.registerProperty());

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});