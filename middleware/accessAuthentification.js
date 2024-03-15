// const userSchema = require('../model/userData')
// const accessUser= async (req,res,next)=>{
// try {
    
//         const userData=await userSchema.findById({_id:req.session.user_id})
//         if(userData.is_block===true){
//             req.session.user_id=null;
//             res.redirect('/login',{message:'Access restricted'})
//         }else{
//             next()
//         }
//     }
    
//  catch (error) {
//     console.log(error.message);
// }
// }

// module.exports= accessUser

