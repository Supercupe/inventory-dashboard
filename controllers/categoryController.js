import { getConnection } from '../models/db.js';

// Fetch all categories
export const listCategories = async (req, res) => {
  try {
    const db = await getConnection();
    const [categories] = await db.query('SELECT * FROM categories');
    const selectedCategory = req.query.category || '';
    res.render('categories', { title: 'Category List', categories, selectedCategory });
    await db.end();
  } catch (error) {
    res.status(500).send('Error fetching categories');
  }
};

// Fetch a single category by ID (for editing)
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).send('Category not found');
    }
    // Render the 'editCategory' view and pass the category data to it
    res.render('editCategory', { title: 'Edit Category', category: category[0] });
    await db.end();
  } catch (error) {
    res.status(500).send('Error fetching category');
  }
};


// Add a new category
export const addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const db = await getConnection();
    await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    await db.end();
    res.redirect('/categories');
  } catch (error) {
    res.status(500).send('Error adding category');
  }
};

// Update an existing category by ID
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const db = await getConnection();
    const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    await db.end();
    if (result.affectedRows === 0) {
      return res.status(404).send('Category not found');
    }
    res.redirect('/categories');
  } catch (error) {
    res.status(500).send('Error updating category');
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;  // Get the ID from the URL parameters
  try {
    const db = await getConnection();
    // Run the DELETE query using the category ID
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    await db.end();

    // If no rows were affected, return an error message
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Category not found' });
    }

    // Successfully deleted category
    res.status(200).send({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send({ message: 'Error deleting category' });
  }
};


// Search categories by name or description
export const searchCategories = async (req, res) => {
  const { query } = req.query;
  try {
    const db = await getConnection();
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE name LIKE ? OR description LIKE ?',
      [`%${query}%`, `%${query}%`]
    );
    res.render('categories', { title: 'Search Results', categories });
    await db.end();
  } catch (error) {
    res.status(500).send('Error searching categories');
  }
};
