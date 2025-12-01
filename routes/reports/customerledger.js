const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        const cUSTCodeFrom = req.query.cUSTCodeFrom || null;
        const cUSTCodeTo = req.query.cUSTCodeTo || null;
        const DateFrom = req.query.DateFrom || null;
        const DateTo = req.query.DateTo || null;

        const request = pool.request();
        request.input('cUSTCodeFrom', sql.VarChar(10), cUSTCodeFrom);
        request.input('cUSTCodeTo', sql.VarChar(10), cUSTCodeTo);
        request.input('DateFrom', sql.Date, DateFrom);
        request.input('DateTo', sql.Date, DateTo);

        const result = await request.execute('dbo.usp_CustTransactions_Report');

        res.json({
            success: true,
            params: { cUSTCodeFrom, cUSTCodeTo, DateFrom, DateTo },
            data: result.recordset,
        });

    } catch (err) {
        console.error('❌ SQL Error:', err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route