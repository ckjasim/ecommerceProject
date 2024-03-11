const express=require('express')

const adminController=require('../controller/adminController')
const categoryController=require('../controller/categoryController')

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

module.exports=adminRoute