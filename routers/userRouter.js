const express=require('express')
const userController=require('../controller/userController')
const otpController=require('../controller/otpController')

const userRoute=express()
userRoute.set('views','./views/users')

userRoute.get('/',userController.loadHome)
userRoute.get('/login',userController.loadLogin)

userRoute.get('/register',userController.loadRegister)
userRoute.post('/register',userController.submit)

userRoute.post('/otp',otpController.otp)
userRoute.post('/homePage',otpController.verifyMail)
userRoute.get('/resend',otpController.resendOtp)
userRoute.post('/userHome',userController.userHome)
userRoute.get('/logout',userController.logout)


// userRoute.get('/verify',userController.verifyMail)


module.exports=userRoute