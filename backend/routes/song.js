const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        console.log("Request headers:", req.headers); // Log request headers
        console.log("Authenticated user:", req.user); // Log authenticated user

        const { name, thumbnail, track } = req.body;
        if (!name || !thumbnail || !track) {
            return res
                .status(400)
                .json({ error: "Insufficient details to create song." });
        }
        const artist = req.user._id;
        const songDetails = { name, thumbnail, track, artist };
        try {
            const createdSong = await Song.create(songDetails);
            return res.status(201).json(createdSong);
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/mysongs",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        console.log("Request headers:", req.headers); // Log request headers
        console.log("Authenticated user:", req.user); // Log authenticated user

        try {
            const songs = await Song.find({ artist: req.user._id }).populate(
                "artist"
            );
            return res.status(200).json({ data: songs });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/artist/:artistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { artistId } = req.params;

        if (!isValidObjectId(artistId)) {
            return res.status(400).json({ error: "Invalid Artist ID format" });
        }

        try {
            const artist = await User.findById(artistId);
            if (!artist) {
                return res.status(404).json({ error: "Artist does not exist" });
            }

            const songs = await Song.find({ artist: artistId });
            return res.status(200).json({ data: songs });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/songname/:songName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songName } = req.params;

        try {
            const regex = new RegExp(songName, "i");
            const songs = await Song.find({ name: { $regex: regex } }).populate(
                "artist"
            );
            return res.status(200).json({ data: songs });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/featured",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const featuredSongs = await Song.find({ featured: true }).populate(
                "artist"
            );
            return res.status(200).json({ data: featuredSongs });
        } catch (error) {
            console.error("Error fetching featured songs:", error);
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/recent",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const recentSongs = await Song.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("artist");
            return res.status(200).json({ data: recentSongs });
        } catch (error) {
            console.error("Error fetching recent songs:", error);
            return res.status(500).json({ error: "Server error" });
        }
    }
);

module.exports = router;
