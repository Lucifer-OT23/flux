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
                .limit(12)
                .populate("artist");
            return res.status(200).json({ data: recentSongs });
        } catch (error) {
            console.error("Error fetching recent songs:", error);
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.post(
    "/like/:songId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songId } = req.params;

        if (!isValidObjectId(songId)) {
            return res.status(400).json({ error: "Invalid Song ID format" });
        }

        try {
            const song = await Song.findById(songId);
            if (!song) {
                return res.status(404).json({ error: "Song does not exist" });
            }

            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User does not exist" });
            }

            if (!user.likedSongs.includes(songId)) {
                user.likedSongs.push(songId);
                await user.save();
                return res
                    .status(200)
                    .json({ message: "Song liked successfully" });
            } else {
                return res.status(400).json({ error: "Song already liked" });
            }
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.delete(
    "/unlike/:songId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songId } = req.params;

        if (!isValidObjectId(songId)) {
            return res.status(400).json({ error: "Invalid Song ID format" });
        }

        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User does not exist" });
            }

            user.likedSongs = user.likedSongs.filter(
                (id) => id.toString() !== songId
            );
            await user.save();
            return res
                .status(200)
                .json({ message: "Song unliked successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/liked",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id).populate(
                "likedSongs"
            );
            if (!user) {
                return res.status(404).json({ error: "User does not exist" });
            }

            const likedSongs = await Song.find({
                _id: { $in: user.likedSongs },
            }).populate("artist");
            return res.status(200).json({ data: likedSongs });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/liked/:songId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songId } = req.params;

        if (!isValidObjectId(songId)) {
            return res.status(400).json({ error: "Invalid Song ID format" });
        }

        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User does not exist" });
            }

            const isLiked = user.likedSongs.includes(songId);
            return res.status(200).json({ liked: isLiked });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

module.exports = router;
