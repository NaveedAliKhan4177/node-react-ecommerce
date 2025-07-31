import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import userRoute from './routes/userRoute.js'; 
import productRoute from './routes/productRoute.js';
import orderRoute from './routes/orderRoute.js';
import uploadRoute from './routes/uploadRoute.js';

// Configure environment variables
dotenv.config();

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅  MongoDB connected'))
  .catch((error) => console.log('❌  MongoDB error:', error.message));

// Initialize Express App
const app = express();
app.use(bodyParser.json());

// API Routes
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || '');
});

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

// Serve React Frontend
const frontendPath = path.join(__dirname, '/../frontend/build');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Start Server - Listen on 0.0.0.0 for public access
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  Server started at http://0.0.0.0:${PORT}`);
});

