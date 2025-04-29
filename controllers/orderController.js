const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, deliveryTo, items } = req.body;
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price, 0);
    
    // Generate order ID
    const count = await Order.countDocuments();
    const orderId = `#A${(count + 1).toString().padStart(6, '0')}`;
    
    const order = new Order({
      orderId,
      userId,
      deliveryTo,
      items,
      total,
      status: 'pending'
    });
    
    await order.save();
    
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    // Categorize orders
    const categorized = {
      current: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)),
      buyAgain: orders.filter(o => o.status === 'delivered'),
      cancelled: orders.filter(o => o.status === 'cancelled')
    };
    
    res.json(categorized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order tracking info
exports.trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      status: order.status,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      currentLocation: 'Warehouse',
      trackingNumber: `TRK${orderId.slice(2)}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};