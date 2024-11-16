import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import homeRoute from "./homeRoute.js"

const initRoutes = (app) => {
    app.use('/products', productRoutes);
    app.use('/categories', categoryRoutes);
    app.use('/suppliers', supplierRoutes);
    app.use('/', homeRoute); // Add home route after other routes to ensure it's loaded last
};

export default initRoutes;