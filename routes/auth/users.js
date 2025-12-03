const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")

// SECRET KEY (Store in env variable in real apps)

Route.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        // Fetch user record
        const result = await pool.request()
            .query(`SELECT * FROM AppUser;`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.recordset;

        return res.status(200).json({
            message: "successful",
            data: user
        });
    } catch (error) {
        console.error("User error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
Route.post("/", async (req, res) => {
    try {
        const pool = await getPool();

        // Fetch user record
        const result = await pool.request()
            .query(`ALTER TABLE AppUser
DROP COLUMN controlId;`);


        return res.status(200).json({
            message: "successful",
            data: result
        });
    } catch (error) {
        console.error("User error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
Route.delete("/:id", async (req, res) => {
    try {
        const pool = await getPool();
        const { id } = req.params;

        // Ensure id is provided
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if user exists
        const check = await pool.request()
            .input("id", sql.Int, id)
            .query(`SELECT * FROM AppUser WHERE id = @id`);

        if (check.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`DELETE FROM AppUser WHERE id = @id`);

        return res.status(200).json({
            message: "User deleted successfully",
            affectedRows: result.rowsAffected[0]
        });

    } catch (error) {
        console.error("User error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = Route;
