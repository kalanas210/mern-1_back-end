// Place order COD : /api/order.cod

import product from "../models/Product.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const placeOrderCOD = async (req, res) => {
    try{
        
        const {userId , items , address} = req.body;

        if(!address){
            return res.json({success:false , message:"No address found"});
        } else if(items.length === 0){
            return res.json({success:false , message:"No items found"});
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product || typeof product.offerPrice !== 'number') {
                console.error('Invalid product or price:', item.product);
                return await acc;
            }
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);
        // add tax charge

        amount +=Math.floor(amount*0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType : "COD"
        })

        return  res.json({success:true , message:"Order successfully created"});
        
    } catch (error) {
         console.log(error.message);
         res.json({error: error.message});
    }
}

// Get Orders by user id

export const getUserOrders = async (req, res) => {
    
    try{
        
        const userId = req.user;
        const orders = await Order.find({
            userId,
            $or : [{paymentType : "COD"},{isPaid : true}],
        }).populate('items.product address').sort({createdAt: -1});

        res.json({success:true, orders});
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false , error: error.message});
        
    }
    
}

// Get Orders for Admin Dashboard : /api/order/admim

export const getAllOrders = async (req, res) => {

    try{

        const orders = await Order.find({
            $or : [{paymentType : "COD"},{isPaid : true}],
        }).populate('items.product address').sort({createdAt: -1});

        res.json({success:true, orders});

    } catch (error) {
        console.log(error.message);
        res.json({success:false , error: error.message});

    }

}

