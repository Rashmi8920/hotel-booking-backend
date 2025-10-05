import express from "express";
import {
    createPostController,
     getAllPostsController,
    getPostController,
    getRelatedPostsController,
    postFiltersController
    // delePostCoontroller,searchProductController,  updatePostController
} from '../controller/Post.js'

const router= express.Router();

router.post("/create-post",createPostController)
router.get("/get-post/:slug", getPostController);
router.get("/get-all-post",getAllPostsController);
router.get("/related-post/:postId/:categoryId",getRelatedPostsController);
app.post("/product-filters", postFiltersController);
// router.put("/update-post/:id",updatePostController);
// router.delete("/delete-post/:id",delePostCoontroller);
// router.get('/search/:keyword',searchProductController)

 export default router;
