const UserService = require("../services/user.service");

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        res.status(200).json(user);
    } catch (err) {
        const status = err.message === "User not found" ? 404 : 400;
        res.status(status).json({ message: err.message });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { user_name, user_email } = req.body;

        if (req.user.id !== id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await UserService.updateUser(id, { user_name, user_email });
        res.status(200).json(user);
    } catch (err) {
        const status = err.message === "User not found" ? 404 : 400;
        res.status(status).json({ message: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await UserService.deleteUser(id);
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        const status = err.message === "User not found" ? 404 : 400;
        res.status(status).json({ message: err.message });
    }
}

async function updateUserProfile(req, res) {
    try {
        const { userId } = req.params;
        const { user_bio, user_avatar_url, id_language, id_type } = req.body;

        if (req.user.id !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await UserService.updateUserProfile(userId, { user_bio, user_avatar_url, id_language, id_type });
        res.status(200).json(user);
    } catch (err) {
        const status = err.message === "User not found" ? 404 : 400;
        res.status(status).json({ message: err.message });
    }
}

module.exports = { getUserById, updateUser, deleteUser, updateUserProfile };
