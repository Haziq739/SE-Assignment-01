const express = require('express');
const mysql = require('mysql2');

class Admin {
  constructor(pool) {
    this.pool = pool;
  }

  // Manage Resident Data
  manageResidentData() {
    const router = express.Router(); // Create a new router

    // Add Resident
    router.post('/add-resident', (req, res) => {
      const { name, email, phone, address } = req.body;

      if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'Please provide name, email, phone, and address' });
      }

      const query = 'INSERT INTO residents (name, email, phone, address) VALUES (?, ?, ?, ?)';
      this.pool.query(query, [name, email, phone, address], (err, results) => {
        if (err) {
          console.error('Error adding resident:', err);
          return res.status(500).json({ message: 'Failed to add resident' });
        }

        res.status(201).json({ message: 'Resident added successfully', residentId: results.insertId });
      });
    });

    // Update Resident
    router.put('/update-resident/:id', (req, res) => {
      const residentId = req.params.id;
      const { name, email, phone, address } = req.body;

      if (!name && !email && !phone && !address) {
        return res.status(400).json({ message: 'Please provide at least one field to update' });
      }

      let query = 'UPDATE residents SET ';
      const updates = [];
      const values = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      if (phone) {
        updates.push('phone = ?');
        values.push(phone);
      }
      if (address) {
        updates.push('address = ?');
        values.push(address);
      }

      query += updates.join(', ') + ' WHERE resident_id = ?';
      values.push(residentId);

      this.pool.query(query, values, (err, results) => {
        if (err) {
          console.error('Error updating resident:', err);
          return res.status(500).json({ message: 'Failed to update resident' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Resident not found' });
        }

        res.status(200).json({ message: 'Resident updated successfully' });
      });
    });

    // Delete Resident
    router.delete('/delete-resident/:id', (req, res) => {
      const residentId = req.params.id;

      const query = 'DELETE FROM residents WHERE resident_id = ?';
      this.pool.query(query, [residentId], (err, results) => {
        if (err) {
          console.error('Error deleting resident:', err);
          return res.status(500).json({ message: 'Failed to delete resident' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Resident not found' });
        }

        res.status(200).json({ message: 'Resident deleted successfully' });
      });
    });

    // List Residents
    router.get('/list-residents', (req, res) => {
      const query = 'SELECT * FROM residents';
      this.pool.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching residents:', err);
          return res.status(500).json({ message: 'Failed to fetch residents' });
        }

        res.status(200).json(results);
      });
    });

    return router; // Return the router
  }
}

module.exports = Admin;