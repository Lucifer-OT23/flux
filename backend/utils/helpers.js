const jwt = require("jsonwebtoken");

exports.getToken = async (email, user) => {
    const token = jwt.sign({ identifier: user._id }, process.env.KEY);
    return token;
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};
