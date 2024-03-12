const productSchema =require('../model/productData')
const categorySchema = require('../model/categoryData')

const loadProducts =async (req,res)=>{
    try {
        res.render('products')
    } catch (error) {
        console.log(error.message)
    }
}

const loadNewProducts=async (req,res)=>{
    try {
        const categoryData = await categorySchema.find()
        res.render('addProduct',{categoryData})
    } catch (error) {
        console.log(error.message);
    }
}
const addProducts=async (req,res)=>{
    try {
        

        const productData=await productSchema({
            name:req.body.name,
            price:req.body.price,
            quantity:req.body.quantity,
            color:req.body.color,
            size:req.body.size,
            material:req.body.material,
            categoryId:req.body.category,
            createdAt:new Date(),
            productStatus:true,

        })

        await productData.save()
       


    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadProducts,
    loadNewProducts,
    addProducts
}