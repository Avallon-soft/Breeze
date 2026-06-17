const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

function authenticate(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ message: "No token provided" });
    }

    const bearerToken = auth.split(" ")[1];

    try {
        req.user = jwt.verify(bearerToken, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = { authenticate };
