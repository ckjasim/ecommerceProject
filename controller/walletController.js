const orderSchema=require('../model/orderData')
const walletSchema=require('../model/walletData')


//--------------------return user-------------------------

const addReturnProduct= async (req,res)=>{
try {
    const {reason,orderId,productObjectId}=req.body
    const orderDetails = await orderSchema.findOne({ userId: req.session.user_id,_id: orderId}).populate('products.productId').populate('userId');
    const updatedOrder = orderDetails.products.find((product) => {
        return product._id.equals(productObjectId);
    });
        updatedOrder.reason = reason;
        await orderDetails.save()
        res.redirect('/loadProfile')
    
} catch (error) {
    res.render('error')
}
}

//-------------------return admin-------------------------------
const   acceptReturn= async (req,res)=>{
    try {
        const{productObjectId,orderId,returnAmount}=req.body
        if(req.body.status==='accepted'){
            const orderDetails = await orderSchema.findOne({_id: orderId}).populate('products.productId').populate('userId');
        const updatedOrder = orderDetails.products.find((product) => {
            return product._id.equals(productObjectId);
        });
        updatedOrder.orderStatus = "returned";
        updatedOrder.reason = undefined;
        await orderDetails.save()
        const walletDetails = await walletSchema.findOne({ userId: req.session.user_id });
            if (walletDetails) {
                const walletTotal = Number(walletDetails.walletAmount) + Number(returnAmount);
                const newWallet = {
                    amount: returnAmount,
                    description: "Return Product",
                    status: "credit",
                    date:new Date()
                };
                walletDetails.wallets.push(newWallet);
                walletDetails.walletAmount = walletTotal;
                await walletDetails.save();
            }
            else{
            const wallets=[]
            const newWallet={
                amount:returnAmount,
                description:"Return Product",
                status:"credit",
                date:new Date()
            }
            wallets.push(newWallet)
            const walletData=new walletSchema({
                walletAmount:returnAmount,
                wallets:wallets,
                userId:req.session.user_id
            })
            await walletData.save()

        }
        }
        if(req.body.status==='rejected'){
            const orderDetails = await orderSchema.findOne({_id: orderId}).populate('products.productId').populate('userId');
            const updatedOrder = orderDetails.products.find((product) => {
                return product._id.equals(productObjectId);
            });
        updatedOrder.reason = undefined;
        await orderDetails.save()

        }
    } catch (error) {
        console.log(error)
    }
    }

module.exports={

    addReturnProduct,
    acceptReturn
}