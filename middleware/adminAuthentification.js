
const isLogin =async (req,res,next)=>{
 try {
    if (!req.session.admin_id) {
        res.redirect('/admin')
        console.log('fsdsdfdfsf')
            
    }
    next();
     

 } catch (error) {
    console.log(error.message);
 }
}

const isLogout=async (req,res,next)=>{
    try {

        if (req.session.admin_id) {
            console.log('sdfwesdfffafeffrf')
            res.redirect('/adminHome')
        } 
            next()
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    isLogin,
    isLogout
}