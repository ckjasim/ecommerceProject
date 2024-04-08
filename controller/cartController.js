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
        const productData = await productSchema.findOne({ _id: req.body.productId })
        console.log('--sssss------')
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
            
            const alreadyCart = await cartSchema.findOne({ "products.productId": productId ,userId:req.session.user_id});

            console.log('--------')
            // const totalAmount=cartDetails.productId.price*quantity
            
            res.send({ status: 'success', message: 'Added to cart successfully', session:true,alreadyCart});
            
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
        if(cartDetails){

            const cartTotal = cartDetails.products.reduce((Total, amount) => Total + amount.totalAmount, 0);
            res.render('cart',{cartDetails,cartTotal})
        }else{
            res.render('emptyCart')
        }
       
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
}

const updateProductDetails =async(req,res)=>{
    try {
        
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const productData = await productSchema.findOne({ _id: req.body.productId })
        
        console.log('--sssssppppppp------')
 
        const inStock=productData.quantity

        const alreadyCart = await cartSchema.findOne({ "products.productId": productId ,userId:req.session.user_id});

        res.send({ status: 'success', message: 'Added to cart successfully',alreadyCart,inStock,productData});
                  
       
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
}




const updateQuantity = async (req, res) => {
    try {
        const { cartQuantity, productId } = req.body;
        
        const cartData = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId').populate('userId');
        const productData = cartData.products.find((product) => {
            return product.productId.equals(productId);
        });

        productData.quantity = cartQuantity;
        productData.totalAmount = productData.productId.price * cartQuantity;
        await cartData.save();

        const cartTotal = cartData.products.reduce((total, product) => total + product.totalAmount, 0);
        console.log('Cart Total:', cartTotal);

        const productTotalPrice = productData.totalAmount;
        const inStock=productData.inStock;
        console.log('Product Total Price:', productTotalPrice);

        res.status(200).json({ status: 'success', message: 'Quantity updated successfully', cartTotal, productTotalPrice,inStock });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


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

const limitQuantity= async (req, res) => {
    try {
        
        const { productId } = req.body;
        const productData = await productSchema.findOne({ _id: productId })
        console.log(productData)
        const inStock = productData.quantity
        

      
        res.status(200).json({ status: 'success', message: 'product deleted successfully',inStock});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}
const checkout = async (req, res) => {
    try {
        const cartData = await cartSchema.findOne({ userId: req.session.user_id })
        if(cartData){

       
        const userData=req.session.user_id
        const addressData = await addressSchema.find({userId:userData}).populate('userId')
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId').populate('userId')
        const cartTotal = cartDetails.products.reduce((Total, amount) => Total + amount.totalAmount, 0);
        console.log(cartTotal)
        
        res.render('checkout',{addressData,cartDetails,cartTotal})
    }else{
        res.render('emptyCart')
    }
      
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
    updateProductDetails,
    limitQuantity
    
}