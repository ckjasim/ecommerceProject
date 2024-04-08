const wishlistSchema = require('../model/wishlistData')

const loadWishlist = async (req,res)=>{

    try {
        
        res.render('wishlist')

    } catch (error) {
        console.log(error)
    }

}
const addToWishlist = async (req,res)=>{

    try {

        userId=req.session.user_id
        if(userId){

        
        const{productId}=req.body
        console.log(productId)
        const wishlistDetails = await wishlistSchema.find({userId:userId,productId:productId})
        if(wishlistDetails && wishlistDetails.length>0){
            await wishlistSchema.findOneAndDelete({userId:userId,productId:productId})
            res.send({status:'success',message:'removed from wishlist',wishlistDetails})    

        }else{

            console.log('ssssiiiiiii')
           
    
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
        console.log(error)
    }

}

module.exports={
    loadWishlist,
    addToWishlist
}