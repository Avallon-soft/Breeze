const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

// const POST_LIFETIME_MS = 24 * 60 * 60 * 1000;

function addComputedFields(ret) {
  if (ret.expiresAt) {
    ret.expired = new Date(ret.expiresAt) <= new Date();
  }

  delete ret._id;
  delete ret.__v;

  return ret;
}

const postSchema = new mongoose.Schema(
  {
    post_id: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true,
      required: true,
    },
    post_content: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    collection: "posts",
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        return addComputedFields(ret);
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        return addComputedFields(ret);
      },
    },
  }
);

module.exports = mongoose.model("Post", postSchema);
