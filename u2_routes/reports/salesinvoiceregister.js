const express = require("express");
const Route = express.Router()
const { getu2Pool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getu2Pool();

        const CustCodeFrom = req.query.CustCodeFrom || null;
        const CustCodeTo = req.query.CustCodeTo || null;
        const DateFrom = req.query.DateFrom || null;
        const DateTo = req.query.DateTo || null;

        const request = pool.request();
        request.input('CustCodeFrom', sql.VarChar(10), CustCodeFrom);
        request.input('CustCodeTo', sql.VarChar(10), CustCodeTo);
        request.input('DateFrom', sql.Date, DateFrom);
        request.input('DateTo', sql.Date, DateTo);

        const result = await request.execute('dbo.SP_SalesInvoiceRegister');

        res.json({
            success: true,
            params: { CustCodeFrom, CustCodeTo, DateFrom, DateTo },
            data: result.recordset,
        });

    } catch (err) {
        console.error('❌ SQL Error:', err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route