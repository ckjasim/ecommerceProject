const userSchema = require('../model/userData')
// const otpSchema = require('../model/otpData')
const bcrypt=require('bcrypt')

const nodemailer=require('nodemailer')
const otpController=require('../controller/otpController')


const loadHome=(req,res)=>{
    res.render('index')
}

const loadLogin=(req,res)=>{
    res.render('login')
}

const loadRegister =(req,res)=>{
    res.render('register')
}

const userHome=(req,res)=>{
    res.render('index')
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

    if(checkEmail){
        console.log("sfsdfsdfsd")
        res.render('register',{message:"Email already exists"})
        
    }else{
        
        const sPassword = await securePassword(req.body.password)
        const newUser=await userSchema.create({
            fName:req.body.fName,
            lName:req.body.lName,
            email:req.body.email,
            mobile:req.body.mobile,
            password:sPassword,
            confirmPassword:req.body.confirmPassword,
            isAdmin:0
        })
        req.session.email=newUser.email
        console.log("1")
        console.log(req.session.email)
        if(newUser){
            console.log("2");
            otpController.sendVerifyMail(req.body.name,req.session.email)
            res.render('otpVerification')
        }
        else{
            res.render('register',"Login has failed")
        }
    }

    

    } catch (error) {
        console.log(error.message)  
    }
}

const logout = (req,res)=>{
    req.session.destroy()
    
    res.redirect("/")

}

module.exports={
    
    loadHome,
    loadLogin,
    loadRegister,
    submit,
    userHome,
    logout

}