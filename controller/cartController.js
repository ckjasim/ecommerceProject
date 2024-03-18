const cartSchema = require('../model/cartData')
const productSchema = require('../model/productData')
// const productSchema = require('../model/productData')

// const loadCart=async (req,res)=>{
//     try {
//         console.log('dssddsdd');
//         console.log(req.body.quantity);

       

//         // const cartDetails=await cartSchema.findOne({userId:req.session.user_id}).populate('productId').populate('userId')

//         res.render('cart')
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }
const viewCart =async(req,res)=>{
    try {

        quantity=req.flash('quantity').toString()
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id }).populate('products').populate('userId')
        console.log(cartDetails)
        

        res.render('cart',{quantity,cartDetails})
    } catch (error) {
        console.log(error.message);
    }
}

const loadCart = async (req, res) => {
    try {
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id })
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        
        req.flash('quantity',quantity)
        
        console.log('--------')
        const productData = await productSchema.findOne({ _id: productId })
        const total=quantity*productData.price

        const productToAdd = [{
            productId: productId,
            quantity: productData.quantity,
            name: productData.name,
            size: productData.size,
            color: productData.color,
            price: productData.price,
            img: productData.img[0]
        }];

        if (!cartDetails) {
            const cartData=new cartSchema({
                quantity:quantity,
                totalAmount:total,
                userId:req.session.user_id,
                products:productToAdd,
                createdAt:new Date(),
            })
            await cartData.save()

            
        } else {
            const a = await cartSchema.findOneAndUpdate(
                { userId: req.session.user_id },
                {
                    $push:{
                        products:productToAdd
                    }
                }
            );
        }
        

        console.log('--------')
        // const totalAmount=cartDetails.productId.price*quantity
        
        res.send({ status: 'success', message: 'Added to cart successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
};




module.exports={
    viewCart,
    loadCart
}