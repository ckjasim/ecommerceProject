const express=require('express')

const adminController=require('../controller/adminController')
const categoryController=require('../controller/categoryController')
const productController=require('../controller/productController')
const orderController=require('../controller/orderController')
const couponController=require('../controller/couponController')
const walletController=require('../controller/walletController')
const offerController=require('../controller/offerController')
const salesController=require('../controller/salesController')


const adminConfig=require('../middleware/adminAuthentification')
const upload=require('../middleware/multer')


const adminRoute = express()

adminRoute.set('views','./views/admin')


adminRoute.get('/admin',adminConfig.isLogout,adminController.adminLogin)
adminRoute.post('/admin',adminController.adminloginSubmit)
adminRoute.get('/adminHome',adminConfig.isLogin,adminController.adminHome)
adminRoute.get('/users',adminConfig.isLogin,adminController.loadUsers)
adminRoute.get('/block',adminConfig.isLogin,adminController.blockUser)

adminRoute.get('/category',adminConfig.isLogin,categoryController.loadCategory)
adminRoute.post('/category',categoryController.newCategory)
adminRoute.get('/categoryBlock',adminConfig.isLogin,categoryController.blockCategory)
adminRoute.get('/editCategory',adminConfig.isLogin,categoryController.loadEditCategory)
adminRoute.post('/editCategory',categoryController.editCategory)

adminRoute.get('/products',adminConfig.isLogin,productController.loadProducts)
adminRoute.get('/newProduct',adminConfig.isLogin,productController.loadNewProducts)
adminRoute.post('/newProduct',upload.array('image'), productController.addProducts)
adminRoute.post('/unList/:id', adminConfig.isLogin, productController.unlistProduct);

adminRoute.get('/editProduct',adminConfig.isLogin,productController.loadEditProduct)
adminRoute.post('/editProduct',upload.array('image'),productController.editProduct)
adminRoute.post('/deleteProductImage',productController.deleteProductImage)

adminRoute.get('/orders',adminConfig.isLogin,orderController.loadAdminOrder)
adminRoute.get('/adminOrderDetails',adminConfig.isLogin,orderController.adminOrderDetails)
adminRoute.post('/orderStatusChange',adminConfig.isLogin,orderController.orderStatusChange)

adminRoute.post('/acceptReturn',adminConfig.isLogin,walletController.acceptReturn)




adminRoute.get('/coupons',adminConfig.isLogin,couponController.loadCoupon)
adminRoute.get('/newCoupon',adminConfig.isLogin,couponController.loadNewCoupon)
adminRoute.post('/newCoupon',adminConfig.isLogin,couponController.addCoupon)
adminRoute.get('/editCoupon',adminConfig.isLogin,couponController.loadEditCoupon)
adminRoute.post('/editCoupon',couponController.editCoupon)
adminRoute.post('/deleteCoupon',adminConfig.isLogin,couponController.deleteCoupon)


adminRoute.get('/offers',adminConfig.isLogin,offerController.loadOffer)
adminRoute.get('/addOffer',adminConfig.isLogin,offerController.loadAddOffer)
adminRoute.post('/addOffer',adminConfig.isLogin,offerController.addOffer)
adminRoute.get('/editOffer',adminConfig.isLogin,offerController.loadeditOffer)
adminRoute.post('/editOffer',adminConfig.isLogin,offerController.editOffer)
adminRoute.post('/deleteOffer',offerController.deleteOffer)


adminRoute.get('/loadSalesReport',adminConfig.isLogin,salesController.loadSalesReport)
adminRoute.post('/filterSalesReport',adminConfig.isLogin,salesController.filterSalesReport)

adminRoute.post('/filterAdminDashboard',adminConfig.isLogin,salesController.filterAdminDashboard)
adminRoute.post('/chart',adminConfig.isLogin,salesController.chart)


adminRoute.get('/ledger',adminConfig.isLogin,salesController.ledger)





adminRoute.get('/adminLogout',adminConfig.isLogin,adminController.logout)

// adminRoute.get('/deleteImage',productController.deleteImage)

module.exports=adminRoute