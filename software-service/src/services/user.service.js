const UserModel = require("../models/user.model");

async function getUserById(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("User not found");
    return user;
}

async function updateUser(id, { user_name, user_email }) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.update({ user_name, user_email });
    return user;
}

async function deleteUser(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.destroy();
}

async function updateUserProfile(userId, { user_bio, user_avatar_url, id_language, id_type }) {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new Error("User not found");
    await user.update({ user_bio, user_avatar_url, id_language, id_type });
    return user;
}

module.exports = { getUserById, updateUser, deleteUser, updateUserProfile };
