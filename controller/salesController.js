const orderSchema = require('../model/orderData')



const loadSalesReport = async (req, res) => {
  try {
     const orderData= await orderSchema.find().populate('userId')

  res.render('salesReport',{orderData})

  } catch (error) {
      console.log(error.message);
  }
}
const filterSalesReport = async (req, res) => {
  try {
    const selectedValue=req.body.selectedValue

     console.log(selectedValue)
     
    let query
    let filter
     
     switch (selectedValue) {
         case "Daily":
          const currentDate = new Date();
         const yesterdayDate = new Date(currentDate);
         yesterdayDate.setDate(yesterdayDate.getDate() - 1);
         
        query = {
             orderedAt: {
                 $gte: yesterdayDate,
                 $lte: currentDate
             }
         };
         
          filter = await orderSchema.find(query).populate('userId');
         

         res.send({ status: 'success', message: 'sorted successfully', filter});
         
             break;
         case "Weekly":
          const currentDate1 = new Date();
          const lastWeekDate = new Date(currentDate1);
          lastWeekDate.setDate(lastWeekDate.getDate() - 7);
          
          query = {
              orderedAt: {
                  $gte: lastWeekDate,
                  $lte: currentDate1
              }
          };
          
           filter = await orderSchema.find(query).populate('userId');
          
             res.send({ status: 'success', message: 'sorted successfully', filter});
             break;
         case "Monthly":
          const currentDate2 = new Date();
          const firstDayOfMonth = new Date(currentDate2.getFullYear(), currentDate2.getMonth(), 1);
          const lastDayOfMonth = new Date(currentDate2.getFullYear(), currentDate2.getMonth() + 1, 0);
          
           query = {
              orderedAt: {
                  $gte: firstDayOfMonth,
                  $lte: lastDayOfMonth
              }
          };
          
           filter = await orderSchema.find(query).populate('userId');
          
             res.send({ status: 'success', message: 'sorted successfully', filter});
             break;
         case "Yearly":
          const currentDate3 = new Date();
          const firstDayOfYear = new Date(currentDate3.getFullYear(), 0, 1); 
          const lastDayOfYear = new Date(currentDate3.getFullYear() + 1, 0, 0); 
          
           query = {
              orderedAt: {
                  $gte: firstDayOfYear,
                  $lte: lastDayOfYear
              }
          };
          
          filter = await orderSchema.find(query).populate('userId');
          
             res.send({ status: 'success', message: 'sorted successfully', filter});
             break;
         case "Custom":
             sort = await productSchema.find().collation({ locale: 'en', strength: 1 }).sort({ 'name': -1 });
             res.send({ status: 'success', message: 'sorted successfully', sort});
             break;
         default:
             
             break;
     }
     

 } catch (error) {
     console.log(error.message)
 }
}

module.exports={
  loadSalesReport,
  filterSalesReport
}