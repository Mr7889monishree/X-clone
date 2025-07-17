export const protectRoute=async(req,res,next)=>{
    if(!req.auth().isAuthenticated){
        return res.status(400).json({message:"Unauthorized - you must be logged in "});
    }
    //If the user is authenticated, we call next(), meaning now they are allowed to go to the next stage, like updating the profile.
    next();
}