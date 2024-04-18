const categorySchema= require('../model/categoryData')
const productSchema= require('../model/productData')
const offerSchema= require('../model/offerData')

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

 res.redirect('/addOffer')

    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    loadOffer,
    loadAddOffer,
    addOffer
}