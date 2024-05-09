
const isLogin =async (req,res,next)=>{
 try {
    if (!req.session.admin_id) {
        res.redirect('/admin')
    }
    next();
 } catch (error) {
    console.log(error.message);
 }
}

const isLogout=async (req,res,next)=>{
    try {
        if (req.session.admin_id) {
            res.redirect('/adminHome')
        } 
            next()
        
    } catch (error) {
        res.render('error')
    }
}

module.exports={
    isLogin,
    isLogout
}