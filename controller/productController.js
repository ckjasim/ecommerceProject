const productSchema =require('../model/productData')
const categorySchema = require('../model/categoryData')

const loadProducts =async (req,res)=>{
    try {
        const productData= await productSchema.find().populate('categoryId')
        res.render('products',{productData})
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
        
        console.log(req.files)
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
            img:req.files.map(file=>file.filename)

        })

        await productData.save()
       


    } catch (error) {
        console.log(error.message);
    }
}

const unlistProduct =async (req,res)=>{
    try {
        const productData=await productSchema.findOne({name:req.query.name})
        console.log(req.query.name)
        console.log(productData.is_listed)
    
        if(productData.is_listed===true){
            await productSchema.updateOne({name:req.query.name},{is_listed:false})
            
            
            res.redirect('/products')
        }else{
            await productSchema.updateOne({name:req.query.name},{is_listed:true})
            
            
            res.redirect('/products')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadEditProduct=async (req,res)=>{
    try {
        const categoryData = await categorySchema.find()
        
        const productData = await productSchema.findOne({_id:req.query._id})
        console.log(productData)
       
       return res.render('editProduct',{productData,categoryData})
       
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadProducts,
    loadNewProducts,
    addProducts,
    unlistProduct,
    loadEditProduct

}