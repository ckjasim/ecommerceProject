const userSchema = require('../model/userData')
const orderSchema = require('../model/orderData') 
const addressSchema = require('../model/addressData')
const cartSchema = require('../model/cartData') 
const couponSchema = require('../model/couponData') 
const walletSchema = require('../model/walletData') 
const bcrypt=require('bcrypt')


const loadProfile = async (req,res)=>{
    try {
        userId=req.session.user_id
        const addressData = await addressSchema.find({userId:userId}).populate('userId')
        const userData = await userSchema.findOne({_id:userId})
        const couponData = await couponSchema.find()
        const walletData = await walletSchema.findOne({ userId: req.session.user_id })
        const orderDetails = await orderSchema.find({ userId: req.session.user_id })
        .populate('products')
        .populate('products.productId')
        .populate('userId')
        .populate('addressId');
        res.render('profile',{userData,addressData,orderDetails,couponData,walletData})
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
        
        await userSchema.findByIdAndUpdate({_id:req.session.user_id},{$set:updateUser})
        res.redirect('/loadProfile')

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
//hashPassword
const securePassword= async(password) =>{
    try{
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash;
    }catch (error){
        console.log(error.message);
    }
}

const changePassword=async (req,res)=>{
    try {

        const userData=await userSchema.findOne({_id:req.session.user_id})

        const currentPassword=req.body.currentPassword
        console.log(userData.password)
        const correctPassword = await bcrypt.compare(currentPassword,userData.password)

        if(correctPassword){
            const sPassword = await securePassword(req.body.password)
            await userSchema.findOneAndUpdate({_id:req.session.user_id},{$set:{password:sPassword}})
            return res.redirect('/loadProfile')
        }else{

            req.flash('message','Incorrect password')
            return res.redirect('/loadProfile')
        }

    } catch (error) {
        console.log(error.message);
    }
}


const generateReferral = async (req, res) => {
    try {

        const userData = await userSchema.findOne({_id:req.session.user_id})
        if(userData.referralCode){
            const referralCode = userData.referralCode 
            const baseUrl = 'https://prindecor.shop/register';
            const referralLink = baseUrl + '?ref=' + referralCode;

            res.json({referralLink});
        }else{

            console.log('22222222222222222222222222');
            const userId = req.session.user_id;
    
            const baseUrl = 'https://prindecor.shop/register';
            const referralCode = generateReferralCode(userId);
            const referralLink = baseUrl + '?ref=' + referralCode;
    
            const userData = await userSchema.updateOne(
                { _id: req.session.user_id }, 
                { $set: { referralCode: referralCode } }, 
                { upsert: true } 
            );
            console.log(referralLink);
            res.json({ referralLink });
        }
    } catch (error) {
        console.error('Error generating referral link:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function generateReferralCode(userId) {
    return userId + '_' + Math.random().toString(36).substring(2, 8);
}




module.exports={
    loadProfile,
    editProfile,
    loadAddress,
    addAddress,
    loadEditAddress,
    editAddress,
    deleteAddress,
    deleteCheckoutAddress,
    changePassword,
    generateReferral
}