const { verifyToken } = require("../utils/jwt.util");

function authenticate(req, res, next) {
  if (process.env.SOFTWARE_AUTH_DISABLED === "true") {
    req.user = {
      uuid: process.env.SOFTWARE_TEST_USER_ID || "11111111-1111-4111-8111-111111111111",
      role: "dev"
    };

    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded.uuid) {
      return res.status(401).json({ message: "Token missing uuid" });
    }

    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  authenticate
};
