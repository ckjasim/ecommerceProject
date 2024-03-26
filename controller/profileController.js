const userSchema = require('../model/userData')
const orderSchema = require('../model/orderData') 
const addressSchema = require('../model/addressData')
const cartSchema = require('../model/cartData') 


const loadProfile = async (req,res)=>{
    try {
        userId=req.session.user_id
        const addressData = await addressSchema.find({userId:userId}).populate('userId')
        const userData = await userSchema.findOne({_id:userId})
        const orderDetails = await orderSchema.findOne({ userId: req.session.user_id })
        .populate('cartId')
        .populate('userId')
        .populate({
            path: 'cartId',
            populate: {
                path: 'products.productId'
            }
        })
        .populate('addressId');
        res.render('profile',{userData,addressData,orderDetails})
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
        const message=req.flash('message').toString()
    if(message){
        console.log(message);
    }
       res.render('address',{message})

    } catch (error) {
        console.log(error.message);
    }
}
const addAddress=async (req,res)=>{
    try {


        const name = req.body.name.trim();
        
        if(!name||!/^[a-zA-Z][a-zA-Z\s]*$/.test(name)){
            req.flash('message','Invalid name provided')
            return res.redirect('/loadAddress')
        }

        const mobile = req.body.mobile
        const mobileRegex=/^\d{10}$/;

        if(!mobileRegex.test(mobile)){
            req.flash('message','Invalid mobile number')
            return res.redirect('/loadAddress')
        }
        const pincode = req.body.pincode
        const pincodeRegex=/^\d{6}$/;

        if(!pincodeRegex.test(pincode)){
            req.flash('message','Invalid pincode number')
            return res.redirect('/loadAddress')
        }

        const locality = req.body.locality.trim();
        
        if(!locality||!/^[a-zA-Z][a-zA-Z\s]*$/.test(locality)){
            req.flash('message','Invalid locality provided')
            return res.redirect('/loadAddress')
        }
        const address = req.body.address.trim();
        
        if(!address||!/^[a-zA-Z][a-zA-Z\s]*$/.test(address)){
            req.flash('message','Invalid address provided')
           
        }
        const city = req.body.city.trim();
        
        if(!city||!/^[a-zA-Z][a-zA-Z\s]*$/.test(city)){
            req.flash('message','Invalid city provided')
            return res.redirect('/loadAddress')
        }
        const district = req.body.district.trim();
        
        if(!district||!/^[a-zA-Z][a-zA-Z\s]*$/.test(district)){
            req.flash('message','Invalid district provided')
            return res.redirect('/loadAddress')
        }
        const landmark = req.body.landmark.trim();
        
        if(!landmark||!/^[a-zA-Z][a-zA-Z\s]*$/.test(landmark)){
            req.flash('message','Invalid landmark provided')
            return res.redirect('/loadAddress')
        }


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
        const message=req.flash('message').toString()
    if(message){
        console.log(message);
    }
        const addressId=req.query._id

        const addressData= await addressSchema.findOne({_id:addressId})
        console.log(addressData);
        console.log(addressData._id)
       res.render('editAddress',{addressData,message})

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
        res.redirect('/checkout')
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
const deleteCheckoutAddress=async (req,res)=>{
    try {
        const addressId=req.query._id
        await addressSchema.findByIdAndDelete({_id:addressId})
        res.redirect('/checkout')
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
    
    deleteCheckoutAddress
}