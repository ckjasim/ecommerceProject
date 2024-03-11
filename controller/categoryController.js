const categorySchema =require('../model/categoryData')

const loadCategory =async (req,res)=>{
    console.log("edleridfjrjk")
    const categoryData = await categorySchema.find()
   
  res.render('category',{categoryData})
}

const newCategory =async (req,res)=>{
    try {
    
        const categoryData =await categorySchema({
            name:req.body.name,
            description:req.body.description,
            is_block:false
        })
        await categoryData.save()
    
        return res.redirect('/category')
        
    } catch (error) {
        console.log(error.message);
    }
}

const blockCategory=async (req,res)=>{
    const userDetails=await categorySchema.findOne({name:req.query.name})
    console.log(req.query.name)
    console.log(userDetails.is_block)

    if(userDetails.is_block===false){
        await categorySchema.updateOne({name:req.query.name},{is_block:true})
        
        
        res.redirect('/category')
    }else{
        await categorySchema.updateOne({name:req.query.name},{is_block:false})
        
        
        res.redirect('/category')
    }
}

const editCategory=async (req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message);
    }
}





module.exports={
    loadCategory,
    newCategory,
    blockCategory
}