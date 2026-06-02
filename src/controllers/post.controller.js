const Post = require("../models/post.model.js");
const supabase = require("../config/supabase.js");

async function createPost(req, res) {
  try {
    const { author, caption } = req.body;
    let imageUrl = req.body.imageUrl || null;
    const cleanedCaption = caption?.trim();

    if (!cleanedCaption && !imageUrl) {
      return res
        .status(400)
        .json({ message: "You must enter a caption or an Image" });
    }

    if (cleanedCaption && cleanedCaption.length > 500) {
      return res.status(400).json({ message: "Character must not exceed 500" });
    }

    if (!author) {
      return res.status(400).json({ message: "You must have an account" });
    }

    if (req.file) {
      const file = req.file;
      const fileExt = file.originalname.split(".").pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(uniqueFileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        throw new Error(`Supabase Storage upload error: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(uniqueFileName);
      imageUrl = publicUrlData.publicUrl;

    }

    const newPost = {
      author,
      caption: cleanedCaption || "",
      imageUrl: imageUrl || null,
    };

    const post = await Post.create(newPost);
    return res
      .status(201)
      .json({ message: "Post created successfully", data: post });
  } catch (error) {
    return res.status(500).json({
      message: "The server is currently down, try again",
      error: error.message,
    });
  }
}

async function getSinglePost(req, res) {
  try {
    const { id } = req.params;

    const singlePost = await Post.findById(id);

    if (!singlePost) {
      return res.status(404).json({ message: "Post could not be found" });
    }

    return res.status(200).json({ message: "Success", data: singlePost });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "An unexpected error occured" });
  }
}

async function getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res
      .status(200)
      .json({ message: "Success", count: posts.length, data: posts });
  } catch (error) {
    console.error(`Error fetching all posts: ${error}`);

    return res
      .status(500)
      .json({ message: "An unexpected error occured", error: error.message });
  }
}

async function updatePost(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Fields cannot be empty",
      });
    }

    const { id } = req.params;

    const { caption, imageUrl } = req.body;

    const cleanedCaption = caption?.trim();

    if (caption === "undefined" && imageUrl === "undefined") {
      return res.status(400).json({ message: "No changes has been made" });
    }

    if (cleanedCaption && cleanedCaption.length > 500) {
      res.status(400).json({ message: "Caption cannot exceed 500 characters" });
    }
    const updatePost = await Post.findById(id);

    if (!updatePost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (caption !== undefined) {
      updatePost.caption = cleanedCaption || "";
    }
    if (imageUrl !== undefined) {
      updatePost.imageUrl = imageUrl || "";
    }
    const updatedPost = await updatePost.save();

    return res
      .status(200)
      .json({ message: "Post updated successfully", data: updatePost });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const deletePost = await Post.findByIdAndDelete(id);

    if (!deletePost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res
      .status(200)
      .json({ message: "Post deleted successfully", data: deletePost });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
module.exports = {
  createPost,
  getSinglePost,
  getAllPosts,
  updatePost,
  deletePost,
};
