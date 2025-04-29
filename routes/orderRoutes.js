const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get user orders
router.get('/user/:userId', orderController.getUserOrders);

// Cancel an order
router.put('/cancel/:orderId', orderController.cancelOrder);

// Track an order
router.get('/track/:orderId', orderController.trackOrder);

module.exports = router;