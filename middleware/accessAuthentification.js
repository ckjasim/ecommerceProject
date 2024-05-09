const userSchema = require('../model/userData')

const accessUser= async (req,res,next)=>{
try {
        const userData=await userSchema.findById({_id:req.session.user_id})
        if(userData.is_block===true){
            req.session.user_id=null;
            req.flash('message','Entry restricted')
            return res.redirect('/login')
        }else{
            next()
        }
    }
 catch (error) {
    res.render('error')
}
}

module.exports= accessUser

