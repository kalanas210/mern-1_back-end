

// Add Product : /api/product/add

import {upload} from "../configs/multer.js";
import cloudinary from '../configs/cloudinary.js';
import product from "../models/Product.js";
import Product from "../models/Product.js";
import res from "express/lib/response.js";
import req from "express/lib/request.js";

export const addProduct = async (req, res) => {

    try{
        let productData = JSON.parse(req.body.productData);

        const images = req.files;
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,
                    {resource_type:'image'});
                            return result.secure_url;
            })
        )
        await Product.create({...productData , image : imagesUrl});
        res.json({success: true, message: "Product Added"});
    }

    catch(error){
        console.log(error.message);
        res.json({success: false, error: error.message});
    }

}

// Get Product : /api/product/list

export const productList = async (req, res) => {
       try {
           const products = await Product.find({});
           res.json({success: true, products });

       } catch (error) {
          console.log(error.message);
          res.json({success: false, error: error.message});
       }
}

// Get Single product by id : /api/product/id

export const productById = async (req, res) => {
        try{
            const {id} = req.body;
            const product = await Product.findById(id);
            res.json({success: true, product});

        } catch (error) {
            console.log(error.message);
            res.json({success: false, error: error.message});
        }
}

// change product stock : /api/product/stock

export const changeStock = async (req, res) => {
    try{
        const {id,inStock} = req.body;
        await Product.findByIdAndUpdate(id,{inStock});
        res.json({success: true,message: "Stock Updated"});

    } catch (error){
        console.log(error.message);
        res.json({success: false, error: error.message});
    }
}