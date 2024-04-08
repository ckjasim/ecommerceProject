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

module.exports = {
  loadCoupon,
  loadNewCoupon,
  addCoupon,
};
