const express = require("express");
const Route = express.Router()
const { getPool } = require("../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        let query = `SELECT * FROM periods WHERE GETDATE() BETWEEN PrdStDate AND PrdEdDate;`

        const result = await pool.request().query(query);
        res.json({
            data: result.recordset[0] || null
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route