//------------------------------admin--------------------------

const loadCoupon = async (req, res) => {
    try {

    
        res.render('coupons')
        
      
        
    } catch (error) {
        console.log(error.message);
    }
}
const loadNewCoupon = async (req, res) => {
    try {

    
        res.render('addCoupon')
        
      
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadCoupon,
    loadNewCoupon
}