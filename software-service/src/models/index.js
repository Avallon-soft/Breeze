const sequelize = require("../config/database.config");

const Post = require("./post.model");
const Comment = require("./comment.model");
const Like = require("./like.model");
const Follow = require("./follow.model");

Post.hasMany(Comment, {
  foreignKey: "post_id",
  as: "comments"
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post"
});

Post.hasMany(Like, {
  foreignKey: "post_id",
  as: "likes"
});

Like.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post"
});

Comment.hasMany(Comment, {
  foreignKey: "parent_comment_id",
  as: "replies"
});

Comment.belongsTo(Comment, {
  foreignKey: "parent_comment_id",
  as: "parent"
});

module.exports = {
  sequelize,
  Post,
  Comment,
  Like,
  Follow
};