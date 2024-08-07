const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

const User = require("./models/User");

const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");

const cors = require("cors");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.DB)
    .then(() => {
        console.log("Connected to Mongo!");
    })
    .catch((err) => {
        console.log("Error while connecting to Mongo!", err);
    });

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.KEY;

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        console.log("JWT payload:", jwt_payload);
        try {
            const user = await User.findById(jwt_payload.identifier);
            if (user) {
                console.log("User found:", user);
                return done(null, user);
            } else {
                console.log(
                    "User not found with identifier:",
                    jwt_payload.identifier
                );
                return done(null, false);
            }
        } catch (err) {
            console.log("Error in finding user:", err);
            return done(err, false);
        }
    })
);

app.use(passport.initialize());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get(
    "/auth/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
);

app.post("/auth/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

app.listen(port, () => {
    console.log("App is running on port " + port);
});
