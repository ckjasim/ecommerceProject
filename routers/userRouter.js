const express=require('express')

const session=require('express-session')
const userController=require('../controller/userController')
const otpController=require('../controller/otpController')

const userRoute=express()
userRoute.set('views','./views/users')

const userConfig=require('../middleware/userAuthentification')
userRoute.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

userRoute.get('/',userController.loadHome)
userRoute.get('/login',userConfig.isLogout,userController.loadLogin)
userRoute.post('/login',userController.loginSubmit)

userRoute.get('/register',userConfig.isLogout,userController.loadRegister)
userRoute.post('/register',userController.submit)

userRoute.post('/otp',otpController.otp)
userRoute.post('/homePage',otpController.verifyMail)
userRoute.get('/resend',otpController.resendOtp)
userRoute.get('/userHome',userConfig.isLogin,userController.userHome)
userRoute.get('/logout',userConfig.isLogin,userController.logout)

//GOOGLE

// user_route.get('/auth/google', googleLogin.googleAuth);
// user_route.get("/auth/google/callback", googleLogin.googleCallback, googleLogin.setupSession);


//shop
userRoute.get('/loadShop',userConfig.isLogin,userController.loadShop)
userRoute.get('/loadProductDetail',userConfig.isLogin,userController.loadProductDetail)


// userRoute.get('/verify',userController.verifyMail)


module.exports=userRoute