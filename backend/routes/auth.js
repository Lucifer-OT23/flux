const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken, verifyToken } = require("../utils/helpers");

const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
        body("firstName").notEmpty().withMessage("First name is required"),
        body("username").notEmpty().withMessage("Username is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, firstName, lastName, username } = req.body;

        try {
            const user = await User.findOne({ email });
            if (user) {
                return res
                    .status(403)
                    .json({ error: "A user with this email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserData = {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                username,
            };
            const newUser = await User.create(newUserData);

            const token = await getToken(email, newUser);
            const userToReturn = { ...newUser.toJSON(), token };
            delete userToReturn.password;

            return res.status(200).json(userToReturn);
        } catch (error) {
            console.error("Registration error:", error);
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(403).json({ error: "Invalid credentials" });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return res.status(403).json({ error: "Invalid credentials" });
            }

            const token = await getToken(user.email, user);
            const userToReturn = { ...user.toJSON(), token };
            delete userToReturn.password;

            return res.status(200).json(userToReturn);
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get("/me", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userToReturn = { ...user.toJSON() };
        delete userToReturn.password;
        return res.status(200).json(userToReturn);
    } catch (error) {
        console.error("Fetch user error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

router.post("/logout", (req, res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
