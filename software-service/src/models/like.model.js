const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    like_id: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    post_id: {
      type: String,
      default: null,
      index: true,
    },
    comment_id: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    collection: "likes",
    timestamps: true,
  }
);

likeSchema.index(
  { user_id: 1, post_id: 1 },
  { unique: true, partialFilterExpression: { post_id: { $type: "string" } } }
);

likeSchema.index(
  { user_id: 1, comment_id: 1 },
  { unique: true, partialFilterExpression: { comment_id: { $type: "string" } } }
);

module.exports = mongoose.model("Like", likeSchema);
