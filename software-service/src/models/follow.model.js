const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower_id: {
      type: String,
      required: true,
      index: true,
    },
    following_id: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    collection: "follows",
    timestamps: true,
  }
);

followSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
