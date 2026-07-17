const express = require("express");
const Route = express.Router()
const { getu2Pool, sql } = require("../../config/db")

// SECRET KEY (Store in env variable in real apps)

Route.get("/", async (req, res) => {
    try {
        const pool = await getu2Pool();

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
Route.get("/:id", async (req, res) => {
    try {
        const pool = await getu2Pool();
        const { id } = req.params;

        // Validate ID
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Fetch user record safely
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT *
                FROM AppUser
                WHERE id = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "successful",
            data: result.recordset[0]  // return ONLY the first record
        });
    } catch (error) {
        console.error("User error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
Route.post("/", async (req, res) => {
    try {
        const pool = await getu2Pool();

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
        const pool = await getu2Pool();
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

Route.put("/:id", async (req, res) => {
    try {
        const pool = await getu2Pool();
        const { id } = req.params;

        // Validate ID
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Extract fields from body (update only what is sent)
        const {
            fullName,
            email,
            rollId,
            isActive
        } = req.body;

        // Check if user exists
        const existing = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT * FROM AppUser WHERE id = @id
            `);

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Build dynamic update SQL
        let updateFields = [];
        let request = pool.request().input("id", sql.Int, id);

        if (fullName !== undefined) {
            updateFields.push("fullName = @fullName");
            request.input("fullName", sql.VarChar, fullName);
        }
        if (email !== undefined) {
            updateFields.push("email = @email");
            request.input("email", sql.VarChar, email);
        }
        if (rollId !== undefined) {
            updateFields.push("rollId = @rollId");
            request.input("rollId", sql.Int, rollId);
        }
        if (isActive !== undefined) {
            updateFields.push("isActive = @isActive");
            request.input("isActive", sql.Bit, isActive);
        }

        // No fields sent?
        if (updateFields.length === 0) {
            return res.status(400).json({
                message: "No fields provided to update"
            });
        }

        // Perform update
        const updateQuery = `
            UPDATE AppUser
            SET ${updateFields.join(", ")}
            WHERE id = @id;
        `;

        await request.query(updateQuery);

        // Return updated user
        const updatedUser = await pool.request()
            .input("id", sql.Int, id)
            .query(`SELECT * FROM AppUser WHERE id = @id`);

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser.recordset[0]
        });

    } catch (error) {
        console.error("User update error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = Route;
