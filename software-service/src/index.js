require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.route");

const app = express();
const port = process.env.API_PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Software Service");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/softwaredb")
    .then(() => {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

module.exports = app;
