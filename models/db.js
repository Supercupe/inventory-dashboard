import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Define the connection config
export const clientConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306, // Ensure you're specifying the correct port
};


// Test the database connection
export const testDBConnection = async () => {
  try {
    const connection = await mysql.createConnection(clientConfig);
    console.log('MySQL connection successful!');
    await connection.end();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
};

// Initialize the database
export const initDB = async () => {
  let connection;
  try {
    // Step 1: Connect to the database server
    connection = await mysql.createConnection(clientConfig);
    console.log('Database connected successfully');
    
    // Step 2: Create the 'inventory_management' database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS inventory_management;');

    // Step 3: Switch to the 'inventory_management' database
    await connection.changeUser({ database: 'inventory_management' });

    // Step 4: Create tables if they don't exist
    await createTables(connection);

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end(); // Always close the connection
    }
  }
};

// Function to create tables
const createTables = async (connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT
    );
    
    CREATE TABLE IF NOT EXISTS suppliers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        category_id INT,
        supplier_id INT,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
    );
  `;

  try {
    await connection.query(query);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Helper function to get a new database connection
export const getConnection = () => mysql.createConnection(clientConfig);
