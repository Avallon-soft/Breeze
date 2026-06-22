const { connectDatabase, mongoose } = require("../config/database.config");

const Post = require("./post.model");
const Comment = require("./comment.model");
const Like = require("./like.model");
const Follow = require("./follow.model");
const User = require("./user.model");

module.exports = {
  connectDatabase,
  mongoose,
  Post,
  Comment,
  Like,
  Follow,
  User,
};
