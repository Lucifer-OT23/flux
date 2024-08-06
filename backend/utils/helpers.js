const jwt = require("jsonwebtoken");

exports.getToken = async (email, user) => {
    const token = jwt.sign({ identifier: user._id }, process.env.KEY);
    return token;
};

module.exports = exports;
