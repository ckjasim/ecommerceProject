
const nodemailer=require('nodemailer')
const otpSchema = require('../model/otpData')
const userSchema = require('../model/userData')



const otp =(req,res)=>{
    res.render('otpVerification')
}

//send mail

 


 

const sendVerifyMail = async (name,email)=>{
    try {
       
        const otpGenerator=Math.floor(1000+Math.random()*9000)   

        const newOtp = await otpSchema({
            email: email,
            otp: otpGenerator,
            createdAt: new Date(), // Set the current date
            expiredAt: new Date(new Date().getTime() + 1 * 60* 1000) // Set the expiry time
        });
        
        const result = await newOtp.save()
        console.log(result)

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'jasimjazz525@gmail.com',
                pass: 'umnu gurl eyso rrir'
            },
            
        });

    

    const mailOptions={
        from:"jasimjazz525@gmail.com",
        to:email,
        subject:"verification mail",
        html:`Your OTP is ${otpGenerator}`
    }

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log("Your mail has been sent"+info.response)
            console.log(otpGenerator)
        }
    })

    } catch (error) {
        console.log(error.message)
    }
    
}


const verifyMail=async(req,res)=>{
    try {
        
        
        
       const otpData=await otpSchema.findOne({email:req.session.email})
      console.log(req.session.email)
        console.log(otpData)
        console.log("67");
        //check otp Expires
        
        const currentTime = new Date()
        console.log(currentTime)
        if(currentTime>otpData.expiredAt){
          
            await otpSchema.deleteOne({email:req.session.email})
           
      
            return res.render('otpVerification',{message:"OTP has been expired"})
            
        }else{

        const otpSend=otpData.otp
        console.log(req.body)
        const {digit1,digit2,digit3,digit4}=req.body
        const otpNumber =`${digit1}${digit2}${digit3}${digit4}`
        console.log(parseInt(otpNumber)=== otpSend,parseInt(otpNumber), otpSend)
        if(parseInt(otpNumber)=== otpSend){
           const userEmail=req.session.email
        //    req.session.email=null
            // req.session.destroy((err) => {
            //     if (err) {
            //         console.error('Error destroying session:', err);
            //         res.status(500).send('Internal Server Error');
            //     } else {
            //         res.redirect('/register');
            //     }
            // });
            
            const userDataSave=req.session.userData
            
            // const result = await userDataSave.save()
            await userSchema.create(userDataSave)
            const userDetails=await userSchema.findOne({email:userEmail})
            req.session.user_id=userDetails._id
            console.log(req.session)
            console.log('123455')
            res.redirect('/userHome')
        }else{
            return res.render('otpVerification',{message:"invalid Otp"})
        }
        }
        
        


        // const updateInfo=await userSchema.updateOne({_id:req.query.id},{$set:{is_verified:1}})
        
    } catch (error) {
        console.log(error.message)
    }
}

const resendOtp = async (req,res)=>{
    try {
        console.log(req.session.email)
       const existingOtp=await otpSchema.findOne({email:req.session.email})
      
       console.log("fdffsasdasdasdasdsdf")
      if(existingOtp){

        await otpSchema.deleteOne({email:req.session.email})
        sendVerifyMail(existingOtp.name,existingOtp.email)
        
        console.log("fdffsdf")
        return res.render('otpVerification')
      } 
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
    verifyMail,
    otp,
    sendVerifyMail,
    resendOtp
    
}
