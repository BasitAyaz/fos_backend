const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        // Get parameters from query or hardcode for testing
        const BUID = parseInt(req.query.BUID) || 4;
        const ItemFrom = parseInt(req.query.ItemFrom) || 10319;
        const ItemTo = parseInt(req.query.ItemTo) || 10320;
        const PeriodFrom = req.query.PeriodFrom || '2025-10-01';
        const PeriodTo = req.query.PeriodTo || '2025-10-31';

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