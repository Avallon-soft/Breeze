const express = require("express");
require("dotenv").config();

const { connectDatabase, mongoose } = require("./models");
const { attachUserContext } = require("./middleware/user-context.middleware");

const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comment.route");
const likeRoutes = require("./routes/like.route");
const followRoutes = require("./routes/follow.route");
const userRoutes = require("./routes/user.route");
const feedRoutes = require("./routes/feed.route");
const meRoutes = require("./routes/me.route");
const internalRoutes = require("./routes/internal.route");

const app = express();
const port = process.env.API_PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;

  res.status(mongoConnected ? 200 : 503).json({
    status: mongoConnected ? "UP" : "DEGRADED",
    service: "software-service",
    database: {
      type: "mongodb",
      status: mongoConnected ? "CONNECTED" : "DISCONNECTED",
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/internal", internalRoutes);

app.use(attachUserContext);

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/subscribe", followRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/me", meRoutes);

async function startServer() {
  try {
    await connectDatabase();
    console.log("Software Mongo database connected");

    app.listen(port, () => {
      console.log(`Software service running on port ${port}`);
    });
  } catch (err) {
    console.error("Unable to start software-service:", err);
  }
}

startServer();
