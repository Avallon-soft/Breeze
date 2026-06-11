require("dotenv").config();

const express = require("express");

const authRoutes = require("./routes/auth.route");
const {authenticate} = require("./middleware/auth.middleware");

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;