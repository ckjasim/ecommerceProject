const userSchema = require('../model/userData')
const addressSchema = require('../model/addressData')


const loadProfile = async (req,res)=>{
    try {
        userId=req.session.user_id
        const addressData = await addressSchema.find({userId:userId}).populate('userId')
        const userData = await userSchema.findOne({_id:userId})
        res.render('profile',{userData,addressData})
    } catch (error) {
        console.log(error.message);
    }
}


const editProfile=async (req,res)=>{
    try {
        const updateUser={
            fName:req.body.fName,
            lName:req.body.lName,
            email:req.body.email,
            mobile:req.body.mobile,
        }
        
        const userData = await userSchema.findByIdAndUpdate({_id:req.session.user_id},{$set:updateUser})
        
        

    } catch (error) {
        console.log(error.message);
    }
}
const loadAddress=async (req,res)=>{
    try {
       res.render('address')

    } catch (error) {
        console.log(error.message);
    }
}
const addAddress=async (req,res)=>{
    try {
        console.log('fsdfsdfsfsfsfsfdsfds')
        const addressData=new addressSchema({
            name:req.body.name,
            mobile:req.body.mobile,
            pincode:req.body.pincode,
            locality:req.body.locality,
            address:req.body.address,
            city:req.body.city,
            district:req.body.district,
            state:req.body.state,
            landmark:req.body.landmark,
            userId:req.session.user_id
        })
        await addressData.save()

        res.redirect('/checkout')

    } catch (error) {
        console.log(error.message);
    }
}
const loadEditAddress=async (req,res)=>{
    try {
        const addressId=req.query._id

        const addressData= await addressSchema.findOne({_id:addressId})
        console.log(addressData);
        console.log(addressData._id)
       res.render('editAddress',{addressData})

    } catch (error) {
        console.log(error.message);
    }
}
const editAddress=async (req,res)=>{
    try {

    
        const addressId=req.body._id

        const updateAddress={
            name:req.body.name,
            mobile:req.body.mobile,
            pincode:req.body.pincode,
            locality:req.body.locality,
            address:req.body.address,
            city:req.body.city,
            district:req.body.district,
            state:req.body.state,
            landmark:req.body.landmark,
            userId:req.session.user_id
        }
        
        await addressSchema.findByIdAndUpdate({_id:addressId},{$set:updateAddress})
        res.redirect('/loadProfile')
    } catch (error) {
        console.log(error.message);
    }
}
const deleteAddress=async (req,res)=>{
    try {
        const addressId=req.query._id
        await addressSchema.findByIdAndDelete({_id:addressId})
        res.redirect('/loadProfile')
    } catch (error) {
        console.log(error.message);
    }
}
const loadOrder=async (req,res)=>{
    try {
       console.log('4444444')
    } catch (error) {
        console.log(error.message);
    }
}




module.exports={
    loadProfile,
    editProfile,
    loadAddress,
    addAddress,
    loadEditAddress,
    editAddress,
    deleteAddress,
    loadOrder
}