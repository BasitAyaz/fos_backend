// db.js
const sql = require('mssql');

const config = {
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    server: process.env.DBSERVER,
    port: Number(process.env.DBPORT),
    database: process.env.DBNAME,
    options: {
        encrypt: false, // true agar Azure use kar rahe ho
        trustServerCertificate: true // agar local environment hai
    }
};
const config2 = {
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    server: process.env.DBSERVER,
    port: Number(process.env.DBPORT),
    database: process.env.DBNAME_2,
    options: {
        encrypt: false, // true agar Azure use kar rahe ho
        trustServerCertificate: true // agar local environment hai
    }
};

// ✅ Create and export separate connection pools
let pool;
let pool_2;

async function getPool() {
    if (pool) {
        return pool; // reuse existing pool
    }
    try {
        const p = new sql.ConnectionPool(config);
        pool = await p.connect();
        console.log('✅ SQL Server connected');
        return pool;
    } catch (err) {
        console.error('❌ Error connecting to SQL Server:', err);
        throw err;
    }
}

async function getu2Pool() {
    if (pool_2) {
        return pool_2; // reuse existing pool
    }
    try {
        const p = new sql.ConnectionPool(config2);
        pool_2 = await p.connect();
        console.log('✅ SQL 2 Server connected');
        return pool_2;
    } catch (err) {
        console.error('❌ Error connecting to SQL 2 Server:', err);
        throw err;
    }
}

module.exports = { sql, getPool, getu2Pool };
