import express from "express"
import { ENV } from "./config/env.config.js";
import { DB } from "./config/db.config.js";
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import userRoutes from "./routers/user.route.js"
import postRoutes from "./routers/post.route.js";
import commentRoutes from "./routers/comment.route.js";
import notificationRoutes from "./routers/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());//this will handel the authentication
app.use(arcjetMiddleware);//custom middleware so no need of calling like the inbuilt middleware from express 
const port = ENV.PORT || 5001; 


app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes)
app.use("/api/notifications",notificationRoutes);

//error handling middleware
app.use((err,req,res,next)=>{
    console.error("Unhandled error:",err);
    res.status(500).json({error:err.message || "Internal Server error"});
    
})


const startServer = async () => {
  try {
    await DB();
    //entering page
    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.get('/',(req,res)=>{
      res.status(200).json({message:"Welcome!"});
    })
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// export for vercel
export default app;