const productSchema =require('../model/productData')
const categorySchema = require('../model/categoryData')
const cartSchema = require('../model/cartData')
const offerSchema = require('../model/offerData')
const path=require('path')
const mongoose = require('mongoose');

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
        // if(!req.body.description||!/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.description)){
        //     req.flash('message','Invalid description provided')
        //     return res.redirect('/newProduct')
        // }
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
            img:req.files.map(file=>file.filename),
            

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
        
        const productData = await productSchema.findOne({_id:req.query._id}).populate('categoryId')
        
       
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
        // const newImg=req.files.map(file=>file.filename)
        if(req.files && req.files.length >0){
        //     let currentImage=[]
        //     const previousImage=await productSchema.findOne({_id:req.body.id})
        //     if(previousImage.img && previousImage.img.length>0){
        //         console.log('1111')
        //         for(let i=0;i<4;i++){
        //             if(previousImage.img[i]!==req.body.pic[i]){
        //                 console.log('222233')
        //                 newImg.forEach(element => {
        //                     if(element.split('-')[1]==req.body.pic[i].split('-')[1]){
        //                         currentImage[i]=element
        //                     }
        //                 });
        //             }else{
        //                 console.log('3333')
        //                 currentImage[i]=previousImage.img[i]
        //             }
        //         }
        //     }
        //     console.log(currentImage)
        //     updateProduct.img=currentImage
            updateProduct.img=req.files.map(file=>file.filename)
        }
        await productSchema.findByIdAndUpdate({_id:req.body.id},{$set:updateProduct})
        res.redirect('/products')
        
    } catch (error) {
        console.log(error.message)
    }
}

const deleteProductImage = async (req, res) => {
    try {
        console.log('111111111111111')
        const{img}=req.body
        console.log(img)
         
      
        res.status(200).json({ status: 'success', message: 'product deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}





//---------------------------------------user-------------------


const loadUserProduct = async (req, res) => {
    try {
        const productData = await productSchema.find().populate('categoryId');
        const categoryData = await categorySchema.find();
        const offerData = await offerSchema.find();

        console.log('Offer Data:', offerData);

        const offerProducts = offerData.map(offer => {
        const offerProductId = new mongoose.Types.ObjectId(offer.product);
        return productData.find(product => product._id.equals(offerProductId));
        }).filter(product => product !== undefined);


        const offerCategories = offerData.map(offer => {
            const offerCategoryId = new mongoose.Types.ObjectId(offer.category);
            return categoryData.find(category => category._id.equals(offerCategoryId));
        }).filter(category => category !== undefined);
        

        console.log('Offer Products:', offerProducts);
        console.log('Offer Categories:', offerCategories);

        res.render('products', { productData, offerProducts, offerCategories, offerData });

    } catch (error) {
        console.log(error.message);
    }
}



const loadUserProductDetail=async (req,res)=>{
    try {
        const productId=req.params.productId
        const productData= await productSchema.findOne({_id:productId}).populate('categoryId')
        const relatedProducts= await productSchema.find().populate('categoryId')
        const userId=req.session.user_id
        const alreadyCart = await cartSchema.findOne({ "products.productId": productId ,userId:userId});
        res.render('productDetail',{productData,alreadyCart,relatedProducts})
    } catch (error) {
        console.log(error.message)
    }
    

}

//sort

const sort =async (req,res)=>{
    try {
       const selectedValue=req.body.selectedValue

        console.log(selectedValue)
        let sort
        switch (selectedValue) {
            case "Price low to high":
                
             sort = await productSchema.find().sort({ 'price': 1 });

            res.send({ status: 'success', message: 'sorted successfully', sort});
            
                break;
            case "Price high to low":
                 sort = await productSchema.find().sort({ 'price': -1 });
                res.send({ status: 'success', message: 'sorted successfully', sort});
                break;
            case "a to z":
                sort = await productSchema.find().collation({ locale: 'en', strength: 1 }).sort({ 'name': 1 });
                res.send({ status: 'success', message: 'sorted successfully', sort});
                break;
            case "z to a":
                sort = await productSchema.find().collation({ locale: 'en', strength: 1 }).sort({ 'name': -1 });
                res.send({ status: 'success', message: 'sorted successfully', sort});
                break;
            default:
                
                break;
        }
        

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
    deleteProductImage,
    sort,
    loadUserProduct,
    loadUserProductDetail
    // deleteImage

}