require('dotenv').config();
const express = require('express');
const cors = require('cors');
const midtransCoreApi = require('midtrans-client');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Midtrans Snap client
const snap = new midtransCoreApi.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sam Poo Kong Tour API is running' });
});

// Create transaction and get Snap token
app.post('/api/create-transaction', async (req, res) => {
  try {
    const { amount = 15000, item_name = 'Sam Poo Kong Digital Tour' } = req.body;
    const orderId = `SPK-${Date.now()}-${uuidv4().slice(0, 8)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: 'TOUR-001',
          price: amount,
          quantity: 1,
          name: item_name,
        },
      ],
      callbacks: {
        finish: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tour`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
    });
  } catch (error) {
    console.error('Midtrans Error:', error.message);
    res.status(500).json({
      error: 'Failed to create transaction',
      message: error.message,
    });
  }
});

// Midtrans notification webhook (for payment status updates)
app.post('/api/midtrans-notification', async (req, res) => {
  try {
    const notification = req.body;
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`[Midtrans Notification] Order: ${orderId}, Status: ${transactionStatus}`);

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        // Payment successful
        // TODO: Update Firestore Users collection
        console.log(`Payment SUCCESS for order: ${orderId}`);
      }
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      // Payment failed
      console.log(`Payment FAILED for order: ${orderId}`);
    } else if (transactionStatus === 'pending') {
      // Payment pending
      console.log(`Payment PENDING for order: ${orderId}`);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Notification Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🏮 Sam Poo Kong Tour API Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Frontend:   ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`   Midtrans:   ${process.env.MIDTRANS_IS_PRODUCTION === 'true' ? 'PRODUCTION' : 'SANDBOX'}\n`);
});
