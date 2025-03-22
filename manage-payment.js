const express = require('express');

class ManagePayment {
  constructor(pool) {
    this.pool = pool;
  }

  handlePayments() {
    const router = express.Router();

    // ✅ Admin - View all payments
    router.get('/all-payments', (req, res) => {
      const query = 'SELECT * FROM payments';
      this.pool.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching payments:', err);
          return res.status(500).json({ message: 'Failed to fetch payments' });
        }
        res.status(200).json(results);
      });
    });

    // ✅ Admin - Update a payment (e.g., mark as confirmed)
    router.put('/update-payment/:paymentId', (req, res) => {
      const { paymentId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Please provide a payment status' });
      }

      const query = 'UPDATE payments SET status = ? WHERE id = ?';
      this.pool.query(query, [status, paymentId], (err, results) => {
        if (err) {
          console.error('Error updating payment:', err);
          return res.status(500).json({ message: 'Failed to update payment' });
        }
        res.status(200).json({ message: 'Payment updated successfully' });
      });
    });

    // ✅ Admin - Delete a payment (if necessary)
    router.delete('/delete-payment/:paymentId', (req, res) => {
      const { paymentId } = req.params;

      const query = 'DELETE FROM payments WHERE id = ?';
      this.pool.query(query, [paymentId], (err, results) => {
        if (err) {
          console.error('Error deleting payment:', err);
          return res.status(500).json({ message: 'Failed to delete payment' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
      });
    });

    return router;
  }
}

module.exports = ManagePayment;
