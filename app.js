import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { clientConfig } from './models/db.js'; // Import clientConfig from db.js
import initRoutes from './routes/routes.js';


// Import database setup (if it initializes tables upon import)
import './models/db.js';



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

initRoutes(app);

// Error handling middleware
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
