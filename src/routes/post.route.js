const express = require('express')

const {createPost, getSinglePost, getAllPosts, updatePost, deletePost } = require('../controllers/post.controller')
const validateObjectId = require('../middleware/validateobjectId')
const upload = require('../middleware/upload')

const router = express.Router()

// GET ALL POSTS
router.get('/', getAllPosts)

// GET SINGLE POST
router.get('/:id',validateObjectId, getSinglePost)

// CREATE A POST
router.post('/', upload.single("imageUrl"), createPost)


// UPDATE POST
router.patch('/:id',validateObjectId, updatePost)

// DELETE POST
router.delete('/:id', validateObjectId, deletePost)






   
module.exports = router