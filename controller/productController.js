const productSchema =require('../model/productData')
const categorySchema = require('../model/categoryData')

const loadProducts =async (req,res)=>{
    try {
        const productData= await productSchema.find().populate('categoryId')
        res.render('products',{productData})
    } catch (error) {
        console.log(error.message)
    }
}

const loadNewProducts=async (req,res)=>{
    try {
        const categoryData = await categorySchema.find()
        res.render('addProduct',{categoryData})
    } catch (error) {
        console.log(error.message);
    }
}
const addProducts=async (req,res)=>{
    try {
        
        console.log(req.files)
        const productData=await productSchema({
            name:req.body.name,
            price:req.body.price,
            quantity:req.body.quantity,
            color:req.body.color,
            size:req.body.size,
            material:req.body.material,
            categoryId:req.body.category,
            description:req.body.description,
            createdAt:new Date(),
            productStatus:true,
            img:req.files.map(file=>file.filename)

        })

        await productData.save()
       


    } catch (error) {
        console.log(error.message);
    }
}

const unlistProduct =async (req,res)=>{
    try {
        const productData=await productSchema.findOne({name:req.query.name})
        console.log(req.query.name)
        console.log(productData.is_listed)
    
        if(productData.is_listed===true){
            await productSchema.updateOne({name:req.query.name},{is_listed:false})
            
            
            res.redirect('/products')
        }else{
            await productSchema.updateOne({name:req.query.name},{is_listed:true})
            
            
            res.redirect('/products')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadEditProduct=async (req,res)=>{
    try {
        const categoryData = await categorySchema.find()
        
        const productData = await productSchema.findOne({_id:req.query._id})
        console.log(productData)
       
       return res.render('editProduct',{productData,categoryData})
       
    } catch (error) {
        console.log(error.message)
    }
}

const cropImage =async (req,res)=>{
    (req, res, next) => {
        // Access the uploaded file in req.file.buffer
        const imageBuffer = req.file.buffer;
    
        // Define crop coordinates and size
        const cropOptions = {
            left: 10,
            top: 10,
            width: 200,
            height: 200
        };
    
        // Use Sharp to crop the image
        sharp(imageBuffer)
            .extract(cropOptions)
            .toBuffer()
            .then(croppedImageBuffer => {
                // Send the cropped image as a response or save it to a file
                res.type('image/jpeg').send(croppedImageBuffer);
            })
            .catch(err => {
                console.error('Error cropping image:', err);
                res.status(500).send('Error cropping image');
            });
    }
    
}

const editProduct =async (req,res)=>{
    try {
        console.log('dffsd');
        console.log(req.body.id)
        await productSchema.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,
            price:req.body.price,
            quantity:req.body.quantity,
            color:req.body.color,
            size:req.body.size,
            material:req.body.material,
            categoryId:req.body.category,
            description:req.body.description,
            img:req.files.map(file=>file.filename)}})
        res.redirect('/products')
        
    } catch (error) {
        console.log(error.message)
    }
}

// // const deleteImage =async (req,res)=>{
// //     try {
       

// //         const deleteLinks = document.querySelectorAll('.delete-link');
// //         deleteLinks.forEach(link => {
// //         link.addEventListener('click', function(event) {
       
// //         event.preventDefault();

// //         const photoContainer = link.parentElement;
        
       
// //         photoContainer.remove();
// //     });
// // });



   

//         const productData=await productSchema.findOne({name:req.query._id})
        
//         // console.log(productData.is_listed)
    
//         if(productData.img[0]){
//             await productSchema.updateOne({name:req.query.name},{is_listed:false})
            
            
//             res.redirect('/products')
//         }else{
//             await productSchema.updateOne({name:req.query.name},{is_listed:true})
            
            
//             res.redirect('/products')
//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

module.exports={
    loadProducts,
    loadNewProducts,
    addProducts,
    unlistProduct,
    loadEditProduct,
    cropImage,
    editProduct,
    // deleteImage

}