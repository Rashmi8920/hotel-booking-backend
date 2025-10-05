import mongoose from "mongoose";
// import cloudinary from "../config/Cloudinary.js";
import Post from "../models/Post.js";
import slugify from "slugify";

export const createPostController = async (req, res) => {
  try {
    const {
      title,
      hotelLocation,
      description,
      category,
      isAvailable,
      guest,
      price,
    } = req.body;

    // convert comma separated string to array
    const nearArea = req.body.nearArea?.split(",").map(item => item.trim());
    const facilities = req.body.facilities?.split(",").map(item => item.trim());

    const files = req.files?.images;

    // validate required fields
    if (
      !title ||
      !hotelLocation ||
      !category ||
      !description ||
      !isAvailable ||
      !guest ||
      !price ||
      !nearArea ||
      !facilities ||
      !files
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // validate exactly 3 images
    if (!Array.isArray(files) || files.length !== 3) {
      return res.status(400).json({
        message: "You must provide exactly 3 images",
      });
    }

    // upload images to cloudinary
    const imageUrls = await Promise.all(
      files.map(file =>
        cloudinary.uploader
          .upload(file.tempFilePath)
          .then(res => res.secure_url)
      )
    );

    // create post
    const newPost = new Post({
      title,
      hotelLocation,
      description,
      category,
      guest,
      price,
      nearArea,
      facilities,
      images: imageUrls,
      isAvailable,
      slug: slugify(title, { lower: true }),
    });

    await newPost.save();
    console.log("Saved post:", newPost);

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getPostController = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
      console.log("Fetched post",post)
    return res.status(200).json({
      success: true,
      message: "post fetched successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while hgetting post",
      error,
    });
  }
};

export const getAllPostsController = async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.status(200).send({
      success: true,
      message: "post fetched succefully",
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: true,
      message: "error while getting post",
      error,
    });
  }
};

export const getRelatedPostsController = async (req, res) => {
  try {
    const { postId, categoryId } = req.params;
    console.log("Incoming PostID:", postId);
    console.log("Incoming categoryId:", categoryId);
    const relatedPost = await Post.find({
      category: categoryId,
      _id: { $ne: postId },
      // _id:postId
    })

      .select("-photo")
      .limit(2)
      .populate("category");
    // console.log("Related Posts Found length :", relatedPost.length)
    return res.status(200).send({
      success: true,
      message: "related post fetched successfully",
      relatedPost,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error while fetching posts",
      error,
    });
    // console.log(error)
  }
};
export const postFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    // Build query object
    let args = {};
    if (checked?.length) args.guest = { $in: checked }; // Match guest count
    if (radio?.length === 2) args.price = { $gte: radio[0], $lte: radio[1] }; // Match price range

    // Fetch filtered posts
    const products = await Post.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error while filtering products:", error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};


// export const updatePostController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       title,
//       hotelLocation,
//       description,
//       facilities,
//       nearArea,
//       category,
//       guest,
//       isAvilable,
//       price,
//     } = req.body;

//     const files = req.files?.images;

//     // find existing post
//     const post = await Post.findByIdAndUpdate(id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     //  validate Post filds
//     if (
//       !title &&
//       !hotelLocation &&
//       !description &&
//       !facilities &&
//       !nearArea &&
//       !category &&
//       !guest &&
//       !isAvilable === undefined &&
//       !price &&
//       !files
//     ) {
//       return res.status(400).json({ message: "no fields provided to update." });
//     }
//     // handle image update---------
//     if (files && files.length === 3) {
//       // delete the older images
//       await promise.all(
//         post.images.map(url => {
//           const publicId = url.split("/").pop().split(".")[0];
//           return cloudinary.uploader.destroy(publicId);
//         })
//       );
//       //  ?upload new images
//       uploadImage = await promise.all(
//         files.map(file =>
//           cloudinary.uploader
//             .upload(file.tempFilePath)
//             .then(result => result.secure_url)
//         )
//       );
//     } else if (files && files.length !== 3) {
//       return res
//         .status(400)
//         .json({ message: "please upload exacly 3 images." });
//     }

//     //  update the post
//     const updatePost = await Post.finfById(id, {
//       ...(title && { title }),
//       ...(hotelLocation && { hotelLocation }),
//       ...(description && { description }),
//       ...(facilities && { facilities }),
//       ...(nearArea && { nearArea }),
//       ...(category && { category }),
//       ...(guest && { guest }),
//       ...(isAvailable !== undefined && { isAvailable }),
//       ...(price && { price }),
//       ...(files && { images: uploadImage }),
//       ...(title && { slug: slug(title, { lower: true }) }),
//     });
//     await updatePost.save();
//     return res.status(200).send({
//       success: true,
//       message: "Post updated successfully",
//       updatePost,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: true,
//       message: "error while updating post",
//       error,
//     });
//   }
// };

// export const delePostCoontroller = async (req, res) => {
//   try {
//     await Post.findByIdAndDelete(req.params.id);
//     return res.status(200).send({
//       success: true,
//       message: "post deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "error while deleting post",
//       error,
//     });
//   }
// };



// export const searchProductController = async (req,res) => {
//   try {
//     const { keyword } = req.params;
//     const words = keyword.split(" ");
//     const regexString=words.join("|")

//     const results = await Post.find({
//       $or: [
//         {
//           title: {
//             $regex: keyword,
//             $options: "i",
//           },
//         }, //option= case sensitive ho na ho to  bhi match krega
//         {
//           description: {
//             // $regex: words["|"], ======================================================================================
//                $regex: regexString,
//             $options: "i",
//           },
//         },
//       ],
//     })
//   .select("title hotelLocation images description")
//       .populate("category");
//       res.json(results)
//       console.log("images check",results)
     
//   } catch (error) {
//     console.log(error);
//   }
// };

