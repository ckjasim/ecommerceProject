const mongoose=require('mongoose')

const offerSchema =new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    description:{type:String,required:true},
    percentage:{type:Number,required:true},
    offerType:{type:String,required:true},
    category:{type:String},
    product:{type:String},
    expiredAt:{type:Date,required:true},
})

module.exports=mongoose.model('offer',offerSchema)