const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");

const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");

const router = express.Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUser = req.user;
        const { name, thumbnail, songs } = req.body;

        if (!name || !thumbnail || !Array.isArray(songs)) {
            return res
                .status(400)
                .json({ error: "Insufficient or invalid data" });
        }

        try {
            const playlistData = {
                name,
                thumbnail,
                songs,
                owner: currentUser._id,
                collaborators: [],
            };
            const playlist = await Playlist.create(playlistData);
            return res.status(201).json(playlist);
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/playlist/:playlistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const playlistId = req.params.playlistId;

        if (!isValidObjectId(playlistId)) {
            return res
                .status(400)
                .json({ error: "Invalid Playlist ID format" });
        }

        try {
            const playlist = await Playlist.findById(playlistId).populate({
                path: "songs",
                populate: {
                    path: "artist",
                },
            });

            if (!playlist) {
                return res.status(404).json({ error: "Playlist not found" });
            }
            return res.status(200).json(playlist);
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/me",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const userId = req.user._id;

        try {
            const playlists = await Playlist.find({ owner: userId }).populate(
                "owner"
            );
            return res.status(200).json({ data: playlists });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.get(
    "/get/artist/:artistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const artistId = req.params.artistId;

        if (!isValidObjectId(artistId)) {
            return res.status(400).json({ error: "Invalid Artist ID format" });
        }

        try {
            const artist = await User.findById(artistId);
            if (!artist) {
                return res.status(404).json({ error: "Artist not found" });
            }

            const playlists = await Playlist.find({ owner: artistId });
            return res.status(200).json({ data: playlists });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

router.post(
    "/add/song",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const currentUser = req.user;
        const { playlistId, songId } = req.body;

        if (!isValidObjectId(playlistId) || !isValidObjectId(songId)) {
            return res
                .status(400)
                .json({ error: "Invalid Playlist or Song ID format" });
        }

        try {
            const playlist = await Playlist.findById(playlistId);
            if (!playlist) {
                return res
                    .status(404)
                    .json({ error: "Playlist does not exist" });
            }

            if (
                !playlist.owner.equals(currentUser._id) &&
                !playlist.collaborators.includes(currentUser._id)
            ) {
                return res.status(403).json({ error: "Not allowed" });
            }

            const song = await Song.findById(songId);
            if (!song) {
                return res.status(404).json({ error: "Song does not exist" });
            }

            playlist.songs.push(songId);
            await playlist.save();

            return res.status(200).json(playlist);
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
);

module.exports = router;
