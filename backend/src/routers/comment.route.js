import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getComment } from "../controller/comment.controller.js";


const commentRoutes = express.Router();

//public routes
commentRoutes.get('/post/:postId',getComment);

//protected routes
commentRoutes.post('/post/:postId',protectRoute,createComment);
commentRoutes.delete('/:commentId',protectRoute,deleteComment);

export default commentRoutes