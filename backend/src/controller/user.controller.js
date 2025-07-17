import { clerkClient, getAuth } from "@clerk/express";//this will give us the user id for updation of profile
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler"
import Notification from "../models/notification.model.js"
export const getUserProfile=asyncHandler(async(req,res)=>{
    const {username} = req.params;
    const user = User.findOne({username});
    if(!user) return res.status(404).json({error:"User not found!"});

    res.status(200).json({user});
    

})

export const updateProfile=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req);//pulls the clerk authenticated user id using getAuth from the request given

    // Then we search for the user in our database using their Clerk ID.
    // Once found, we update the user's profile with the data from req.body.
    // The { new: true } option ensures we get the updated user document returned.
    const user = await User.findOneAndUpdate({clerkId:userId},req.body,{new:true})

    if(!user) return res.status(400).json({error:"User not found"});

    res.status(200).json({user});//by this user data has been updated 

})

export const syncUser=asyncHandler(async(req,res)=>{
    //getting the userId
    const {userId} = getAuth(req);

    //to check if the user exists in the database
    const existingUser = await User.findOne({clerkId:userId});

    //if the user exists means then we can return this
    if(existingUser){
        return res.status(404).json({message:"User already exists"});
    }

    //we are gonna get the userId from clerkServer
    const clerkUser = await clerkClient.users.getuser({userId});

    const userData = {
        clerkId:userId,
        email:clerkUser.emailAddresses[0].emailAddress,
        firstName:clerkUser.firstName || "",
        lastName:clerkUser.lastName || "",
        username:clerkUser.emailAddresses[0].emailAddress.split("@")[0],
        profilePicture:clerkUser.imageUrl || "",
    }
    const user = await User.create(userData);


    res.status(200).json({message:"User created Successfully!"});
    
})


export const getCurrentUser=asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req);

    const user = await User.findOne({clerkId:userId})

    if(!user) return res.status(400).json({message:"User not found"});
    res.status(200).json({user})
})

/* export const followUser=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req);
    const {targetUserId} = req.params;

    if(userId===targetUserId) return res.status(400).json({message:"You cannot follow Yourself"});
    
    const currentUser = await User.findOne({clerkId:userId});
    const targetedUser =await User.findById(targetUserId);

    if(!currentUser || !targetedUser) return res.status(400).json({error:"Error something went wrong!"});

    const isfollowing= currentUser.following.includes(targetUserId);

    if(isfollowing){
        //unfollow
        await  User.findByIdAndUpdate(currentUser._id,{
            $pull:{following:targetUserId}
        })
        await  User.findByIdAndUpdate(currentUser._id,{
            $pull:{followers:currentUser._id}
        })
        
    }
    else{
        //follow
        await  User.findByIdAndUpdate(currentUser._id,{
            $push:{following:targetUserId}
        })
        await  User.findByIdAndUpdate(currentUser._id,{
            $push:{followers:currentUser._id}
        })

        await Notification.create({
            to:currentUser._id,
            from:targetUserId,
            type:"follow",
        })
        
    }
    
    return res.status(400).json({
        message:isfollowing ? "User Unfollowed Successfully" : "User followed Scuccessfully",
    });
    
}) */
export const followUser=asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req);
    const {targetUserId}=req.params;

    if(userId===targetUserId) return res.status(400).json({message:"You cannot follow Yourself"});

    const currentUser = await User.findOne({clerkId:userId});
    const targetUser=await User.findById(targetUserId);

    if(!currentUser || !targetUser) return res.status(400).json({message:"User not found"});

    const isFollowing =  currentUser.following.includes(targetUser);

    if(isFollowing){
        //unfollow
        await User.findByIdAndUpdate(currentUser._id,{
            $pull:{following:targetUserId},
        });
        await User.findByIdAndUpdate(currentUser._id,{
            $pull:{followers:currentUser._id},
        });
    }
    else{
        //follow
        await User.findByIdAndUpdate(currentUser._id,{
            $push:{following:targetUserId},
        });
        await User.findByIdAndUpdate(currentUser._id,{
            $push:{followers:currentUser._id},
        });


        await Notification.create({
            from:currentUser._id,
            to:targetUserId,
            type:"follow",
        });
        

        res.status(200).json({message:isfollowing ? "Unfollowed Successfully" : "Following Scuccessfully"});
    }
})