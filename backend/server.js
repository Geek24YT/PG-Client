const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Cache for connection pools
const poolCache = {};



// Function to get a connection pool for a specific database
const getPool = (dbName) => {
    if (!poolCache[dbName]) {
        poolCache[dbName] = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: dbName,
            password: 'root',
            port: 5432,
        });
    }
    return poolCache[dbName];
};

// Endpoint to execute SQL commands
app.post('/execute', async (req, res) => {
    const { sql, dbName } = req.body;
    if (!sql || !dbName) {
        return res.status(400).json({ error: 'SQL and database name are required' });
    }

    const pool = getPool(dbName);

    console.log("pool is : = ",pool);

    try {
        const result = await pool.query(sql);
         // Check if the query is a SELECT statement
         if (sql.trim().toUpperCase().startsWith('SELECT')) {
            res.json(result.rows);
        } else {
            res.json({ message: 'Query executed successfully', result });
        }
        
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to clear a specific database
app.post('/clear-database', async (req, res) => {
    const { dbName } = req.body;
    if (!dbName) {
        return res.status(400).json({ error: 'Database name is required' });
    }

    const pool = getPool(dbName);
    try {
        await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
        res.json({ message: `Database ${dbName} cleared` });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Endpoint to create a new database
app.post('/create-database', async (req, res) => {
    const { dbName } = req.body;
    if (!dbName) {
        return res.status(400).json({ error: 'Database name is required' });
    }

    const client = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',  // Use an existing database for this operation
        password: 'root',
        port: 5432,
    });

    try {
        await client.query(`CREATE DATABASE ${dbName}`);
        res.json({ message: `Database ${dbName} created successfully` });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    } finally {
        client.end();
    }
});

// Endpoint to get all tables in a particular databse
app.get('/tables', async (req, res) => {
    const { dbName } = req.query; // Assuming dbName is passed as a query parameter
    if (!dbName) {
        return res.status(400).json({ error: 'Database name is required' });
    }

    const pool = getPool(dbName);
    try {
        const result = await pool.query(`
            SELECT tablename
            FROM pg_catalog.pg_tables
            WHERE schemaname != 'pg_catalog' AND 
                  schemaname != 'information_schema';
        `);
        const tableNames = result.rows.map(row => row.tablename);
        res.json(tableNames);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
