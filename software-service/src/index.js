const express = require("express");
require("dotenv").config();

const { sequelize } = require("./models");

const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comment.route");
const likeRoutes = require("./routes/like.route");
const followRoutes = require("./routes/follow.route");
const userRoutes = require("./routes/user.route");
const feedRoutes = require("./routes/feed.route");
const meRoutes = require("./routes/me.route");

const app = express();
const port = process.env.API_PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/subscribe", followRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/me", meRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Software database connected");

    await sequelize.sync({ alter: true });
    console.log("Software models synchronized");

    app.listen(port, () => {
      console.log(`Software service running on port ${port}`);
    });
  } catch (err) {
    console.error("Unable to start software-service:", err);
  }
}

startServer();
