const mongoose=require('mongoose')

const categorySchema =new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    is_block:{type:Boolean,required:true}
})

module.exports=mongoose.model('category',categorySchema)