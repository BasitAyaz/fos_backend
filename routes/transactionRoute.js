const express = require("express");
const Route = express.Router()
const { getPool } = require("../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        // Parse filters from query
        let filters = [];
        try {
            filters = JSON.parse(req.query.filters || "[]");
        } catch (e) {
            return res.status(400).json({ error: "Invalid filters format" });
        }

        // Build WHERE clause
        let whereClause = "";
        if (filters.length > 0) {
            const conditions = filters.map((f, i) => {
                // Prevent SQL injection by escaping field names safely
                const field = `[${f.field}]`;
                const operator = f.operator || "=";

                // Handle different operator types
                if (operator.toUpperCase() === "LIKE") {
                    return `${field} LIKE '%${f.value}%'`;
                } else if (operator.toUpperCase() === "IN" && Array.isArray(f.value)) {
                    const inValues = f.value.map(v => `'${v}'`).join(",");
                    return `${field} IN (${inValues})`;
                } else {
                    return `${field} ${operator} '${f.value}'`;
                }
            });
            whereClause = "WHERE " + conditions.join(" AND ");
        }




        const offset = (page - 1) * limit;

        let query = `SELECT * FROM CustTransactions ${whereClause} ORDER BY TDate DESC OFFSET ${offset} ROWS
  FETCH NEXT ${limit} ROWS ONLY;`

        const result = await pool.request().query(query);
        const count = await pool.request().query(`SELECT COUNT(*) AS total FROM CustTransactions ${whereClause}`)
        res.json({
            total: count.recordset[0].total,
            data: result.recordset
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

module.exports = Route