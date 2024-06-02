const mongoose = require("mongoose");
const plm =require("passport-local-mongoose");
const post = require("./post");


const userSchema =  mongoose.Schema({
  username:{
    type:String,
  },
  name:String,
  email:String,
  password:String,
  profileImage:String,
  contact:Number,
  boards:{
    type:Array,
    default:[]
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
  }]


});
userSchema.plugin(plm)
module.exports = mongoose.model("user",userSchema)