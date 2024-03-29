const categorySchema =require('../model/categoryData')

const loadCategory =async (req,res)=>{
    
    const message = req.flash('message').toString()
    const categoryData = await categorySchema.find()
    if(message){
        console.log( message)
    }
  res.render('category',{categoryData,message})
}


const newCategory = async (req, res) => {
    try {
        if (!req.body.name || !/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.name)) {
            req.flash('message', 'Invalid name provided');
            return res.redirect('/category');
        }
        if (!req.body.description || !/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.description)) {
            req.flash('message', 'Invalid description provided');
            return res.redirect('/category');
        }

        const regex = new RegExp("^" + req.body.name + "$", "i");
        const result = await categorySchema.find({ name: regex });
        console.log(result);
        
        if (result.length > 0) {
            req.flash('message', 'Category already exists');
            return res.redirect('/category');
        } else {
            const categoryData = await categorySchema({
                name: req.body.name,
                description: req.body.description,
                is_block: false
            });
            await categoryData.save();
            return res.redirect('/category');
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Internal Server Error');
    }
};


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

const loadEditCategory=async (req,res)=>{
    try {
    const message = req.flash('message').toString();
    if(message){
        console.log( message)
    }
        const categoryData=await categorySchema.findOne({_id:req.query._id})
        
        return res.render('editCategory',{categoryData,message})
      
    } catch (error) {
        console.log(error.message);
    }
}

const editCategory=async (req,res)=>{
    try {
        if (!req.body.name || !/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.name)) {
            req.flash('message', 'Invalid name provided');
            return res.redirect('/category');
        }
        if (!req.body.description || !/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.description)) {
            req.flash('message', 'Invalid description provided');
            return res.redirect('/category');
        }

        const regex = new RegExp("^" + req.body.name + "$", "i");
        const result = await categorySchema.find({ name: regex });
        console.log(result);
        
        if (result.length > 0) {
            req.flash('message', 'Category already exists');
            return res.redirect('/editCategory');
        } else {
        console.log(req.body.id)
        await categorySchema.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,description:req.body.description}})
        res.redirect('/category')
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send('Internal Server Error');
    }
}






module.exports={
    loadCategory,
    newCategory,
    blockCategory,
    loadEditCategory,
    editCategory
}