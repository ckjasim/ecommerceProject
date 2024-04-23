const mongoose=require('mongoose')

const categorySchema =new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    is_block:{type:Boolean,required:true},
    offerId:{type:mongoose.Schema.Types.ObjectId,ref:'offer'},

})

module.exports=mongoose.model('category',categorySchema)