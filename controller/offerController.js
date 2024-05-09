const categorySchema= require('../model/categoryData')
const productSchema= require('../model/productData')
const offerSchema= require('../model/offerData')
const mongoose = require('mongoose');

const loadOffer = async (req, res) => {
    try {     
    const offerData = await offerSchema.find()
    res.render('offers',{offerData})
    } catch (error) {
        res.render('error')
    }
}
const loadAddOffer = async (req, res) => {
    try {
        const categoryData = await categorySchema.find()
        const productData = await productSchema.find()
        res.render('addOffer',{categoryData,productData})

    } catch (error) {
        res.render('error')
    }
}
const addOffer = async (req, res) => {
    try {
const {name,description,date,percentage,offerType,offerTypeName}=req.body
const offerDetails = await offerSchema.findOne({
    $or: [
      { product: offerType },
      { category: offerType }
    ]
  });

if(offerDetails){
    await offerSchema.findByIdAndUpdate({_id:offerDetails._id},
    {
        name: name,
        description: description,
        percentage: percentage,
        expiredAt: date,
        offerType:offerTypeName,
        product: offerTypeName === 'Product' ? offerType : undefined,
        category: offerTypeName === 'Category' ? offerType : undefined
    })
}else {
    const offerData = new offerSchema({
        name: name,
        description: description,
        percentage: percentage,
        expiredAt: date,
        offerType:offerTypeName,
        product: offerTypeName === 'Product' ? offerType : undefined,
        category: offerTypeName === 'Category' ? offerType : undefined
    });
     await offerData.save()
}

        if(offerTypeName === 'Product'){
            const offerData= await offerSchema.findOne({product:offerType})
            await productSchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
        }
        if(offerTypeName === 'Category'){
            const offerData= await offerSchema.findOne({category:offerType})
            await categorySchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
        }
        res.redirect('/addOffer')
    } catch (error) {
        res.render('error')
    }
}

const loadeditOffer=async (req,res)=>{
    try {
        const categoryData = await categorySchema.find()
        const offerData = await offerSchema.findOne({_id:req.query._id})
        const productData = await productSchema.find()
        return res.render('editOffer',{offerData,categoryData,productData})
    } catch (error) {
        res.render('error')
    }
  }
  const editOffer=async (req,res)=>{
    try {
        const {name,description,date,percentage,offerType,offerTypeName,couponId}=req.body
        await offerSchema.findByIdAndUpdate({_id:couponId},
        {
            name: name,
            description: description,
            percentage: percentage,
            expiredAt: date,
            offerType:offerTypeName,
            product: offerTypeName === 'Product' ? offerType : undefined,
            category: offerTypeName === 'Category' ? offerType : undefined
        })

            if(offerTypeName === 'Product'){
                const offerData= await offerSchema.findOne({product:offerType})
                await productSchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
            }
            if(offerTypeName === 'Category'){
                const offerData= await offerSchema.findOne({category:offerType})
                await categorySchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
            }
            res.redirect('/offers')
            
                } catch (error) {
                    console.log(error.message)
                }
            }
  
  const deleteOffer=async (req,res)=>{
    try {
        const {offerId} =req.body
      const couponData= await offerSchema.findOneAndDelete({_id:offerId})
      res.send({message:"deleted"})
  
    } catch (error) {
        res.render('error')
    }
  }
  
module.exports={
    loadOffer,
    loadAddOffer,
    addOffer,
    editOffer,
    deleteOffer,
    loadeditOffer
}