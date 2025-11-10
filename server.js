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

// ✅ Connect Database
connectDB();

const app = express();
app.use(express.json());

// ✅ Allow only specific origins (Render + Vercel + local)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ecom-frontend-six-theta.vercel.app',
];

// ✅ Simplified + safe CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(null, false); // <-- do NOT throw an Error here
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// ✅ Preflight support
app.options('*', cors());

// ✅ Routes
app.use("/api/admin", authRoutes);
app.use('/api', publicProducts);
app.use('/api/admin', adminProductsRoutes);
app.use('/api/admin', adminOrdersRoutes);
app.use('/api', publicOrders);
app.use("/api/user", userAuthRoutes);

// ✅ Health Check
app.get('/', (req, res) => res.send('API running ✅'));

// ✅ Error handler (last)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
