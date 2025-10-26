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

// ✅ Create and export a single connection pool
let pool;

async function getPool() {
    return new Promise((resolve, reject) => {
        if (pool) {
            return resolve(pool); // reuse existing pool
        }
        sql.connect(config).then((p) => {
            pool = p;
            console.log('✅ SQL Server connected');
            resolve(pool);
        }).catch((err) => {
            console.error('❌ Error connecting to SQL Server:', err);
            reject(err);
        });
    });
}

module.exports = { sql, getPool };
