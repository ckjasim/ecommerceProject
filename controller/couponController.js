const couponSchema = require("../model/couponData");

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

    const { name, description, percentage, minAmount, date } = req.body;
    console.log("kkk111");
    console.log(name)
    console.log(description)
    let couponExists = true;
    let couponCode;
    
    while (couponExists) {
        const randomCode = Math.floor(Math.random() * 90000) + 10000;
        couponCode = name + randomCode;
    
        const regex = new RegExp("^" + couponCode + "$", "i");
        const result = await couponSchema.findOne({ code: regex });
    
        if (!result) {
            couponExists = false;
        }
    }
    
    const couponData = new couponSchema({
        code: couponCode.toUpperCase(),
        name: name,
        description: description,
        percentage: percentage,
        minAmount: minAmount,
        expiredAt: date,
        status:true
    });
    
    await couponData.save();
    res.redirect('/newCoupon');

  } catch (error) {
    console.log(error.message);
  }
};

const loadEditCoupon=async (req,res)=>{
  try {
      
      
      const couponData = await couponSchema.findOne({_id:req.query._id})
      
     
     return res.render('editCoupon',{couponData})
     
  } catch (error) {
      console.log(error.message)
  }
}


const editCoupon =async (req,res)=>{
  try {
      console.log('dffsd');
      console.log(req.body.id)
      const { code, name, description, percentage, minAmount, date } = req.body;

      let couponExists = true;
      let updatedCode = code.toUpperCase();
      
      while (couponExists) {
          const regex = new RegExp("^" + updatedCode + "$", "i");
          const result = await couponSchema.findOne({ code: regex });
      
          if (result) {
              const randomCode = Math.floor(Math.random() * 90000) + 10000;
              updatedCode = name + randomCode;
          } else {
              couponExists = false;
          }
      }
      
      const updateCoupon = {
          code: updatedCode,
          name: name,
          description: description,
          percentage: percentage,
          minAmount: minAmount,
          expiredAt: date,
          status:true
      };
      
      await couponSchema.findByIdAndUpdate({ _id: req.body.id }, { $set: updateCoupon });
      res.redirect('/coupons');
      
      
  } catch (error) {
      console.log(error.message)
  }
}

const deleteCoupon=async (req,res)=>{
  try {
      
      const {couponId} =req.body
   console.log('fdfdfddd')
   console.log(couponId)

    const couponData= await couponSchema.findOneAndDelete({_id:couponId})

    res.send({message:"deleted"})

  } catch (error) {
      console.log(error.message)
  }
}

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
  couponValidate,
  editCoupon,
  loadEditCoupon,
  deleteCoupon
};
