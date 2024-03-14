const userSchema =require('../model/userData')


const adminLogin=(req,res)=>{
    const message=req.flash('message').toString()
    if(message){
        console.log(message);
    }
    res.render('login',{message})
    
}

const adminHome=(req,res)=>{
    res.render('index')
}

const loadUsers=async (req,res)=>{
    const userData=await userSchema.find({})

    res.render('users',{userData})
}

const blockUser=async (req,res)=>{
    const userDetails=await userSchema.findOne({email:req.query.email})
    console.log(userDetails.is_block)
    if(userDetails.is_block===false){
        await userSchema.updateOne({email:req.query.email},{is_block:true})
        
        
        res.redirect('/users')
    }else{
        await userSchema.updateOne({email:req.query.email},{is_block:false})
        console.log("req.query.email")
        
        res.redirect('/users')
    }
}

const adminloginSubmit = async (req,res)=>{
    try {
        const email=req.body.email
        const emailRegex=/^[A-Za-z0-9.%+-]+@gmail\.com$/;

        if(!emailRegex.test(email)){
            
            req.flash('message','Invalid email provided')
            return res.redirect('/admin')
        }
        const {EMAIL}= process.env
        
        if(EMAIL===email){
            const {PASSWORD}=process.env
            const checkPassword=req.body.password
            // const correctPassword = await bcrypt.compare(checkPassword,checkEmail.password)
            if(PASSWORD===checkPassword){

                req.session.admin_id=EMAIL
                return res.redirect('/adminHome')

            }else{
                req.flash('message','Incorrect password')
                return res.redirect('/admin')
            }
        }else{
            req.flash('message','Please check your email')
            return res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const logout = (req,res)=>{
    try {
        req.session.destroy()
        res.redirect("/admin")
        
    } catch (error) {
        console.log(error.message);
    }
    

}







module.exports={
    adminHome,
    adminLogin,
    adminloginSubmit,
    loadUsers,
    blockUser,
    logout
}