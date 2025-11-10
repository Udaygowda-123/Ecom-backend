require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const adminProductsRoutes = require('./routes/adminProducts');
const adminOrdersRoutes = require('./routes/adminOrders');
const publicProducts = require('./routes/publicProducts');

const publicOrders = require('./routes/publicOrders');

const userAuthRoutes = require("./routes/userAuth");




connectDB();
const app = express();
app.use(express.json());
const allowedOrigins = [
    'http://localhost:5173', // Vite frontend
    'http://localhost:3000', // for React CRA or fallback
    'https://Ecom-frontend.vercel.app' // optional for deployment
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }));
app.use("/api/admin", authRoutes);
app.use('/api', publicProducts);
app.use('/api/admin', adminProductsRoutes);
app.use('/api/admin', adminOrdersRoutes);
app.use('/api', publicOrders);
app.use("/api/user", userAuthRoutes);
// health
app.get('/', (req,res)=>res.send('API running'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on ${PORT}`));
