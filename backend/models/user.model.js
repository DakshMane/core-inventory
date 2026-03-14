import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

  firebaseUid : {
    type : String ,
    unique : true
  } ,

  userType : {
    type : String ,
    enum : ["normal" , "admin", "staff", "manager"] ,
    default : "normal"
  } ,

  email : {
    type : String ,
    unique : true ,
    sparse : true
  } ,

  name : {
    type : String ,

  } ,
  avatar : {
    type : String
  } ,
  provider : {
    type : String
  } ,
  
})


export const User = mongoose.model("User" , userSchema)
