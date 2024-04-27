const mongoose=require('mongoose');

const walletSchema = new mongoose.Schema({
    walletAmount:{type:Number,required:true},
    wallets:[{
        amount:{type:Number,required:true},
        description:{type:String,required:true},
        status:{type:String,required:true},
        date:{type:Date,required:true},
    }],
    
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'},
})

module.exports=mongoose.model('wallet',walletSchema)