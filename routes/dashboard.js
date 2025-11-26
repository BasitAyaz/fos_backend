const express = require("express");
const Route = express.Router()
const { getPool } = require("../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        let query = `SELECT * FROM vw_Account_AsOnBalance;`

        const result = await pool.request().query(query);
        res.json({
            data: result.recordset
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route