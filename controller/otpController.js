
const nodemailer=require('nodemailer')
const otpSchema = require('../model/otpData')
const userSchema = require('../model/userData')
const walletSchema = require('../model/walletData')

const otp =(req,res)=>{
    res.render('otpVerification')
}

//send mail

const sendVerifyMail = async (email)=>{
    try {
        const otpGenerator=Math.floor(1000+Math.random()*9000)   
        const newOtp = await otpSchema({
            email: email,
            otp: otpGenerator,
            createdAt: new Date(), 
            expiredAt: new Date(new Date().getTime() + 1 * 60* 1000) 
        });
        
        const result = await newOtp.save()
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'jasimjazz525@gmail.com',
                pass: 'umnu gurl eyso rrir'
            },   
        });

    const mailOptions={
        from:"jasimjazz525@gmail.com",
        to:email,
        subject:"verification mail",
        html:`Your OTP is ${otpGenerator}`
    }

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log("Your mail has been sent"+info.response)
            console.log(otpGenerator)
        }
    })

    } catch (error) {
        res.render('error')
    }
    
}


const verifyMail=async(req,res)=>{
    try {
       const otpData=await otpSchema.findOne({email:req.session.email})

        //check otp Expires
        const currentTime = new Date()
        if(currentTime>otpData.expiredAt){
            await otpSchema.deleteOne({email:req.session.email})
            return res.render('otpVerification',{message:"OTP has been expired"})
        }else{
        const otpSend=otpData.otp
        const {digit1,digit2,digit3,digit4}=req.body
        const otpNumber =`${digit1}${digit2}${digit3}${digit4}`
        console.log(parseInt(otpNumber)=== otpSend,parseInt(otpNumber), otpSend)
        if(parseInt(otpNumber)=== otpSend){
           const userEmail=req.session.email
            const userDataSave=req.session.userData
            await userSchema.create(userDataSave)
            const userDetails=await userSchema.findOne({email:userEmail})
            req.session.user_id=userDetails._id
            const userId = await userSchema.findOne({referralCode:req.session.referral})

            if (userId) {
              const wallet=  await walletSchema.findOne({userId: userId._id});
              if(wallet){
                const walletData = await walletSchema.findOneAndUpdate(
                    { userId: userId._id },
                    { 
                        $inc: { walletAmount: 501 },
                        $push: { wallets: { amount: 501, description: "Referral amount", status: "credit",date:new Date() } }
                    },
                    { new: true }
                );
            }else{
                const wallets=[]
                const newWallet={
                    amount:501,
                    description:"Referral amount",
                    status:"credit",
                    date:new Date()
                }
                wallets.push(newWallet)
                const walletData=new walletSchema({
                    walletAmount:501,
                    wallets:wallets,
                    userId:req.session.user_id
                })
                await walletData.save()
            }
                const wallets=[]
                const newWallet={
                    amount:301,
                    description:"Welcome amount",
                    status:"credit",
                    date:new Date()
                }
                wallets.push(newWallet)
                const walletData=new walletSchema({
                    walletAmount:301,
                    wallets:wallets,
                    userId:req.session.user_id
                })
                await walletData.save()
            }
            res.redirect('/userHome')
        }else{
            return res.render('otpVerification',{message:"invalid Otp"})
        }
        }
        
    } catch (error) {
        res.render('error')
    }
}
const verifyForgotOtp=async(req,res)=>{
    try {
       const otpData=await otpSchema.findOne({email:req.session.email})

        //check otp Expires
        
        const currentTime = new Date()
        if(currentTime>otpData.expiredAt){
            await otpSchema.deleteOne({email:req.query.email})
            return res.render('otpVerification',{message:"OTP has been expired"})
        }else{
         const otpSend=otpData.otp
        const {digit1,digit2,digit3,digit4}=req.body
        const otpNumber =`${digit1}${digit2}${digit3}${digit4}`
        console.log(parseInt(otpNumber)=== otpSend,parseInt(otpNumber), otpSend)
        if(parseInt(otpNumber)=== otpSend){
            res.redirect('/newPassword')
        }else{
            return res.render('otpVerification',{message:"invalid Otp"})
        }
        }
    } catch (error) {
        res.render('error')
    }
}
const resendOtp = async (req,res)=>{
    try {
       const existingOtp=await otpSchema.findOne({email:req.session.email})
      if(existingOtp){
        await otpSchema.deleteOne({email:req.session.email})
        sendVerifyMail(existingOtp.name,existingOtp.email)
        return res.render('otpVerification')
      } 
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    verifyMail,
    otp,
    sendVerifyMail,
    resendOtp,
    verifyForgotOtp
    
}
