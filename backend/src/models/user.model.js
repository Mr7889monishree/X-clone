import mongoose from "mongoose";


export const UserSchema = new mongoose.Schema(
    {
        clerkId:{
            type:String,
            required:true,
            unique:true,
        },
        emailId:{
             type:String,
             required:true,
             unique:true,          
             validate: {
               validator: function(v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
               },
               message: 'Please enter a valid email address'
          },
         },

        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        },
        username:{
            type:String,
            required:true,
            unique:true,
        },
        profilePicture:{
            type:String,
            default:""
        },
        BannerImage:{
            type:String,
            default:""
        },
        bio:{
            type:String,
            default:"",
            maxLength:150,
        },
        location:{
            type:String,
            default:""
        },
        followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        following:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],

    },
    {timestamps:true}
)


const User = mongoose.model("User",UserSchema);


export default User;