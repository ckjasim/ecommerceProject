const orderSchema = require('../model/orderData')



const loadSalesReport = async (req, res) => {
  try {
     const orderData= await orderSchema.find().populate('userId')

  res.render('salesReport',{orderData})

  } catch (error) {
      console.log(error.message);
  }
}

module.exports={
  loadSalesReport
}