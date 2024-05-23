const mongoose = require("mongoose");



const postSchema =  mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  image:String,
  description:String,
  title:String
  },


);

module.exports = mongoose.model("post",postSchema)