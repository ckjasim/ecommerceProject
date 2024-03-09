const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    fName:{type:String,required:true,trim:true},
    lName:{type:String,trim:true},
    email:{type:String,required:true},
    mobile:{type:String,required:true},
    password:{type:String,required:true},
    isAdmin:{type:Number,required:true}
})

module.exports=mongoose.model('users',userSchema)