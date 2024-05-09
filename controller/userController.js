const userSchema = require('../model/userData')
const productSchema =require('../model/productData')
const categorySchema = require('../model/categoryData')
const cartSchema = require('../model/cartData')
const offerSchema = require('../model/offerData')

const mongoose = require('mongoose');

const bcrypt=require('bcrypt')

const nodemailer=require('nodemailer')
const otpController=require('../controller/otpController')


const loadHome=async (req,res)=>{

    const productData = await productSchema.find().populate('categoryId').limit(3);
        const categoryData = await categorySchema.find();
        const offerData = await offerSchema.find();
        const offerProducts = offerData.map(offer => {
        const offerProductId = new mongoose.Types.ObjectId(offer.product);
        return productData.find(product => product._id.equals(offerProductId));
        }).filter(product => product !== undefined);

        const offerCategories = offerData.map(offer => {
            const offerCategoryId = new mongoose.Types.ObjectId(offer.category);
            return categoryData.find(category => category._id.equals(offerCategoryId));
        }).filter(category => category !== undefined);

        res.render('index', { productData, offerProducts, offerCategories, offerData });

}

const loadLogin=(req,res)=>{
    const message=req.flash('message').toString()
    res.render('login',{message})
}

const loadRegister =(req,res)=>{
    const message = req.flash('message').toString()
    res.render('register',{message})
}

const userHome=async(req,res)=>{
    const productData = await productSchema.find().populate('categoryId').limit(3);
    const categoryData = await categorySchema.find();
    const offerData = await offerSchema.find();
    const offerProducts = offerData.map(offer => {
    const offerProductId = new mongoose.Types.ObjectId(offer.product);
    return productData.find(product => product._id.equals(offerProductId));
    }).filter(product => product !== undefined);

    const offerCategories = offerData.map(offer => {
        const offerCategoryId = new mongoose.Types.ObjectId(offer.category);
        return categoryData.find(category => category._id.equals(offerCategoryId));
    }).filter(category => category !== undefined);
    
    res.render('index', { productData, offerProducts, offerCategories, offerData });
}

//Login verification

const loginSubmit = async (req,res)=>{
    try {
        const email=req.body.email
        const emailRegex=/^[A-Za-z0-9.%+-]+@gmail\.com$/;

        if(!emailRegex.test(email)){
            req.flash('message','Invalid email provided')
            return res.redirect('/login')
        }
        const checkEmail=  await userSchema.findOne({email:req.body.email})

        if(checkEmail.is_block===true){
            req.flash('message','Entry restricted')
            return res.redirect('/login')
        }
        
        if(checkEmail){
            const checkPassword=req.body.password
            const correctPassword = await bcrypt.compare(checkPassword,checkEmail.password)
            if(correctPassword){
                req.session.user_id=checkEmail._id
                return res.redirect('/userHome')
            }else{
                req.flash('message','Incorrect password')
                return res.redirect('/login')
            }
        }else{
            req.flash('message','Please check your email')
            return res.redirect('/login')
        }
    } catch (error) {
        res.render('error')
    }
}

//forgotPassword

const loadForgotPassword=(req,res)=>{
    const message=req.flash('message').toString()
    res.render('forgotPassword',{message})
}

const forgotPassword = async (req,res)=>{
    try { 
    const checkEmail=  await userSchema.findOne({email:req.body.email}) 
    const email=req.body.email
    const emailRegex=/^[A-Za-z0-9.%+-]+@gmail\.com$/;

        if(!emailRegex.test(email)){
            req.flash('message','Invalid email provided')
            return res.redirect('/loadForgotPassword')
        }
    if (checkEmail) {
        req.session.email=email
        otpController.sendVerifyMail(email)
        res.render('forgotOtp',{messsage:'Please check your email and Verify your OTP',email})
    }else{
        console.log('123');
        req.flash('message','Email doesnt exists, please register')
            return res.redirect('/loadForgotPassword') 
    }
    } catch (error) {
        res.render('error')
    }
}

const newPassword=(req,res)=>{
    const message=req.flash('message').toString()
    res.render('newPassword',{message})
}

const newPasswordSubmit = async (req,res)=>{
    try {
        const sPassword = await securePassword(req.body.password) 
        await userSchema.findOneAndUpdate({email:req.session.email},{$set:{password:sPassword}})
        res.redirect('/login')
    } catch (error) {
        res.render('error')
    }
}

//register save

//hashPassword
const securePassword= async(password) =>{
    try{
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash;
    }catch (error){
        res.render('error')
    }
}

const submit = async (req,res)=>{
    try {    
    const checkEmail=  await userSchema.findOne({email:req.body.email})
    if (checkEmail) {
        req.flash('message','Email already exists')
            return res.redirect('/register')
        
    }else{
        const sPassword = await securePassword(req.body.password)
        const name = req.body.fName.trim();
        
        if(!name||!/^[a-zA-Z][a-zA-Z\s]*$/.test(name)){
            req.flash('message','Invalid name provided')
            return res.redirect('/register')
        }

        const email=req.body.email
        const emailRegex=/^[A-Za-z0-9.%+-]+@gmail\.com$/;

        if(!emailRegex.test(email)){
            req.flash('message','Invalid email provided')
            return res.redirect('/register')
        }

        const mobile = req.body.mobile
        const mobileRegex=/^\d{10}$/;

        if(!mobileRegex.test(mobile)){
            req.flash('message','Invalid mobile number')
            return res.redirect('/register')
        }

        if (req.body.password !== req.body.confirmPassword) {
            req.flash('message','Please check your password')
            return res.redirect('/register')
        }
        
        const newUser=await userSchema({
            fName:req.body.fName,
            lName:req.body.lName,
            email:req.body.email,
            mobile:req.body.mobile,
            password:sPassword,
            createDate:new Date(),
            is_block:false,
            isAdmin:0
        })
        req.session.userData=newUser
        req.session.email=newUser.email
        req.session.referral=req.query.ref
        
        console.log("1")
        console.log(req.session.email)
        if(newUser){
            console.log("2");
            otpController.sendVerifyMail(req.session.email)
            res.render('otpVerification',{messsage:'Please check your email and Verify your OTP'})
        }
        else{
            req.flash('message','Login has failed')
            return res.redirect('/register')
            
        }
    }
    } catch (error) {
        console.log(error.message)  
    }
}

//shop

const loadShop=async (req,res)=>{
    try {
        const productData= await productSchema.find().populate('categoryId')
        res.render('shop',{productData})
    } catch (error) {
        res.render('error')
    }
 
}

const notLogin = (req,res)=>{
    try {
        res.render('notLogin')
        
    } catch (error) {
        res.render('error')
    }
}
const logout = (req,res)=>{
    try {
        req.session.destroy()
        res.redirect("/")
        
    } catch (error) {
        res.render('error')
    }
}

module.exports={
    
    loadHome,
    loadLogin,
    loginSubmit,
    loadRegister,
    submit,
    userHome,
    logout,
    loadShop,
    notLogin,
    forgotPassword,
    loadForgotPassword,
    newPassword,
    newPasswordSubmit


}