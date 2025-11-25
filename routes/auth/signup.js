const express = require("express");
const bcrypt = require("bcrypt");
const Route = express.Router();
const { getPool, sql } = require("../../config/db");

Route.post("/", async (req, res) => {
    const { userName, password, fullName, location } = req.body;

    if (!userName || !password || !fullName || !location) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const pool = await getPool();

        // Check if username already exists
        const existingUser = await pool.request()
            .input("userName", sql.VarChar(250), userName)
            .query(`
                SELECT userName 
                FROM AppUser 
                WHERE userName = @userName
            `);

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({ message: "Username already exists." });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool.request()
            .input("userName", sql.VarChar(250), userName)
            .input("password", sql.VarChar(250), hashedPassword)
            .input("fullName", sql.VarChar(250), fullName)
            .input("location", sql.Int, location)
            .input("isActive", sql.Bit, true)
            .query(`
                INSERT INTO AppUser (userName, password, fullName, location, isActive)
                VALUES (@userName, @password, @fullName, @location, @isActive)
            `);

        return res.status(201).json({
            message: "User successfully registered.",
            user: {
                userName,
                fullName,
                location
            }
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = Route;
