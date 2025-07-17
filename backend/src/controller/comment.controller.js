import  asyncHandler from "express-async-handler";
import {getAuth} from "@clerk/express";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
export const getComment = asyncHandler(async(req,res)=>{
    const {postId}= req.params;

    const comments = await Comment.find({post:postId})
    .sort({createdAt:-1})
    .populate("user","username firstName lastName profilePicture");

    res.status(200).json({comments});
})

export const createComment=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req);
    const {postId}=req.params;
    const {content} = req.body;

    if(!content || content.trim() ===' '){
        return res.status(404).json({error:"Comments are required!"});
    }
    const user = await User.findOne({clerkId:userId});
    const post = await Post.findById(postId);

    if(!user || !post) return res.status(404).json({error:"User or Post is not found"});

    const comment = await Comment.create({
        from:user._id,
        post:postId,
        content,
    });

    //linking comments to the post of the user
    await Post.findByIdAndUpdate(postId,{
        $push:{comments:comment._id},
    });

    if(post.user.toString() !== user._id.toString()){
        await Notification.create({
            from:user._id,
            to:post.user,
            type:"comment",
            post:postId,
            comment:comment._id,
        })
    };
    res.status(200).json({comment});
    
})

export const deleteComment=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req);
    const {commentId}=req.params;

    const user= await User.findOne({clerkId:userId});
    const comment = await Comment.findById(commentId);

    if(!user || !comment){
        return res.status(404).json({error:"User or Comment not found!"});
    }

    if(comment.from.toString()!== user._id.toString()){
        return res.status(404).json({error:"You Can only delete your own comments"});
    }

    await Post.findByIdAndUpdate(comment.post,{
        $pull:{comments:comment._id},
    });


    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({message:"Comment deleted Successfully!"});
    
})