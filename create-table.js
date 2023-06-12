const { Pool } = require('pg');

// Database connection settings
const dbConfig = {
  user: 'your_username', // Replace with your own database username
  password: 'your_password', // Replace with your own database password
  host: 'localhost',
  port: 5432,
  database: 'your_database' // Replace with your own database name
};

async function createUsersTable() {
  try {
    // Create a database connection pool
    const pool = new Pool(dbConfig);

    // Execute the query to create the 'users' table
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `;
    await pool.query(query);

    // Release the database connection
    pool.end();

    console.log('Users table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating users table:', error);
    return false;
  }
}

// Usage example
createUsersTable();
