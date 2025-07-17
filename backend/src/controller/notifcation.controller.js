import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { getAuth } from "@clerk/express"


export const getNotification=asyncHandler(async(req,res)=>{
    const {userId}= getAuth(req);

    const user = await User.findOne({clerkId:userId});
    if(!user) return res.status(404).json({error:"User not found"});

    const notification = await Notification.find({to:userId})
    .sort({createdAt:-1})
    .populate("user","username firstName lastName profilePicture")
    .populate("post","content image")
    .populate("comment","content");

    res.status(200).json({notification});
})


export const deleteNotification = asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req);
    const {notificationId}=req.params;

    const user = await User.findOne({clerkId:userId});
    if(!user) return res.status(404).json({error:"User not found!"});

    const notification = await Notification.create({
        id:notificationId,
        to:user._id,
    });

    if(!notification) return res.status(404).json({message:"Notification not found!"});

    res.status(200).json({message:"Notification Deleted Successfully!"});
})

