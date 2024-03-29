const express=require('express')

const adminController=require('../controller/adminController')
const categoryController=require('../controller/categoryController')
const productController=require('../controller/productController')
const orderController=require('../controller/orderController')
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
adminRoute.get('/unList',adminConfig.isLogin, productController.unlistProduct)
adminRoute.get('/editProduct',adminConfig.isLogin,productController.loadEditProduct)
adminRoute.post('/editProduct',upload.array('image'),productController.editProduct)
adminRoute.post('/deleteProductImage',productController.deleteProductImage)

adminRoute.get('/orders',adminConfig.isLogin,orderController.loadAdminOrder)
adminRoute.get('/adminOrderDetails',adminConfig.isLogin,orderController.adminOrderDetails)






adminRoute.get('/adminLogout',adminConfig.isLogin,adminController.logout)

// adminRoute.get('/deleteImage',productController.deleteImage)

module.exports=adminRoute