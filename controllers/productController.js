import { getConnection } from '../models/db.js';

// List all products with optional sorting, category, and supplier filters
export const listProducts = async (req, res) => {
  const { sort_by = 'name', order = 'asc', category = '', supplier = '' } = req.query;
  try {
    const db = await getConnection();

    // Valid columns and order to avoid SQL injection
    const validColumns = ['name', 'price', 'stock'];
    const validOrder = ['asc', 'desc'];
    const sortColumn = validColumns.includes(sort_by) ? sort_by : 'name';
    const sortOrder = validOrder.includes(order.toLowerCase()) ? order : 'asc';

    // Base query
    let query = 'SELECT * FROM products';
    const queryParams = [];

    // Add filtering for category or supplier if provided
    if (category) {
      query += ' WHERE category_id = ?';
      queryParams.push(category);
    }
    if (supplier) {
      query += queryParams.length ? ' AND supplier_id = ?' : ' WHERE supplier_id = ?';
      queryParams.push(supplier);
    }

    // Add sorting to the query
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    // Fetch products, categories, and suppliers
    const [products] = await db.query(query, queryParams);
    const [categories] = await db.query('SELECT * FROM categories');
    const [suppliers] = await db.query('SELECT * FROM suppliers');

    res.render('products', {
      title: 'Product List',
      products,
      categories,
      suppliers,
      sort_by,
      order,
      selectedCategory: category,
      selectedSupplier: supplier,
    });
    await db.end();
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0) return res.status(404).send('Product not found');

    // Fetch categories and suppliers for dropdowns
    const [categories] = await db.query('SELECT * FROM categories');
    const [suppliers] = await db.query('SELECT * FROM suppliers');
    res.render('editProduct', { product: products[0], categories, suppliers });
    await db.end();
  } catch (error) {
    res.status(500).send('Error fetching product');
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  const { name, price, stock, category_id, supplier_id } = req.body;
  try {
    const db = await getConnection();
    await db.query(
      'INSERT INTO products (name, price, stock, category_id, supplier_id) VALUES (?, ?, ?, ?, ?)',
      [name, price, stock, category_id, supplier_id]
    );
    await db.end();
    res.redirect('/products');
  } catch (error) {
    res.status(500).send('Error adding product');
  }
};

// Update an existing product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category_id, supplier_id } = req.body;
  try {
    const db = await getConnection();
    const [result] = await db.query(
      'UPDATE products SET name = ?, price = ?, stock = ?, category_id = ?, supplier_id = ? WHERE id = ?',
      [name, price, stock, category_id, supplier_id, id]
    );
    await db.end();
    if (result.affectedRows === 0) return res.status(404).send('Product not found');
    res.redirect('/products');
  } catch (error) {
    res.status(500).send('Error updating product');
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    await db.end();
    if (result.affectedRows === 0) return res.status(404).send('Product not found');
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
};

// Search products by name
export const searchProducts = async (req, res) => {
  const { query } = req.query;
  try {
    const db = await getConnection();
    const [products] = await db.query(
      'SELECT * FROM products WHERE name LIKE ?',
      [`%${query}%`]
    );
    const [categories] = await db.query('SELECT * FROM categories');
    const [suppliers] = await db.query('SELECT * FROM suppliers');
    res.render('products', { title: 'Search Results', products, categories, suppliers });
    await db.end();
  } catch (error) {
    res.status(500).send('Error searching products');
  }
};
