const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment_id: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true,
      required: true,
    },
    comment_content: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    post_id: {
      type: String,
      required: true,
      index: true,
    },
    parent_comment_id: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    collection: "comments",
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
