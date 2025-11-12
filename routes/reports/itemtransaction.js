const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        // Get parameters from query or hardcode for testing
        const BUID = parseInt(req.query.BUID);
        const ItemFrom = parseInt(req.query.ItemFrom) || null;
        const ItemTo = parseInt(req.query.ItemTo) || null;
        const PeriodFrom = req.query.PeriodFrom || null;
        const PeriodTo = req.query.PeriodTo || null;

        // Create SQL request
        const request = pool.request();
        request.input('BUID', sql.Int, BUID);
        request.input('ItemFrom', sql.Int, ItemFrom);
        request.input('ItemTo', sql.Int, ItemTo);
        request.input('PeriodFrom', sql.Date, PeriodFrom);
        request.input('PeriodTo', sql.Date, PeriodTo);

        // Execute the stored procedure
        const result = await request.execute('dbo.sp_GetItemTransactionReport');

        // Send response
        res.json({
            success: true,
            params: { BUID, ItemFrom, ItemTo, PeriodFrom, PeriodTo },
            data: result.recordset,
        });

    } catch (err) {
        console.error('❌ SQL Error:', err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route