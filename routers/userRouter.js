const express=require('express')
const userRoute=express()
const session=require('express-session')

userRoute.set('views','./views/users')

const userConfig=require('../middleware/userAuthentification')
// const acessConfig=require('../middleware/accessAuthentification')

const userController=require('../controller/userController')
const otpController=require('../controller/otpController')
const cartController=require('../controller/cartController')
const profileController=require('../controller/profileController')

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
userRoute.get('/notLogin',userController.notLogin)

//GOOGLE

// user_route.get('/auth/google', googleLogin.googleAuth);
// user_route.get("/auth/google/callback", googleLogin.googleCallback, googleLogin.setupSession);

// userRoute.get('/verify',userController.verifyMail)

//product

userRoute.get('/loadProduct',userController.loadProduct)
userRoute.get('/loadProductDetail/:productId',userController.loadProductDetail)


//shop
userRoute.get('/loadShop',userController.loadShop)

//cart

// userRoute.get('/loadCart',cartController.loadCart)
userRoute.post('/loadCart',cartController.loadCart)
userRoute.get('/viewCart',cartController.viewCart)
userRoute.post('/updateQuantity',cartController.updateQuantity)
userRoute.post('/deleteCartProduct',cartController.deleteCartProduct)
userRoute.get('/checkout',cartController.checkout)
userRoute.post('/checkout',profileController.loadOrder)
userRoute.get('/loadOrder',profileController.viewOrder)
userRoute.get('/orderDetails',profileController.orderDetails)
userRoute.get('/cancelOrder',profileController.cancelOrder)


//profile

userRoute.get('/loadProfile',userConfig.isLogin,profileController.loadProfile)
userRoute.post('/loadProfile',userConfig.isLogin,profileController.editProfile)
userRoute.get('/loadAddress',profileController.loadAddress)
userRoute.post('/loadAddress',profileController.addAddress)
userRoute.get('/loadEditAddress',userConfig.isLogin,profileController.loadEditAddress)
userRoute.post('/loadEditAddress',profileController.editAddress)
userRoute.get('/deleteAddress',profileController.deleteAddress)


userRoute.post('/placeOrder',cartController.placeOrder)






module.exports=userRoute