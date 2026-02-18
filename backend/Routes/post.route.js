import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookMarkPost, deleteComment, deletePost, dislikepost, getAllPost, getCommentOfPost, getUserPost, likepost } from "../Controllers/post.controller.js";
const router=express.Router();
router.route("/addpost").post(isAuthenticated,upload.single('image'),addNewPost)
router.route("/all").get(isAuthenticated,getAllPost)
router.route("/:id/like").get(isAuthenticated,likepost)
router.route("/:id/dislike").get(isAuthenticated,dislikepost)
router.route("/:id/comment").post(isAuthenticated,addComment)
router.route("/:postId/comment/:commentId").delete(isAuthenticated,deleteComment)
router.route("/:id/comment/all").post(isAuthenticated,getCommentOfPost)
router.route("/delete/:id").delete(isAuthenticated,deletePost)
router.route("/:id/bookmark").get(isAuthenticated,bookMarkPost)
export default router;