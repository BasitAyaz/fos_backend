const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        // Get parameters from query or hardcode for testing
        const LocFrom = parseInt(req.query.LocFrom);
        const LocTo = parseInt(req.query.LocTo);
        const IS2From = parseInt(req.query.IS2From);
        const IS2To = parseInt(req.query.IS2To);
        const AsOnPrdID = parseInt(req.query.AsOnPrdID);

        // Create SQL request
        const request = pool.request();
        request.input('IS2From', sql.Int, IS2From);
        request.input('IS2To', sql.Int, IS2To);
        request.input('AsOnPrdID', sql.Int, AsOnPrdID);
        request.input('LocFrom', sql.Int, LocFrom);
        request.input('LocTo', sql.Int, LocTo);

        // Execute the stored procedure
        const result = await request.execute('dbo.sp_GetStockByIS2Range');

        // Send response
        res.json({
            success: true,
            data: result.recordset,
        });

    } catch (err) {
        console.error('❌ SQL Error:', err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route