const express = require("express");
const Route = express.Router()
const { getPool, sql } = require("../../config/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SECRET KEY (Store in env variable in real apps)
const JWT_SECRET = process.env.SECRET_KEY;

Route.post("/", async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const pool = await getPool();

        // Fetch user record
        const result = await pool.request()
            .input("userName", sql.VarChar(250), userName)
            .query(`
                SELECT * 
                FROM AppUser 
                WHERE userName = @userName
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.recordset[0];

        // Compare bcrypt password hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "User inactive" });
        }

        const token = jwt.sign(
            {
                userName: user.userName,
                fullName: user.fullName,
                location: user.location,
            },
            JWT_SECRET
        );


        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                userName: user.userName,
                fullName: user.fullName,
                location: user.location
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = Route;
