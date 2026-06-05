const express = require("express");
const {
  createPost,
  getSinglePost,
  getAllPosts,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const validateObjectId = require("../middleware/validateobjectId");
const upload = require("../middleware/upload");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// GET ALL POSTS
router.get("/", getAllPosts);

// GET SINGLE POST
router.get("/:id", validateObjectId, getSinglePost);

// CREATE A POST
router.post("/", authenticate, upload.single("imageUrl"), createPost);

// UPDATE POST
router.patch(
  "/:id",
  authenticate,
  validateObjectId,
  upload.single("image"),
  updatePost,
);

// DELETE POST
router.delete("/:id", authenticate, validateObjectId, deletePost);

module.exports = router;
