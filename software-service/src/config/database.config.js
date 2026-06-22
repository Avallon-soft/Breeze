const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const mongoUri = process.env.SOFTWARE_MONGO_URI || "mongodb://127.0.0.1:27017/breeze";

async function connectDatabase() {
  await mongoose.connect(mongoUri);
}

module.exports = {
  connectDatabase,
  mongoose,
};
