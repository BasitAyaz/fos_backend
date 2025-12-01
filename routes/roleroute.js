const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../config/db")

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        let query = `SELECT * FROM Roles;`

        const result = await pool.request()
            .query(query);

        res.json({
            data: result.recordset || null
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})
Route.post("/", async (req, res) => {
    try {
        const body = req.body

        const keys = ["controlId", "View", "name"]
        let obj = {}
        keys.forEach(k => {
            obj[k] = body[k]
        })

        if (!obj.controlId || !obj.name || !obj.View) {
            return res.status(400).json({
                error: "controlId, View and name are required."
            });
        }

        console.log(obj)

        const pool = await getPool();
        const query = `
            INSERT INTO Roles (controlId, View, name)
            OUTPUT INSERTED.*
            VALUES (@controlId, @View, @name);
        `;

        const result = await pool.request()
            .input("controlId", obj.controlId)
            .input("View", obj.View)
            .input("name", obj.name)
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