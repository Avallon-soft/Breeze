const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    avatar: {
      type: String,
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },
  },
  {
    collection: "users",
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

module.exports = mongoose.model("User", userSchema);
