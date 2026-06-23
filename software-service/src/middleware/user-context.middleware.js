function attachUserContext(req, res, next) {
  const userUuid = req.headers["x-user-uuid"];

  if (!userUuid) {
    return res.status(400).json({
      message: "Missing X-User-UUID header"
    });
  }

  req.user = {
    uuid: userUuid
  };

  return next();
}

module.exports = {
  attachUserContext
};
