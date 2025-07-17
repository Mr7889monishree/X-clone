import express from "express"
import { createPost, deletePost, getPost, getPosts, getUserpost, likePost } from "../controller/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";


const postRoutes=express.Router();

//public routes
postRoutes.get('/',getPosts);
postRoutes.get('/:postId',getPost);
postRoutes.get('/user/:username',getUserpost);


//protected route - while creating or deleting posts the user needs to be authenticated to do these actions
postRoutes.post('/',protectRoute,upload.single("image"),createPost);
postRoutes.post('/:postId/like',protectRoute,likePost)
postRoutes.delete('/:postId',protectRoute,deletePost)
export default postRoutes;

