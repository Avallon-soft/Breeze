const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        trim: true,
    },
    user_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    user_bio: {
        type: String,
        default: "",
    },
    user_avatar_url: {
        type: String,
        default: null,
    },
    id_language: {
        type: Number,
        default: null,
    },
    id_type: {
        type: Number,
        default: null,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
