require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const cors = require('cors');
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  
}));


// Routes
app.use('/sales', require('./routes/saleRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/products', require('./routes/ProductRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/auth', require('./routes/authRoutes')); 
app.use('/inventory', require('./routes/inventoryRoutes'));
app.use('/sales', require('./routes/saleRoutes'));



// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(' DB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
