const express = require("express");
const Route = express.Router()
const { getu2Pool, sql } = require("../../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getu2Pool();

        // --- Optional query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || "";
        const offset = (page - 1) * limit;

        // --- Create base query
        let whereClause = "";
        if (search) {
            whereClause = "WHERE name LIKE @search";
        }

        // Main paginated query (ORDER BY is required)
        const dataQuery = `
        SELECT *
        FROM Roles
        ${whereClause}
        ORDER BY name
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY;
    `;

        const countQuery = `
        SELECT COUNT(*) AS total
        FROM Roles
        ${whereClause};
    `;

        // --- Execute queries
        const request = pool.request();
        if (search) request.input("search", sql.VarChar, search);

        const [dataResult, countResult] = await Promise.all([
            request.query(dataQuery),
            request.query(countQuery),
        ]);

        const totalRecords = countResult.recordset[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        // --- Response
        res.json({
            success: true,
            page,
            limit,
            totalRecords,
            totalPages,
            data: dataResult.recordset,
        });
    } catch (err) {
        console.error("❌ SQL Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
})

module.exports = Route