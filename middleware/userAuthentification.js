
const isLogin =async (req,res,next)=>{
 try {
    if (!req.session.user_id) {
        res.render('notLogin')
    }else{
            next();
    }
 } catch (error) {
    console.log(error.message);
 }
}

const isLogout=async (req,res,next)=>{
    try {
        if (req.session.user_id) {
            res.redirect('/userHome')
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    isLogin,
    isLogout
}