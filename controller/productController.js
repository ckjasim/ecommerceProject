const productSchema =require('../model/productData')
const categorySchema = require('../model/categoryData')
const cartSchema = require('../model/cartData')
const offerSchema = require('../model/offerData')
const wishlistSchema = require('../model/wishlistData')
const path=require('path')
const mongoose = require('mongoose');

const loadProducts =async (req,res)=>{
    try {
        const productData= await productSchema.find().populate('categoryId')
        res.render('products',{productData})
    } catch (error) {
        res.render('error')
    }
}

const loadNewProducts=async (req,res)=>{
    try {
        const message = req.flash('message').toString()
        const categoryData = await categorySchema.find()
      res.render('addProduct',{categoryData,message})
        
    } catch (error) {
        res.render('error')
    }
}
const addProducts=async (req,res)=>{
    try {
        if(!req.body.name||!/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.name)){
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
        res.render('error')
    }
}

const unlistProduct =async (req,res)=>{
    try {
        const {productId}=req.query
        const productData=await productSchema.findOne({_id:productId})
        productData.is_listed=!productData.is_listed
        await productData.save()
    } catch (error) {
        res.render('error')
    }
}

const loadEditProduct=async (req,res)=>{
    try {
        const categoryData = await categorySchema.find() 
        const productData = await productSchema.findOne({_id:req.query._id}).populate('categoryId')
       return res.render('editProduct',{productData,categoryData})
    } catch (error) {
        res.render('error')
    }
}

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
        res.render('error')
    }
}

const deleteProductImage = async (req, res) => {
    try {
        const{img}=req.body
        res.status(200).json({ status: 'success', message: 'product deleted successfully'});
    } catch (error) {
        res.render('error')
    }
}

//---------------------------------------user-------------------

const loadUserProduct = async (req, res) => {
    try {
        const productData = await productSchema.find().populate('categoryId');
        const categoryData = await categorySchema.find();
        const offerData = await offerSchema.find();
        const wishlistData = await wishlistSchema.find()
        const offerProducts = offerData.map(offer => {
        const offerProductId = new mongoose.Types.ObjectId(offer.product);
        return productData.find(product => product._id.equals(offerProductId));
        }).filter(product => product !== undefined);
        const offerCategories = offerData.map(offer => {
            const offerCategoryId = new mongoose.Types.ObjectId(offer.category);
            return categoryData.find(category => category._id.equals(offerCategoryId));
        }).filter(category => category !== undefined);
    
        res.render('products', { productData, offerProducts, offerCategories, offerData, wishlistData });

    } catch (error) {
        res.render('error')
    }
}

const loadUserProductDetail=async (req,res)=>{
    try {
        const productId=req.params.productId
        const productData= await productSchema.findOne({_id:productId}).populate('categoryId')
        const userId=req.session.user_id
        const alreadyCart = await cartSchema.findOne({ "products.productId": productId ,userId:userId});
        const alreadyWishlist = await wishlistSchema.findOne({ productId: productId ,userId:userId});
        const offerData = await offerSchema.find();
        const offerProduct = offerData.find((offer) => {
        const offerProductId = new mongoose.Types.ObjectId(offer.product);
            return offerProductId.equals(productId);
        });
        const offerCategory = offerData.find((offer) => {
            const offerCategoryId = new mongoose.Types.ObjectId(offer.category);
            return offerCategoryId.equals(productData.categoryId._id);
        });
        const categoryId=productData.categoryId._id
        console.log(categoryId)

        //related Products

        const relatedProductData = await productSchema.find().populate('categoryId');
        const categoryData = await categorySchema.find();
        const wishlistData = await wishlistSchema.find()
        const relatedOfferProducts = offerData.map(offer => {
            const offerProductId = new mongoose.Types.ObjectId(offer.product);
            return relatedProductData.find(product => product._id.equals(offerProductId));
            }).filter(product => product !== undefined);
            const relatedOfferCategories = offerData.map(offer => {
                const offerCategoryId = new mongoose.Types.ObjectId(offer.category);
                return categoryData.find(category => category._id.equals(offerCategoryId));
            }).filter(category => category !== undefined);
        const relatedProducts=await productSchema.find({categoryId:categoryId}).populate('categoryId')

        res.render('productDetail',{productData,alreadyCart,relatedProducts,offerProduct,offerCategory,alreadyWishlist,relatedOfferProducts,relatedOfferCategories,wishlistData,offerData})
    } catch (error) {
        res.render('error')
    }
    
}

//sort

const sort =async (req,res)=>{
    try {
             const productData = await productSchema.find().populate('categoryId');
             const categoryData = await categorySchema.find();
             const offerData = await offerSchema.find();
             const wishlistData = await wishlistSchema.find()
             const offerProducts = offerData.map(offer => {
             const offerProductId = new mongoose.Types.ObjectId(offer.product);
             return productData.find(product => product._id.equals(offerProductId));
             }).filter(product => product !== undefined);

             const offerCategories = offerData.map(offer => {
                 const offerCategoryId = new mongoose.Types.ObjectId(offer.category);
                 return categoryData.find(category => category._id.equals(offerCategoryId));
             }).filter(category => category !== undefined);

       const selectedValue=req.body.selectedValue
        let sort
        switch (selectedValue) {
            case "Price low to high":
             sort = await productSchema.find().sort({ 'price': 1 }).populate('categoryId');
            res.send({ status: 'success', message: 'sorted successfully', sort,offerProducts,offerCategories,wishlistData});
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
        res.render('error')
    }
}

const searchProduct = async (req, res) => {
    try {
        if (req.body.searchValue) {
            const searchValue = req.body.searchValue.trim();
            const content = new RegExp(searchValue, 'i'); 
            const productData = await productSchema.find({
                $and: [
                    {
                        $or: [
                            { name: { $regex: content } },
                            { description: { $regex: content } }
                        ]
                    },
                    { is_listed: true }
                ]
            }).populate('categoryId');
            res.send({ status: 'success', message: 'sorted successfully', productData });
        }
    } catch (error) {
        res.render('error')
    }
};

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
    loadUserProductDetail,
    searchProduct
}