const express= require("express")
const path=require('path')
const app= express()
const mongoose = require('mongoose')
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/assets')));
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




const port=3000

app.listen(port,()=>{
    console.log("local host running http://localhost:3000")
})