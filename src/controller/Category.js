import slugify from "slugify";
import CategoryModel from "../models/Category.js";
import slug from 'slugify'
import postModel from '../models/Post.js';

export const createCategoryController=async(req,res)=>{
    try {
        const {name}=req.body;
        if(!name){
            return res.status(400).send({
                success:true,
                message:"Name is required",
            })
        }

        const existingCategory=await CategoryModel.findOne({name});
        if(existingCategory)
        {
          return res.status(400).json({
            message:"category already exist",
          })  ;
        }

        const newCategory= await new CategoryModel({
            name,
            slug:slug(name),
        }).save()
        return res.status(200).send({
            message:"category has been created",
            success:true,
            newCategory,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"error while creating category",
            error,
        })
    }
}

export const getAllcategory=async(req,res)=>{
    try {
        const category=await CategoryModel.find({})
        return res.status(200).send({
            success:true,
            message:"categoris fetched successfuly",
            category,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"error while creating category",
            error,
        })
    }
}

export const updateCategoryController=async(req,res)=>{
try {
     const {name}=req.body;
 const {id}=req.params;

 const category=  await CategoryModel.findByIdAndUpdate(
    
    id,
    {name,slug:slugify(name)},
    {new: true}
 )
 res.status(200).send({
    success:true,
    message:"Category update successfully",
    category,
 });
} catch (error) {
    return res.status(500).send({
        success:false,
        message:"Error while updating category",
        error,
    });
}
}

export const deleteCategory=async(req,res)=>{
 try {
  const {id}=req.params;
  await CategoryModel.findByIdAndDelete(id)
  return res.status(200).send({
    success:true,
    message:"delete category successfuly"
  })

 } catch (error) {
    res.status(500).send({
        success:false,
        message:"Error while delete category",
        error,
    });
 }
}

export const singleCategory=async(req,res)=>{
    try {
      const category=await CategoryModel.findOne({slug:req.params.slug});
      const post= await postModel.find({category}).populate("category");
         return res.status(200).send({
    success:true,
    message:"delete category successfuly",
    post,
  })
    } catch (error) {
      res.status(404).send({
        success:false,
        message:"Error while delete category",
        error,
    });  
    }
}


export const selectedCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const products = await postModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Your selected products has been fetched",
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Selected Product API",
    });
  }
};


