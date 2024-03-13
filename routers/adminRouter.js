const express=require('express')

const adminController=require('../controller/adminController')
const categoryController=require('../controller/categoryController')
const productController=require('../controller/productController')


const upload=require('../middleware/multer')


const adminRoute = express()

adminRoute.set('views','./views/admin')



adminRoute.get('/admin',adminController.adminLogin)
adminRoute.post('/admin',adminController.adminloginSubmit)
adminRoute.get('/adminHome',adminController.adminHome)
adminRoute.get('/users',adminController.loadUsers)
adminRoute.get('/block',adminController.blockUser)

adminRoute.get('/category',categoryController.loadCategory)
adminRoute.post('/category',categoryController.newCategory)
adminRoute.get('/categoryBlock',categoryController.blockCategory)
adminRoute.get('/editCategory',categoryController.loadEditCategory)
adminRoute.post('/editCategory',categoryController.editCategory)

adminRoute.get('/products',productController.loadProducts)
adminRoute.get('/newProduct',productController.loadNewProducts)
adminRoute.post('/newProduct',upload.array('image'),productController.cropImage, productController.addProducts)
adminRoute.get('/unList', productController.unlistProduct)
adminRoute.get('/editProduct',productController.loadEditProduct)
adminRoute.post('/editProduct',upload.array('image'),productController.editProduct)
// adminRoute.get('/deleteImage',productController.deleteImage)

module.exports=adminRoute