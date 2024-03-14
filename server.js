const express= require("express")
const path=require('path')
const app= express()
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const session = require("express-session");
const flash = require('express-flash')
const {PORT} = process.env



app.use(flash())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/user')));
app.use(express.static(path.join(__dirname,'public/admin')));
app.use(express.static(path.join(__dirname,'public/user/assets')));
app.use(express.static(path.join(__dirname,'public/admin/assets')));
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));


//MONGO CONNECT

mongoose
    .connect("mongodb://127.0.0.1:27017/ecommerceDb")
    .then(()=>{
    console.log("connected");
    })
    .catch((err)=>{
        console.log(err)
    })


//router

const userRoute=require('./routers/userRouter')
app.use('/',userRoute)

const adminRoute=require('./routers/adminRouter')
app.use('/',adminRoute)




app.listen(PORT,()=>{
    console.log(`local host running http://localhost:${PORT}`)
})