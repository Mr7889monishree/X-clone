import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    User:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true,
    },
    content:{
        type:String,
        maxLength:200,
    },
    image:{
        type:String,
        default:"",
    },
    Likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    ],
    Comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        },
    ],

},{timestamps:true})

const Post = mongoose.model("Post",postSchema);


export default Post;