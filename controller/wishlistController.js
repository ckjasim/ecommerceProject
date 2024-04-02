

const loadWishlist = async (req,res)=>{

    try {
        
        res.render('wishlist')

    } catch (error) {
        console.log(error)
    }

}

module.exports={
    loadWishlist
}