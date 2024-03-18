const userSchema = require('../model/userData')


const loadProfile = async (req,res)=>{
    try {
        
        const userData = await userSchema.findOne({_id:req.session.user_id})
        res.render('profile',{userData})
    } catch (error) {
        console.log(error.message);
    }
}


const editProfile=async (req,res)=>{
    try {
        const updateUser={
            fName:req.body.fName,
            lName:req.body.lName,
            email:req.body.email,
            mobile:req.body.mobile,
        }
        
        const userData = await userSchema.findByIdAndUpdate({_id:req.session.user_id},{$set:updateUser})
        
        

    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadProfile,
    editProfile
}