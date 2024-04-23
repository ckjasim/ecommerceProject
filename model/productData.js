const mongoose =require('mongoose')

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    quantity:{type:Number,required:true},
    img:{type:Array,required:true},
    color:{type:String,required:true},
    size:{type:String,required:true},
    material:{type:String,required:true},
    productStatus:{type:String,required:true},
    description:{type:String,required:true},
    createdAt:{type:Date,required:true}, 
    is_listed:{type:Boolean,default:true},
    categoryId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'category'},
    offerId:{type:mongoose.Schema.Types.ObjectId,ref:'offer'},
   
})


module.exports=mongoose.model('products',productSchema)