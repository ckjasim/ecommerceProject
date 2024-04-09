const couponSchema = require("../model/couponData");
const { response } = require("../routers/userRouter");

//------------------------------admin--------------------------

const loadCoupon = async (req, res) => {
  try {

const couponData=await couponSchema.find()

    res.render("coupons",{couponData});
  } catch (error) {
    console.log(error.message);
  }
};


const loadNewCoupon = async (req, res) => {
  try {
    res.render("addCoupon");
  } catch (error) {
    console.log(error.message);
  }
};
const addCoupon = async (req, res) => {
  try {
    const { code, name, description, percentage, minAmount, date } = req.body;
    console.log("kkk111");
    console.log(code)
    console.log(name)
    console.log(description)
    const couponData = new couponSchema({
      code: code.toUpperCase(),
      name: name,
      description: description,
      percentage: percentage,
      minAmount: minAmount,
      expiredAt: date,
     
    });
    await couponData.save();
res.redirect('/newCoupon')

  } catch (error) {
    console.log(error.message);
  }
};

//--------------------------user----------------------------


const couponValidate = async (req, res) => {
  try {
    const {couponCode,subTotal}=req.body
    console.log(couponCode)
    console.log(subTotal)

    const couponData= await couponSchema.findOne({code:couponCode.toUpperCase()})

    console.log(couponData)
    if(couponData){
      console.log('jjj')
      const currentTime = new Date()
      console.log(currentTime)
      console.log(couponData.expiredAt)
      if(currentTime>couponData.expiredAt){
        console.log("coupon expire")
        res.send({status:'failed',message:"Coupon Expired"})
      }else{
         if(subTotal>couponData.minAmount){
  
           console.log('coupon valid')
          const couponDiscount= (subTotal*couponData.percentage)/100
          console.log(couponDiscount)
          const cartTotal=subTotal-couponDiscount
          console.log(cartTotal)
          
          res.send({status:'success',message:'Coupon applied successfully',couponDiscount,cartTotal})

         }else{
           console.log('amount not sufficient')
           res.send({status:'failed',message:`Please purchase a minimum of ${couponData.minAmount}`})
         } 
      }

    }else{
      console.log('invalid coupon code')
      res.send({status:'failed',message:'invalid coupon code'})

    }



  } catch (error) {
    console.log(error.message);
  }
};




module.exports = {
  loadCoupon,
  loadNewCoupon,
  addCoupon,
  couponValidate
};
