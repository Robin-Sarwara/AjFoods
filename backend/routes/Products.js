const { EnsureAuthenticated, isAdmin } = require('../middleware/EnsureAuthenticated.js');
const {upload, deleteProductImages} = require('../middleware/Upload.js');
const Product = require('../models/Products.js');
const UserModel = require('../models/user.js');
const Router = require('express').Router();

Router.post('/products', EnsureAuthenticated, isAdmin, upload.array('images', 3), async (req, res) => {
    try {
        const { name, description, price, category, tags, isVeg, ingredients, discount, preparationTime, availability } = req.body;

        // Ensure all required fields are provided
        if (!name || !description || !price || !category || !tags || !isVeg || !preparationTime || !availability || !ingredients || !discount  ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure files are uploaded correctly
        const imageUrls = req.files && req.files.length > 0
            ? req.files.map(file => file.path)  // Extract image paths
            : [ "https://via.placeholder.com/300" ]; // Dummy image if none uploaded

            const thumbnail = imageUrls[0]

        const newProduct = new Product({ name, description, price, category, imageUrls,thumbnail,
            tags:tags ? tags.split(',').map(tag => tag.trim()) : [],
            isVeg:isVeg==='true',
            ingredients: ingredients ? ingredients.split(',').map(ing => ing.trim()) : [],
            discount: discount ? Number(discount) : 0,
            preparationTime: preparationTime ? Number(preparationTime) : null,
            availability: availability === 'true'
         });
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product uploaded successfully",
            savedProduct
        });

    } catch (error) {
        console.error("Error uploading product:", error);   
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }
});

// Fetch all products
Router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message || error });
    }
});

Router.get('/products/:id', async(req,res)=>{
    try {
        const products = await Product.findById(req.params.id);
        if(!products){
            return res.status(404).json({
                message:"Product not found"
            })
        }
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message:"Internal server error",
            error: error.message || error
        })
    }
})

Router.delete('/products/:id', EnsureAuthenticated, isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Fetch product first
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await deleteProductImages(product); // Delete images from Cloudinary first
        await Product.findByIdAndDelete(req.params.id); // Then delete product from MongoDB

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message || error
        });
    }
});


Router.put('/products/:id', EnsureAuthenticated, isAdmin, upload.array('images', 3), async (req, res) => {
    try {
        const { name, description, price, category, tags, isVeg, ingredients, discount, preparationTime, availability } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let imageUrls = product.imageUrls;
        if (req.files && req.files.length > 0) {
            await deleteProductImages(product);
            imageUrls = req.files.map(file => file.path);
        }        
       
        const thumbnail = imageUrls.length > 0 ? imageUrls[0] : product.thumbnail;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category || product.category;
        product.imageUrls = imageUrls;
        product.thumbnail = thumbnail;
        product.tags = tags ? tags.split(',').map(tag => tag.trim()) : product.tags;
        product.isVeg = isVeg !== undefined ? isVeg === 'true' : product.isVeg;
        product.ingredients = ingredients ? ingredients.split(',').map(ing => ing.trim()) : product.ingredients;
        product.discount = discount ? Number(discount) : product.discount;
        product.preparationTime = preparationTime ? Number(preparationTime) : product.preparationTime;
        product.availability = availability !== undefined ? availability === 'true' : product.availability;
        product.updatedAt = Date.now();

        const updatedProduct = await product.save();
        res.json({
            message: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message || error
        });
    }
});



module.exports = Router;
