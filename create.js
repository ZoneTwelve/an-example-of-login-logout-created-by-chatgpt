const { Pool } = require('pg');

// Database connection settings
const dbConfig = {
  user: 'your_username', // Replace with your own database username
  password: 'your_password', // Replace with your own database password
  host: 'localhost',
  port: 5432,
  database: 'your_database' // Replace with your own database name
};

async function createUser(username, password) {
  try {
    // Create a database connection pool
    const pool = new Pool(dbConfig);

    // Execute the query to insert the new user into the database
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const values = [username, password];
    await pool.query(query, values);

    // Release the database connection
    pool.end();

    console.log('User created successfully');
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
}

// Usage example
const username = 'john_doe';
const password = 'password123';

createUser(username, password);
