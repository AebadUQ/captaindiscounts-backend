const categoryService = require("../services/category.service");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const categoryController = {
  createCategory: catchAsync(async (req, res) => {
    const { name, slug, url, description } = req.body;

    if (!name || !slug || !url) {
      throw new ApiError(400,"Name, slug, and url are required");
    }

    const category = await categoryService.createCategory(
      name,
      slug,
      url,
      description
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  }),

  getAllCategories: catchAsync(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await categoryService.getAllCategories({ page, limit, search });

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
}),
//CAegory with brand
 getCategoryWithBrands: catchAsync(async (req, res) => {
  const result = await categoryService.getCategoryWithBrand();

  res.status(200).json({
    success: true,
    message: "Category with breands data fetched successfully",
    data: result,
  });
}),
  getCategoryByID:catchAsync(async (req,res)=>{
    
    const category = await categoryService.getCategoryByID(req.params.id)
     res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: category,
    });
  }),
  deleteCategory: catchAsync(async (req, res) => {
    const result = await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  }),
  updateCategory:catchAsync(async (req,res)=>{
    const {id}=req.params;
    const updateData= req.body;

    const updatedCategory = await categoryService.updateCategory(id,updateData)
     res.status(200).json({
    success: true,
    data: updatedCategory,
  });
  }),
  
};

module.exports = categoryController;
