
const isLogin =async (req,res,next)=>{
 try {
    if (!req.session.user_id) {
        res.render('notLogin')
    }else{
            next();
    }
 } catch (error) {
    res.render('error')
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
        res.render('error')
    }
}

module.exports={
    isLogin,
    isLogout
}