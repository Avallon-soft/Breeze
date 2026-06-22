const { verifyToken } = require("../utils/jwt.util");
const tokenStore = require("../utils/token-store.util");

function authenticate(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ message: "No token provided" });
    }

    const bearerToken = auth.split(" ")[1];

    try {
        const decoded = verifyToken(bearerToken);

        if (tokenStore.get(bearerToken) === false) {
            return res.status(401).json({ message: "Token has been revoked" });
        }

        req.user = decoded;
        req.token = bearerToken;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = { authenticate };