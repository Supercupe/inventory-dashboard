import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { clientConfig } from './models/db.js'; // Import clientConfig from db.js

// Import database setup (if it initializes tables upon import)
import './models/db.js';

// Import routes
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/products', productRoutes); // Product routes
app.use('/categories', categoryRoutes); // Category routes
app.use('/suppliers', supplierRoutes); // Supplier routes


// Home route for dashboard
app.get('/', async (req, res) => {
  try {
    // Using your db.js function to get a connection
    const db = await mysql.createConnection(clientConfig);

    // Assuming db.query returns the needed count results directly
    const [[{ productCount }]] = await db.query('SELECT COUNT(*) AS productCount FROM products');
    const [[{ categoryCount }]] = await db.query('SELECT COUNT(*) AS categoryCount FROM categories');
    const [[{ supplierCount }]] = await db.query('SELECT COUNT(*) AS supplierCount FROM suppliers');

    res.render('home', {
      title: 'Inventory Dashboard',
      productCount,
      categoryCount,
      supplierCount,
    });

    await db.end();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
