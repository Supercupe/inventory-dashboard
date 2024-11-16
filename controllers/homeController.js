import { getConnection } from '../models/db.js';

  export const getHome = async (req, res) => {
    try {
        // Using your db.js function to get a connection
        const db = await getConnection();
    
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
      }};

