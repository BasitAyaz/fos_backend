const express = require("express");
const Route = express.Router()
const { getPool } = require("../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.request().query(`SELECT * FROM ItemInOut ORDER BY TDate DESC OFFSET ${offset} ROWS
  FETCH NEXT ${limit} ROWS ONLY;`);
        const count = await pool.request().query(`SELECT COUNT(*) AS total FROM ItemInOut`)
        res.json({
            total: count.recordset[0].total,
            data: result.recordset
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route