const userSchema = require('../model/userData')
// const otpSchema = require('../model/otpData')
const bcrypt=require('bcrypt')

const nodemailer=require('nodemailer')
const otpController=require('../controller/otpController')


const loadHome=(req,res)=>{
    res.render('index')
}

const loadLogin=(req,res)=>{
    const message=req.flash('message').toString()
    if(message){
        console.log(message);
    }
    res.render('login',{message})
}

const loadRegister =(req,res)=>{
    const message = req.flash('message').toString()
    if(message){
        console.log( message)
    }
    res.render('register',{message})
}

const userHome=(req,res)=>{
    res.render('index')
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
        console.log(error.message)
    }
}




//register save

//hashPassword
const securePassword= async(password) =>{
    try{
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash;
    }catch (error){
        console.log(error.message);
    }
}

const submit = async (req,res)=>{
    try {
       
    const checkEmail=  await userSchema.findOne({email:req.body.email})
    console.log(req.body)
    if (checkEmail) {
        console.log('123');
        // res.render('register', { message: "Email already exists" });
        req.flash('message','Email already exists')
            return res.redirect('/register')
        
    }else{
        const sPassword = await securePassword(req.body.password)
        console.log(req.body.fName)
        const name = req.body.fName.trim();
        
        if(!name||!/^[a-zA-Z][a-zA-Z\s]*$/.test(name)){
            // return res.render('register',{message:"invalid name provided"})
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
            // return res.render('register',{message:'Invalid mobile number'})
            req.flash('message','Invalid mobile number')
            return res.redirect('/register')
        }

        if (req.body.password !== req.body.confirmPassword) {
            // return res.render('register', { message: 'Please check your password' });
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
        console.log("1")
        console.log(req.session.email)
        if(newUser){
            console.log("2");
            otpController.sendVerifyMail(req.body.name,req.session.email)

            res.render('otpVerification',{messsage:'Please check your email and Verify your OTP'})
            
        }
        else{
            // res.render('register',{message:"Login has failed"})
            req.flash('message','Login has failed')
            return res.redirect('/register')
            
        }
    }

    

    } catch (error) {
        console.log(error.message)  
    }
}

//shop

const loadShop=(req,res)=>{
    res.render('shop')
}

const logout = (req,res)=>{
    req.session.destroy()
    
    res.redirect("/")

}


module.exports={
    
    loadHome,
    loadLogin,
    loginSubmit,
    loadRegister,
    submit,
    userHome,
    logout,
    loadShop

}