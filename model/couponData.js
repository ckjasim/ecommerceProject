const mongoose=require('mongoose')

const couponSchema =new mongoose.Schema({
    code:{type:String,required:true,trim:true},
    name:{type:String,trim:true},
    description:{type:String,required:true},
    percentage:{type:Number,required:true},
    minAmount:{type:Number,required:true},
    maxAmount:{type:Number,required:true},
    expiredAt:{type:Date,required:true},
    status:{type:Boolean,required:true},
    users:{type:Array}
})

module.exports=mongoose.model('coupon',couponSchema)