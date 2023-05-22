const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [100, 'name field must not exceed 100 characters'],
    },
    content: {
        type: String,
        required: [true, 'content is required'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'author is required'],
    },
    category: {
        type: String,
        required: [true, 'category is required'],
        lowercase: true,
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'image is required'],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema)

module.exports = Post;