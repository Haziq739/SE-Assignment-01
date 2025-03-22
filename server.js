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
  host: 'localhost',   
  user: 'root',        
  password: 'Uzma@9033',  
  database: 'SE_Project', 
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

// Serve static files (CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve manage-residents.html at /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manage-residents.html'));
});

// Serve manage-payment.html at /manage-payment
app.get('/manage-payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manage-payment.html'));
});

// Serve register-property.html at /register-property
app.get('/register-property', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register-property.html'));
});

// Import Admin and Resident classes
const Admin = require('./admin');
const Resident = require('./resident');
const ManagePayment = require('./manage-payment'); // Ensure this file exists
const admin = new Admin(pool);
const resident = new Resident(pool);
const managePayment = new ManagePayment(pool);

const ManageBills = require('./bills');
const manageBills = new ManageBills(pool);



// Use routers for different functionalities
app.use('/residents', admin.manageResidentData());
app.use('/residents', resident.makePayment()); 
app.use('/properties', resident.registerProperty());
app.use('/manage-payment', managePayment.handlePayments()); // New route for managing payments
app.use('/manage-bills', manageBills.handleBills());


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
