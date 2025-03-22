const express = require('express');

class ManageBills {
  constructor(pool) {
    this.pool = pool;
  }

  handleBills() {
    const router = express.Router();

    // ✅ Admin - View all bills
    router.get('/all-bills', (req, res) => {
      const query = 'SELECT * FROM bills';
      this.pool.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching bills:', err);
          return res.status(500).json({ message: 'Failed to fetch bills' });
        }
        res.status(200).json(results);
      });
    });

    // ✅ Admin - Generate a new bill
    router.post('/generate-bill', (req, res) => {
      const { resident_id, amount, bill_type, due_date } = req.body;
      if (!resident_id || !amount || !bill_type || !due_date) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const query = 'INSERT INTO bills (resident_id, amount, bill_type, due_date) VALUES (?, ?, ?, ?)';
      this.pool.query(query, [resident_id, amount, bill_type, due_date], (err, results) => {
        if (err) {
          console.error('Error generating bill:', err);
          return res.status(500).json({ message: 'Failed to generate bill' });
        }
        res.status(201).json({ message: 'Bill generated successfully' });
      });
    });

    // ✅ Admin - Update bill status (e.g., mark as paid)
    router.put('/update-bill/:billId', (req, res) => {
      const { billId } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Please provide a bill status' });
      }
      
      const query = 'UPDATE bills SET status = ? WHERE bill_id = ?';
      this.pool.query(query, [status, billId], (err, results) => {
        if (err) {
          console.error('Error updating bill:', err);
          return res.status(500).json({ message: 'Failed to update bill' });
        }
        res.status(200).json({ message: 'Bill updated successfully' });
      });
    });

    // ✅ Admin - Delete a bill
    router.delete('/delete-bill/:billId', (req, res) => {
      const { billId } = req.params;
      
      const query = 'DELETE FROM bills WHERE bill_id = ?';
      this.pool.query(query, [billId], (err, results) => {
        if (err) {
          console.error('Error deleting bill:', err);
          return res.status(500).json({ message: 'Failed to delete bill' });
        }
        res.status(200).json({ message: 'Bill deleted successfully' });
      });
    });

    return router;
  }
}

module.exports = ManageBills;