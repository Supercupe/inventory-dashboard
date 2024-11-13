import express from 'express';
import {
  listProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Route to list all products with optional filters and sorting
router.get('/', listProducts);

// Route to render the form to add a new product
router.get('/add', (req, res) => {
  res.render('addProduct');  // Render the addProduct form view
});

// Route to handle adding a new product (POST request)
router.post('/', addProduct);  // Corrected POST route

// Route to render the form for editing a specific product by ID
router.get('/edit/:id', getProductById);

// Route to handle updating a product (POST request)
router.post('/edit/:id', updateProduct);

// Route to handle deleting a product by ID (DELETE request)
router.delete('/:id', deleteProduct);

export default router;

