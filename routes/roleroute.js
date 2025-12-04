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
Route.get("/:id", async (req, res) => {
    try {
        const pool = await getPool();
        const { id } = req.params;

        // Validate ID
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid role ID" });
        }

        // Query for specific role
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT *
                FROM Roles
                WHERE id = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.json({
            message: "success",
            data: result.recordset[0]
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})
Route.post("/", async (req, res) => {
    try {
        const body = req.body

        const keys = ["controlId", "name"]
        let obj = {}
        keys.forEach(k => {
            obj[k] = body[k]
        })

        if (!obj.controlId || !obj.name) {
            return res.status(400).json({
                error: "controlId, name are required."
            });
        }

        console.log(obj)

        const pool = await getPool();
        const query = `
            INSERT INTO Roles (controlId,  name)
            OUTPUT INSERTED.*
            VALUES (@controlId, @name);
        `;

        const result = await pool.request()
            .input("controlId", obj.controlId)
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

Route.put("/:id", async (req, res) => {
    try {
        const pool = await getPool();
        const { id } = req.params;

        const { name, controlId } = req.body;

        // Validate ID
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid role ID" });
        }

        // Validate input fields
        if (!name && !controlId) {
            return res.status(400).json({
                message: "No fields to update. Provide 'name' or 'controlId'."
            });
        }

        // Check if role exists
        const existing = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT *
                FROM Roles
                WHERE id = @id;
            `);

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Build dynamic update query
        let updateFields = [];
        const request = pool.request().input("id", sql.Int, id);

        if (name !== undefined) {
            updateFields.push("name = @name");
            request.input("name", sql.VarChar, name);
        }

        if (controlId !== undefined) {
            updateFields.push("controlId = @controlId");
            request.input("controlId", sql.Int, controlId);
        }

        // Execute update
        const updateQuery = `
            UPDATE Roles
            SET ${updateFields.join(", ")}
            WHERE id = @id;
        `;

        await request.query(updateQuery);

        // Fetch updated role
        const updated = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT *
                FROM Roles
                WHERE id = @id;
            `);

        return res.status(200).json({
            message: "Role updated successfully",
            data: updated.recordset[0]
        });

    } catch (err) {
        console.error("Role update error:", err);
        return res.status(500).json({ error: err.message });
    }
});

Route.delete("/:id", async (req, res) => {
    try {
        const pool = await getPool();
        const { id } = req.params;

        // Validate ID
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid role ID" });
        }

        // Check if role exists
        const check = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT * FROM Roles WHERE id = @id;
            `);

        if (check.recordset.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Delete the role
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                DELETE FROM Roles WHERE id = @id;
            `);

        return res.status(200).json({
            message: "Role deleted successfully",
            deletedRoleId: id,
            rowsAffected: result.rowsAffected[0]
        });

    } catch (err) {
        console.error("Role delete error:", err);
        return res.status(500).json({ error: err.message });
    }
});



module.exports = Route