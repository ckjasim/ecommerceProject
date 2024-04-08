    const express=require('express')
const userRoute=express()
const session=require('express-session')

userRoute.set('views','./views/users')

const userConfig=require('../middleware/userAuthentification')
const accessUser=require('../middleware/accessAuthentification')
const googleLogin = require('../passport')

const userController=require('../controller/userController')
const otpController=require('../controller/otpController')
const cartController=require('../controller/cartController')
const profileController=require('../controller/profileController')
const orderController=require('../controller/orderController')
const productController=require('../controller/productController')
const wishlistController=require('../controller/wishlistController')

userRoute.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

userRoute.get('/',userController.loadHome)
userRoute.get('/login',userConfig.isLogout,userController.loadLogin)
userRoute.post('/login',userController.loginSubmit)

userRoute.get('/loadForgotPassword',userController.loadForgotPassword)
userRoute.post('/loadForgotPassword',userController.forgotPassword)
userRoute.post('/verifyForgotOtp', otpController.verifyForgotOtp)
userRoute.get('/newPassword', userController.newPassword)
userRoute.post('/newPassword', userController.newPasswordSubmit)

userRoute.get('/register',userConfig.isLogout,userController.loadRegister)
userRoute.post('/register',userController.submit)

userRoute.post('/otp',otpController.otp)
userRoute.post('/homePage', otpController.verifyMail)
userRoute.get('/resend',otpController.resendOtp)
userRoute.get('/userHome',userConfig.isLogin,accessUser,userController.userHome)
userRoute.get('/logout',userConfig.isLogin,userController.logout)
userRoute.get('/notLogin',userController.notLogin)

//GOOGLE

userRoute.get('/auth/google', googleLogin.googleAuth);
userRoute.get("/auth/google/callback", googleLogin.googleCallback, googleLogin.setupSession);

// userRoute.get('/verify',userController.verifyMail)

//product




//shop
userRoute.get('/loadShop',userController.loadShop)

//cart

// userRoute.get('/loadCart',cartController.loadCart)
userRoute.get('/viewCart',userConfig.isLogin,accessUser,cartController.viewCart)
userRoute.post('/loadCart',cartController.loadCart)
userRoute.post('/limitQuantity',cartController.limitQuantity)
userRoute.post('/updateProductDetails',cartController.updateProductDetails)
userRoute.post('/updateQuantity',cartController.updateQuantity)
userRoute.post('/deleteCartProduct',cartController.deleteCartProduct)
userRoute.get('/checkout',userConfig.isLogin,accessUser,cartController.checkout)
userRoute.post('/checkout',orderController.loadOrder)
userRoute.get('/viewOrder',userConfig.isLogin,accessUser,orderController.viewOrder)
userRoute.get('/orderDetails',userConfig.isLogin,accessUser,orderController.orderDetails)
userRoute.post('/cancelOrder',userConfig.isLogin,accessUser,orderController.cancelOrder)


//profile

userRoute.get('/loadProfile',userConfig.isLogin,accessUser,profileController.loadProfile)
userRoute.post('/loadProfile',userConfig.isLogin,profileController.editProfile)
userRoute.get('/loadAddress',userConfig.isLogin,accessUser,profileController.loadAddress)
userRoute.post('/loadAddress',profileController.addAddress)
userRoute.get('/loadEditAddress',userConfig.isLogin,accessUser,profileController.loadEditAddress)
userRoute.post('/loadEditAddress',profileController.editAddress)
userRoute.get('/deleteAddress',userConfig.isLogin,accessUser,profileController.deleteAddress)
userRoute.get('/deleteCheckoutAddress',userConfig.isLogin,accessUser,profileController.deleteCheckoutAddress)
userRoute.post('/changePassword',userConfig.isLogin,accessUser,profileController.changePassword)


userRoute.get('/loadProduct',productController.loadUserProduct)
userRoute.get('/loadProductDetail/:productId',productController.loadUserProductDetail)
userRoute.post('/sort',productController.sort)


userRoute.get('/loadWishlist',wishlistController.loadWishlist)
userRoute.post('/addToWishlist',wishlistController.addToWishlist)













module.exports=userRoute