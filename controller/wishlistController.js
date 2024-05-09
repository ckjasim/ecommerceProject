const wishlistSchema = require('../model/wishlistData')

const loadWishlist = async (req,res)=>{
    try {
        userId=req.session.user_id
        const wishlistData = await wishlistSchema.find({userId:userId}).populate('productId')
        res.render('wishlist',{wishlistData})
    } catch (error) {
        res.render('error')
    }
}

const addToWishlist = async (req,res)=>{
    try {
        userId=req.session.user_id
        if(userId){
        const{productId}=req.body
        const wishlistDetails = await wishlistSchema.find({userId:userId,productId:productId})
        if(wishlistDetails && wishlistDetails.length>0){
            await wishlistSchema.findOneAndDelete({userId:userId,productId:productId})
            res.send({status:'success',message:'removed from wishlist',wishlistDetails})    
        }else{
            const wishlistData= new wishlistSchema({
                productId:productId,
                userId:userId
            })
            wishlistData.save()
            const wishlistDetails = await wishlistSchema.find({userId:userId,productId:productId})
            res.send({status:'success',message:'added to wishlist',wishlistDetails})    
        }
    }else{   
        res.send({status:'success',message:'not logged in',session:false}) 
    }

    } catch (error) {
        res.render('error')
    }

}

const deleteWishlistProduct = async (req, res) => {
    try {
        const { productId } = req.body ;
        await wishlistSchema.findOneAndDelete({userId: req.session.user_id,productId:productId })
            res.status(200).json({ status: 'success', message: 'product deleted successfully'});
    } catch (error) {
    res.render('error')
    }
    }

module.exports={
    loadWishlist,
    addToWishlist,
    deleteWishlistProduct
}