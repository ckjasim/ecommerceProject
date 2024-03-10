


const adminLogin=(req,res)=>{
    const message=req.flash('message').toString()
    if(message){
        console.log(message);
    }
    res.render('login')
}

const adminHome=(req,res)=>{
    res.render('index')
}

const loadUsers=(req,res)=>{
    res.render('users')
}

const adminloginSubmit = async (req,res)=>{
    try {
        const email=req.body.email
        const emailRegex=/^[A-Za-z0-9.%+-]+@gmail\.com$/;

        if(!emailRegex.test(email)){
            req.flash('message','Invalid email provided')
            return res.redirect('/login')
        }
        const {EMAIL}= process.env
        
        if(EMAIL){
            const {PASSWORD}=process.env
            const checkPassword=req.body.password
            // const correctPassword = await bcrypt.compare(checkPassword,checkEmail.password)
            if(PASSWORD===checkPassword){
                return res.redirect('/adminHome')
            }else{
                req.flash('message','Incorrect password')
                return res.redirect('/login')
            }
        }else{
            req.flash('message','Please check your email')
            return res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}







module.exports={
    adminHome,
    adminLogin,
    adminloginSubmit,
    loadUsers
}