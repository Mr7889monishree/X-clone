import mongoose from "mongoose";



const notificationSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    //notification types that user can receive
    type:{
        type:String,
        required:true,
        enum:["Follow","Like","Comment"],
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default:null,
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default:null,
    },
    
},
    {timestamps:true}
)

const Notification = mongoose.model("Notification",notificationSchema);


export default Notification;