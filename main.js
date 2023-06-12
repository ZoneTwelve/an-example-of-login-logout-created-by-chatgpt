#!/usr/bin/env node
const Koa = require('koa');
const session = require('koa-session');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { Pool } = require('pg');

const app = new Koa();
const router = new Router();

// Set up session middleware
app.keys = ['your_secret_key']; // Replace with your own secret key
app.use(session(app));
app.use(bodyParser());

// Database connection settings
const dbConfig = {
  user: 'your_username', // Replace with your own database username
  password: 'your_password', // Replace with your own database password
  host: 'localhost',
  port: 5432,
  database: 'your_database' // Replace with your own database name
};

// Check if the user is already logged in
router.get('/', async (ctx) => {
  if (ctx.session.loggedin) {
    ctx.redirect('/dashboard'); // Redirect to the dashboard page or any other authenticated page
  } else {
    ctx.body = `
      <h1>Login</h1>
      <form method="POST" action="/">
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" required><br><br>

        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required><br><br>

        <input type="submit" value="Login">
      </form>
    `;
  }
});

// Handle login form submission
router.post('/', async (ctx) => {
  // Validate the login credentials
  console.log(ctx.request.body);
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;

  try {
    // Create a database connection pool
    const pool = new Pool(dbConfig);

    // Execute the query to fetch the user's information from the database
    const { rows } = await pool.query(
      'SELECT id, username, password FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    // Check if a user with the provided username exists
    if (rows.length === 1) {
      const user = rows[0];

      // Verify the password
      if (user.password === password) { // Replace with your actual password validation logic
        ctx.session.loggedin = true;
        ctx.session.username = user.username;
        ctx.redirect('/dashboard'); // Redirect to the dashboard page or any other authenticated page
      } else {
        ctx.body = 'Invalid username or password 1';
      }
    } else {
      ctx.body = 'Invalid username or password 2';
    }

    // Release the database connection
    pool.end();
  } catch (error) {
    ctx.body = 'Database connection error';
    console.error(error);
  }
});

// Dashboard route for authenticated users
router.get('/dashboard', async (ctx) => {
  if (ctx.session.loggedin) {
    ctx.body = `<h1>Welcome, ${ctx.session.username}!</h1>`;
  } else {
    ctx.redirect('/');
  }
});

router.get('/logout', async (ctx) => {
  // Clear the session data
  ctx.session = null;

  // Redirect to the login page or any other desired page
  ctx.redirect('/login');
});

app.use(router.routes());

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
