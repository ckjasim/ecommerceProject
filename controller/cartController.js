const cartSchema = require('../model/cartData')
const productSchema = require('../model/productData')
const addressSchema = require('../model/addressData')


const loadCart = async (req, res) => {
    try {

        if (!req.session.user_id) {
           console.log('++++')
           res.send({ status: 'success', message: 'please login first',session:false });
            
        } else {
            console.log('+++sdssd+')
        
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id })
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        
        req.flash('quantity',quantity)
        
        console.log('--------')
        const productData = await productSchema.findOne({ _id: productId })
        const total=quantity*productData.price

        const productToAdd = [{
            productId: productId,
            quantity:quantity,
            totalAmount:total,
            inStock: productData.quantity,
            name: productData.name,
            size: productData.size,
            color: productData.color,
            price: productData.price,
            img: productData.img[0]
        }];

        if (!cartDetails) {
            const cartData=new cartSchema({
                userId:req.session.user_id,
                products:productToAdd,
                
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
            
            res.send({ status: 'success', message: 'Added to cart successfully', session:true});
            
    }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
};


const viewCart =async(req,res)=>{
    try {
        
        quantity=req.flash('quantity').toString()
        
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId').populate('userId')
        const cartTotal = cartDetails.products.reduce((Total, amount) => Total + amount.totalAmount, 0);
        res.render('cart',{cartDetails,cartTotal})
       
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
}




const updateQuantity = async (req, res) => {
    try {
        console.log('00000')
        const { cartQuantity, productId } = req.body;
        
        const cartData = await cartSchema.findOne({userId: req.session.user_id }).populate('products.productId').populate('userId')
        const productData=cartData.products.find((product)=>{
            return product.productId.equals(productId)
        })
        productData.quantity=cartQuantity
        productData.totalAmount= productData.productId.price * cartQuantity
        // const priceTotal=productData.totalAmount
        await cartData.save()   
        // console.log(priceTotal)
        const cartTotal = cartData.products.reduce((Total, amount) => Total + amount.totalAmount, 0);
        console.log(cartTotal)
        res.status(200).json({ status: 'success', message: 'Quantity updated successfully',cartTotal});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}


const deleteCartProduct = async (req, res) => {
    try {
        
        const { productId } = req.body;

        const cartData = await cartSchema.findOne({userId: req.session.user_id }).populate('products.productId').populate('userId')
        const productIndex=cartData.products.findIndex((product) => {
            return product.productId.equals(productId);
        });
        const deleteProduct = cartData.products.splice(productIndex, 1);
        await cartData.save()   
      
        res.status(200).json({ status: 'success', message: 'product deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}
const checkout = async (req, res) => {
    try {
        const userData=req.session.user_id
        const addressData = await addressSchema.find({userId:userData}).populate('userId')
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId').populate('userId')
        const cartTotal = cartDetails.products.reduce((Total, amount) => Total + amount.totalAmount, 0);
        console.log(cartTotal)
        
        res.render('checkout',{addressData,cartDetails,cartTotal})
      
        // res.status(200).json({ status: 'success', message: 'product deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}




module.exports={
    viewCart,
    loadCart,
    updateQuantity,
    deleteCartProduct,
    checkout,
    
}