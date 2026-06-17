const UserModel = require("../models/user.model");

async function getUserById(req, res) {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id).select("-__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { user_name, user_email } = req.body;

        if (req.user.id !== id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await UserModel.findByIdAndUpdate(
            id,
            { user_name, user_email },
            { new: true, runValidators: true }
        ).select("-__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await UserModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function updateUserProfile(req, res) {
    try {
        const { userId } = req.params;
        const { user_bio, user_avatar_url, id_language, id_type } = req.body;

        if (req.user.id !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { user_bio, user_avatar_url, id_language, id_type },
            { new: true, runValidators: true }
        ).select("-__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = { getUserById, updateUser, deleteUser, updateUserProfile };
