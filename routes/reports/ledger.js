const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        const SupCodeFrom = req.query.SupCodeFrom || null;
        const SupCodeTo = req.query.SupCodeTo || null;
        const DateFrom = req.query.DateFrom || null;
        const DateTo = req.query.DateTo || null;

        const request = pool.request();
        request.input('SupCodeFrom', sql.VarChar(10), SupCodeFrom);
        request.input('SupCodeTo', sql.VarChar(10), SupCodeTo);
        request.input('DateFrom', sql.Date, DateFrom);
        request.input('DateTo', sql.Date, DateTo);

        const result = await request.execute('dbo.usp_SupTransactions_Report');

        res.json({
            success: true,
            params: { SupCodeFrom, SupCodeTo, DateFrom, DateTo },
            data: result.recordset,
        });

    } catch (err) {
        console.error('❌ SQL Error:', err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route