const express = require('express');
const mysql = require('mysql2');

class Resident {
  constructor(pool) {
    this.pool = pool;
  }

  // Register Property (existing code)
  registerProperty() {
    const router = express.Router();

    // Existing property registration logic
    router.post('/register-property', (req, res) => {
      const { residentId, address, propertyType } = req.body;

      if (!residentId || !address || !propertyType) {
        return res.status(400).json({ message: 'Please provide resident ID, address, and property type' });
      }

      const query = 'INSERT INTO properties (resident_id, address, property_type) VALUES (?, ?, ?)';
      this.pool.query(query, [residentId, address, propertyType], (err, results) => {
        if (err) {
          console.error('Error registering property:', err);
          return res.status(500).json({ message: 'Failed to register property' });
        }

        res.status(201).json({ message: 'Property registered successfully', propertyId: results.insertId });
      });
    });

    return router;
  }

  // Make Payment (new method for Use Case 3)
  makePayment() {
    const router = express.Router();

    // Process a payment
    router.post('/make-payment', (req, res) => {
      const { residentId, amount, paymentType, paymentDate } = req.body;

      if (!residentId || !amount || !paymentType || !paymentDate) {
        return res.status(400).json({ message: 'Please provide resident ID, amount, payment type, and payment date' });
      }

      const query = 'INSERT INTO payments (resident_id, amount, payment_type, payment_date) VALUES (?, ?, ?, ?)';
      this.pool.query(query, [residentId, amount, paymentType, paymentDate], (err, results) => {
        if (err) {
          console.error('Error processing payment:', err);
          return res.status(500).json({ message: 'Failed to process payment' });
        }

        res.status(201).json({ message: 'Payment processed successfully', paymentId: results.insertId });
      });
    });

    // Fetch payment history for a resident
    router.get('/payment-history/:residentId', (req, res) => {
      const residentId = req.params.residentId;

      const query = 'SELECT * FROM payments WHERE resident_id = ?';
      this.pool.query(query, [residentId], (err, results) => {
        if (err) {
          console.error('Error fetching payment history:', err);
          return res.status(500).json({ message: 'Failed to fetch payment history' });
        }

        res.status(200).json(results);
      });
    });

    return router;
  }
}

module.exports = Resident;