import express from 'express';
import {
  listCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Route to list all categories
router.get('/', listCategories);

// Route to show the form to add a new category <
router.get('/add', (req, res) => {
  res.render('addCategory');  // Render the addCategory form view
});

// Route to handle adding a new category (POST request)
router.post('/', addCategory);

// Route to show the form for editing a category by ID
router.get('/edit/:id', getCategoryById);

// Route to handle updating a category (POST request)
router.post('/edit/:id', updateCategory);

// Route to handle deleting a category by ID (DELETE request)
router.delete('/:id', deleteCategory);

export default router;
