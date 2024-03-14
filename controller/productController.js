const productSchema =require('../model/productData')
const categorySchema = require('../model/categoryData')
const path=require('path')

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
        const message = req.flash('message').toString()
        const categoryData = await categorySchema.find()

        if(message){
            console.log( message)
        }
      res.render('addProduct',{categoryData,message})
        
    } catch (error) {
        console.log(error.message);
    }
}
const addProducts=async (req,res)=>{
    try {
        if(!req.body.name||!/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.name)){
            // return res.render('register',{message:"invalid name provided"})
            req.flash('message','Invalid name provided')
            return res.redirect('/newProduct')
        }
        if(!req.body.price||!/^\d+$/.test(req.body.price)){
            req.flash('message','Invalid Quantity provided , Please enter a number')
            return res.redirect('/newProduct')
        }
        if(!req.body.quantity||!/^\d+$/.test(req.body.quantity)){
            req.flash('message','Invalid Quantity provided , Please enter a number')
            return res.redirect('/newProduct')
        }
        if(!req.body.color||!/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.color)){
            req.flash('message','Invalid color provided')
            return res.redirect('/newProduct')
        }
        if(!req.body.size||!/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.size)){
            req.flash('message','Invalid size provided')
            return res.redirect('/newProduct')
        }
        if(!req.body.material||!/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.material)){
            req.flash('message','Invalid material provided')
            return res.redirect('/newProduct')
        }
        if(!req.body.description||!/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.description)){
            req.flash('message','Invalid description provided')
            return res.redirect('/newProduct')
        }
        console.log(req.files)

        //image validation
        // if (!req.file) {
        //     req.flash('message', 'No image uploaded');
        //     return res.redirect('/newProduct');
        // }

        //only image validation

    //     const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    //     const extname = path.extname(req.file.originalname).toLowerCase();
    //     if (!allowedExtensions.includes(extname)) {
    //     req.flash('message', 'Only JPG, JPEG, PNG, and GIF files are allowed');
    //     return res.redirect('/newProduct');
    // }

        const regex = new RegExp("^" + req.body.name + "$", "i");
        const result = await productSchema.find({ name: regex });
        
        if(result.length>0){
            req.flash('message','product already exists')
            return res.redirect('/newProduct')
        }else{
           
        const productData=await productSchema({
            name:req.body.name,
            price:req.body.price,
            quantity:req.body.quantity,
            color:req.body.color,
            size:req.body.size,
            material:req.body.material,
            categoryId:req.body.category,
            description:req.body.description,
            createdAt:new Date(),
            productStatus:true,
            img:req.files.map(file=>file.filename)

        })

        await productData.save()

        return res.redirect('/newProduct')
       
    }

    } catch (error) {
        console.log(error.message);
    }
}

const unlistProduct =async (req,res)=>{
    try {
        console.log('dsddss');
        const {productId}=req.query
        console.log(productId);
        const productData=await productSchema.findOne({_id:productId})
        console.log(productData);
        productData.is_listed=!productData.is_listed

        await productData.save()
        // console.log(req.query.name)
        // console.log(productData.is_listed)
    
        // if(productData.is_listed===true){
        //     await productSchema.updateOne({name:req.query.name},{is_listed:false})
            
            
        //     res.redirect('/products')
        // }else{
        //     await productSchema.updateOne({name:req.query.name},{is_listed:true})
            
            
        //     res.redirect('/products')
        // }
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

// const cropImage =async (req,res)=>{
//     (req, res, next) => {
//         // Access the uploaded file in req.file.buffer
//         const imageBuffer = req.file.buffer;
    
//         // Define crop coordinates and size
//         const cropOptions = {
//             left: 10,
//             top: 10,
//             width: 200,
//             height: 200
//         };
    
//         // Use Sharp to crop the image
//         sharp(imageBuffer)
//             .extract(cropOptions)
//             .toBuffer()
//             .then(croppedImageBuffer => {
//                 // Send the cropped image as a response or save it to a file
//                 res.type('image/jpeg').send(croppedImageBuffer);
//             })
//             .catch(err => {
//                 console.error('Error cropping image:', err);
//                 res.status(500).send('Error cropping image');
//             });
//     }
    
// }

const editProduct =async (req,res)=>{
    try {
        console.log('dffsd');
        console.log(req.body.id)

        const updateProduct={
            name:req.body.name,
            price:req.body.price,
            quantity:req.body.quantity,
            color:req.body.color,
            size:req.body.size,
            material:req.body.material,
            categoryId:req.body.category,
            description:req.body.description,
        }
        
        if(req.files && req.files.length >0){
            
            updateProduct.img=req.files.map(file=>file.filename)
        }
        await productSchema.findByIdAndUpdate({_id:req.body.id},{$set:updateProduct})
        res.redirect('/products')
        
    } catch (error) {
        console.log(error.message)
    }
}
module.exports={
    loadProducts,
    loadNewProducts,
    addProducts,
    unlistProduct,
    loadEditProduct,
    
    editProduct,
    // deleteImage

}