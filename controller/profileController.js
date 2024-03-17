const userSchema = require('../model/userData')


const loadProfile = async (req,res)=>{
    try {
        
        const userData = await userSchema.findOne({_id:req.session.user_id})
        res.render('profile',{userData})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadProfile
}