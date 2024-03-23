const mongoose=require('mongoose');

const addressSchema = new mongoose.Schema({
   name:{type:String,required:true,trim:true},
   mobile:{type:String,required:true},
   pincode:{type:String,trim:true},
   locality:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    district:{type:String,required:true},
    state:{type:String,required:true},
    landmark:{type:String,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'}
})

module.exports=mongoose.model('address',addressSchema)