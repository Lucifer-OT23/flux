const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");

const User = require("./models/User");

const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.DB)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.KEY,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.identifier);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

app.use(passport.initialize());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

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
    console.log(`App is running on port ${port}`);
});
