import express from 'express';
import {
  listSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  searchSuppliers,
} from '../controllers/supplierController.js';

const router = express.Router();

// GET /suppliers - List all suppliers with optional filters
router.get('/', listSuppliers);

// GET /suppliers/:id - Get supplier by ID (for editing)
router.get('/:id', getSupplierById);

// POST /suppliers - Add a new supplier
router.post('/', addSupplier);

// POST /suppliers/edit/:id - Update an existing supplier
router.post('/edit/:id', updateSupplier);

// DELETE /suppliers/:id - Delete a supplier
router.delete('/:id', deleteSupplier);

// GET /suppliers/search - Search suppliers by name or country
router.get('/search', searchSuppliers);

export default router;
