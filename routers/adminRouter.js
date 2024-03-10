const express=require('express')

const adminController=require('../controller/adminController')

const adminRoute = express()

adminRoute.set('views','./views/admin')

adminRoute.get('/admin',adminController.adminLogin)
adminRoute.post('/admin',adminController.adminloginSubmit)
adminRoute.get('/adminHome',adminController.adminHome)
adminRoute.get('/users',adminController.loadUsers)


module.exports=adminRoute