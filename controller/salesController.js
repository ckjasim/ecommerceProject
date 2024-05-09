const orderSchema = require('../model/orderData')



const loadSalesReport = async (req, res) => {
  try {
    const orderData = await orderSchema.find({
        'products.orderStatus': 'Delivered'
    }).populate('userId');
     res.render('salesReport',{orderData})

  } catch (error) {
    res.render('error')
  }
}
const filterSalesReport = async (req, res) => {
  try {
    const {selectedValue,startDateValue,endDateValue}=req.body
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
            
             query = {
                orderedAt: {
                    $gte: startDateValue,
                    $lte: endDateValue
                }
            };
            
             filter = await orderSchema.find(query).populate('userId');
            
               res.send({ status: 'success', message: 'sorted successfully', filter});
             break;

     }
     
 } catch (error) {
    res.render('error')
 }
}
const filterAdminDashboard = async (req, res) => {
  try {
    const {selectedValue}=req.body
    let query
    let filter
     
     switch (selectedValue) {
         case "Best selling products":
            const orderData = await orderSchema.aggregate([
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "products"
                    }
                },
                { $unwind: "$products" },
                { 
                    $group: {
                        _id: "$products.name",
                        count: { $sum: 1 } 
                    }
                },
                {
                    $sort: {
                        count: -1 
                    }
                },
                { $limit: 10 }
            ]);
            res.send({ status: 'success', message: 'sorted successfully', orderData});
             break;
         case "Best selling categories":
            const orderDataByCategory = await orderSchema.aggregate([
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "products"
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "products.categoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $group: {
                        _id: "$category.name",
                        count: { $sum: 1 } 
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                },
            ]);
            res.send({ status: 'success', message: 'sorted successfully', orderDataByCategory});
             break;
         default:
             
             break;
     }
     
 } catch (error) {
    res.render('error')
 }
}

const chart = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; 
        const monthlyPipeline = [
            {
                $match: {
                    orderedAt: {
                        $gte: new Date(currentYear, 0, 1), 
                        $lte: new Date(currentYear, currentMonth, 0) 
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$orderedAt" } },
                    count: { $sum: 1 }
                }
            }
        ];
        
        const yearlyPipeline = [
            {
                $group: {
                    _id: { year: { $year: "$orderedAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1 } 
            },
            {
                $limit: 12 
            }
        ];

        const monthlyResults = await orderSchema.aggregate(monthlyPipeline);
        const yearlyResults = await orderSchema.aggregate(yearlyPipeline);

        const monthlyCount = Array(12).fill(0);
        const month = Array.from({ length: 12 }, (_, i) => i + 1);
        const yearlyCount = Array(12).fill(0);
        const year = Array.from({ length: 12 }, (_, i) => currentYear - i); 

        monthlyResults.forEach(result => {
            const monthIndex = result._id.month - 1;
            monthlyCount[monthIndex] = result.count;
        });

   
        yearlyResults.forEach(result => {
            const yearIndex = currentYear - result._id.year; 
            yearlyCount[yearIndex] = result.count;
        });

        res.send({ 
            status: 'success', 
            message: 'charted', 
            monthlyCount, 
            month, 
            yearlyCount, 
            year
        });
              
   } catch (error) {
    res.render('error')
   }
}

const ledger = async (req, res) => {
    try {
       const orderData= await orderSchema.find().populate('userId')
  
    res.render('ledger',{orderData})
  
    } catch (error) {
        res.render('error')
    }
  }


module.exports={
  loadSalesReport,
  filterSalesReport,
  filterAdminDashboard,
  chart,
  ledger
}