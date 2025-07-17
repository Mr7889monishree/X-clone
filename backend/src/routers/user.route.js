import express from "express"
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const routes= express.Router();

//for getting the user profile there is no need of authentication as we just get a user profile there

//public route
routes.get("/profile/:username",getUserProfile);//to get the user profile

//protectedroute

routes.post('/sync',protectRoute,syncUser);//to synchronize clerk and our database
routes.post('/currentUser',protectRoute,getCurrentUser);//to get the currentuser
routes.put('/profile',protectRoute,updateProfile)//to update the user profile
//update profile you have to be authenticated for this we are going to create middleware to check if are authenticated or not
routes.post('/follow/:targetUserId',protectRoute,followUser); // for following the user this endpoint will be used

export default routes;