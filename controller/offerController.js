const categorySchema= require('../model/categoryData')
const productSchema= require('../model/productData')
const offerSchema= require('../model/offerData')

const mongoose = require('mongoose');

const loadOffer = async (req, res) => {
    try {
        
    const offerData = await offerSchema.find()
  
    res.render('offers',{offerData})

    } catch (error) {
        console.log(error.message);
    }
}
const loadAddOffer = async (req, res) => {
    try {
        const categoryData = await categorySchema.find()
        const productData = await productSchema.find()

    res.render('addOffer',{categoryData,productData})

    } catch (error) {
        console.log(error.message);
    }
}
const addOffer = async (req, res) => {
    try {
const {name,description,date,percentage,offerType,offerTypeName}=req.body
console.log(name)
console.log(description) 
console.log(percentage) 
console.log(date)
console.log(offerType)
console.log(offerTypeName)

// if(offerTypeName==='Product'){
//        const offerApply=offerType
// }else if(offerTypeName==='Category'){
//     const offerApply=offerType
// }
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
    // const offerProductId = new mongoose.Types.ObjectId(offerType);
    await productSchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
    console.log('eeeeeeeee')
}
if(offerTypeName === 'Category'){
    const offerData= await offerSchema.findOne({category:offerType})
    await categorySchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
    console.log('ddddddddddddddddddd')
}

 res.redirect('/addOffer')

    } catch (error) {
        console.log(error.message);
    }
}

const loadeditOffer=async (req,res)=>{
    try {
        const categoryData = await categorySchema.find()
        
        const offerData = await offerSchema.findOne({_id:req.query._id})
        const productData = await productSchema.find()
        
       
       return res.render('editOffer',{offerData,categoryData,productData})
       
    } catch (error) {
        console.log(error.message)
    }
  }


  const editOffer=async (req,res)=>{
    try {
        
      const {name,description,date,percentage,offerType,offerTypeName,couponId}=req.body
console.log(name)
console.log(description) 
console.log(percentage) 
console.log(date)
console.log(offerType)
console.log(offerTypeName)
console.log(couponId)





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
    // const offerProductId = new mongoose.Types.ObjectId(offerType);
    await productSchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
    console.log('eeeeeeeee')
}
if(offerTypeName === 'Category'){
    const offerData= await offerSchema.findOne({category:offerType})
    await categorySchema.findByIdAndUpdate({_id:offerType},{offerId:offerData._id})
    console.log('ddddddddddddddddddd')
}

 res.redirect('/offers')
  
    } catch (error) {
        console.log(error.message)
    }
  }
  
  const deleteOffer=async (req,res)=>{
    try {
        
        const {offerId} =req.body
     console.log('fdfdfddd')
     console.log(offerId)
  
      const couponData= await offerSchema.findOneAndDelete({_id:offerId})
  
      res.send({message:"deleted"})
  
    } catch (error) {
        console.log(error.message)
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