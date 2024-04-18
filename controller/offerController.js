const categorySchema= require('../model/categoryData')
const productSchema= require('../model/productData')

const loadOffer = async (req, res) => {
    try {
        
    
  
    res.render('offers')

    } catch (error) {
        console.log(error.message);
    }
}
const addOffer = async (req, res) => {
    try {

        const categoryData = await categorySchema.find()
        const productData = await productSchema.find()

    res.render('addOffer',{categoryData,productData})

    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    loadOffer,
    addOffer
}