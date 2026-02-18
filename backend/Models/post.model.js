import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: { type: String, default: '' },
    image: { type: String, required: true },
    imageId: { type: String, required: true }, // Add this field to store Cloudinary image ID
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
});

export const Post = mongoose.model('Post', postSchema);
