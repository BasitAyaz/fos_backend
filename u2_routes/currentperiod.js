const express = require("express");
const Route = express.Router()
const { getu2Pool, sql } = require("../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getu2Pool();
        const date = req.query.date || new Date();

        let query = `SELECT * FROM periods WHERE @date BETWEEN PrdStDate AND PrdEdDate;`

        const result = await pool.request()
            .input("date", sql.Date, date)
            .query(query);

        res.json({
            data: result.recordset[0] || null
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route