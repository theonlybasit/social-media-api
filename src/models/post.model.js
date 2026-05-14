const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        ref: "User"
    },

    caption: {
        type: String,
        maxlength: 500
    },

    imageUrl: {
        type: String
    },

    likesCount: {
        type: Number,
        default: 0
    },


},
    { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post