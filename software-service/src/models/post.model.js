const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

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
  },
  {
    collection: "posts",
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Post", postSchema);
