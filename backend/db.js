const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '201210080Sln',
    database: process.env.DB_NAME || 'rancho_inteligente',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_HOST !== 'localhost' ? {
        ca: fs.readFileSync(path.join(__dirname, '..', 'ca.pem')),
        rejectUnauthorized: true
    } : false
});

module.exports = pool;