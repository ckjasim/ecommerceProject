const mongoose=require('mongoose')

const couponSchema =new mongoose.Schema({
    code:{type:String,required:true,trim:true},
    name:{type:String,trim:true},
    description:{type:String,required:true},
    percentage:{type:Number,required:true},
    minAmount:{type:String,required:true},
    expiredAt:{type:Date,required:true},
})

module.exports=mongoose.model('coupon',couponSchema)