// controllers/supplierController.js

import { getConnection } from '../models/db.js';

// List all suppliers with optional sorting and filtering
export const listSuppliers = async (req, res) => {
  const { sort_by = 'name', order = 'asc', name = '', country = '' } = req.query;

  try {
    const db = await getConnection();

    // Validate sort column and order to prevent SQL injection
    const validColumns = ['name', 'country'];
    const validOrder = ['asc', 'desc'];
    const sortColumn = validColumns.includes(sort_by) ? sort_by : 'name';
    const sortOrder = validOrder.includes(order.toLowerCase()) ? order.toUpperCase() : 'ASC';

    // Base query
    let query = 'SELECT * FROM suppliers';
    const queryParams = [];

    // Apply filters if provided
    if (name) {
      query += ' WHERE name LIKE ?';
      queryParams.push(`%${name}%`);
    }
    if (country) {
      query += queryParams.length ? ' AND country LIKE ?' : ' WHERE country LIKE ?';
      queryParams.push(`%${country}%`);
    }

    // Apply sorting
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    // Execute the query
    const [suppliers] = await db.query(query, queryParams);

    // Fetch distinct supplier names and countries for filter dropdowns
    const [supplierNames] = await db.query('SELECT DISTINCT name FROM suppliers ORDER BY name');
    const [countries] = await db.query('SELECT DISTINCT country FROM suppliers ORDER BY country');

    res.render('suppliers', {
      title: 'Supplier List',
      suppliers,
      supplierNames,
      countries,
      sort_by: sortColumn,
      order: sortOrder,
      selectedName: name,
      selectedCountry: country,
    });

    await db.end();
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).send('Error fetching suppliers');
  }
};

// Get a single supplier by ID
export const getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getConnection();
    const [suppliers] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);

    if (suppliers.length === 0) {
      await db.end();
      return res.status(404).send('Supplier not found');
    }

    const supplier = suppliers[0];

    res.render('editSuppliers', { title: 'Edit Supplier', supplier });

    await db.end();
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).send('Error fetching supplier');
  }
};

// Add a new supplier
export const addSupplier = async (req, res) => {
  const { name, country } = req.body;

  try {
    const db = await getConnection();
    await db.query('INSERT INTO suppliers (name, country) VALUES (?, ?)', [name, country]);
    await db.end();
    res.redirect('/suppliers');
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).send('Error adding supplier');
  }
};

// Update an existing supplier by ID
export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, country } = req.body;

  try {
    const db = await getConnection();
    const [result] = await db.query(
      'UPDATE suppliers SET name = ?, country = ? WHERE id = ?',
      [name, country, id]
    );

    await db.end();

    if (result.affectedRows === 0) {
      return res.status(404).send('Supplier not found');
    }

    res.redirect('/suppliers');
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).send('Error updating supplier');
  }
};

// Delete a supplier by ID
export const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getConnection();
    const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);

    await db.end();

    if (result.affectedRows === 0) {
      return res.status(404).send('Supplier not found');
    }

    res.status(200).send({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).send('Error deleting supplier');
  }
};

// Search suppliers by name or country
export const searchSuppliers = async (req, res) => {
  const { query } = req.query;

  try {
    const db = await getConnection();
    const searchQuery = `
      SELECT * FROM suppliers
      WHERE name LIKE ? OR country LIKE ?
      ORDER BY name ASC
    `;
    const searchParams = [`%${query}%`, `%${query}%`];
    const [suppliers] = await db.query(searchQuery, searchParams);

    // Fetch distinct names and countries for filters
    const [supplierNames] = await db.query('SELECT DISTINCT name FROM suppliers ORDER BY name');
    const [countries] = await db.query('SELECT DISTINCT country FROM suppliers ORDER BY country');

    res.render('suppliers', {
      title: 'Search Results',
      suppliers,
      supplierNames,
      countries,
      sort_by: 'name',
      order: 'ASC',
      selectedName: '',
      selectedCountry: '',
      searchQuery: query,
    });

    await db.end();
  } catch (error) {
    console.error('Error searching suppliers:', error);
    res.status(500).send('Error searching suppliers');
  }
};
