const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        // Get parameters from query or hardcode for testing
        const LocFrom = req.query.LocFrom;
        const LocTo = req.query.LocTo;
        const IS2From = req.query.IS2From;
        const IS2To = req.query.IS2To;
        const AsOnPrdID = parseInt(req.query.AsOnPrdID);

        // Create SQL request
        const request = pool.request();
        request.input('IS2From', sql.VarChar(10), IS2From);
        request.input('IS2To', sql.VarChar(10), IS2To);
        request.input('LocFrom', sql.VarChar(10), LocFrom);
        request.input('LocTo', sql.VarChar(10), LocTo);
        request.input('AsOnPrdID', sql.Int, AsOnPrdID);

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