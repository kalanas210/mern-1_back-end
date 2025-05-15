// Place order COD : /api/order.cod

import product from "../models/Product.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { Stripe } from "stripe";
import {request, response} from "express";
import User from "../models/User.js";

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
        }, Promise.resolve(0));
        // add tax charge

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType : "COD"
        });

        return res.json({success:true , message:"Order successfully created"});

    } catch (error) {
        console.log(error.message);
        res.json({error: error.message});
    }
}

//Stripe

export const placeOrderStripe = async (req, res) => {
    try{
        const {userId, items, address} = req.body;
        const {origin} = req.headers;

        if(!address){
            return res.json({success:false, message:"No address found"});
        } else if(items.length === 0){
            return res.json({success:false, message:"No items found"});
        }

        let productData = [];
        let amount = 0;

        // First collect all product data
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || typeof product.offerPrice !== 'number') {
                console.error('Invalid product or price:', item.product);
                continue;
            }

            const itemTotal = product.offerPrice * item.quantity;
            amount += itemTotal;

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            });
        }

        // Add tax charge
        const taxAmount = Math.floor(amount * 0.02);
        amount += taxAmount;

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        });

        const stripeInstance = new Stripe(process.env.STRIPE_LIVE_KEY);
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price * 100), // Stripe expects amount in cents
                },
                quantity: item.quantity
            };
        });

        // Add tax as a separate line item
        if (taxAmount > 0) {
            line_items.push({
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: "Tax (2%)",
                    },
                    unit_amount: taxAmount * 100, // Convert to cents
                },
                quantity: 1
            });
        }

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });

        return res.json({success: true, url: session.url});

    } catch (error) {
        console.log(error.message);
        res.json({error: error.message});
    }
}

// Stripe webhooks to verify payments

export const stripeWebHooks = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_LIVE_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try{
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        )
    } catch (error) {
          response.status(400).send(`Webhook error: ${error.message}`);
    }
    // Handle the enet
     switch (event.type) {
         case "payment_intent.succeeded":{
             const paymentIntent = event.data.object;
             const paymentIntentId = paymentIntent.id;

             const session = await stripeInstance.checkout.sessions.list({
                 payment_intent: paymentIntentId
             })
             const {orderId,userId} = session.data[0].metadata;
             await Order.findByIdAndUpdate(orderId,{isPaid:true})
             await User.findByIdAndUpdate(userId,{cartItems:{}})
             break;
         }
         case "payment_intent.failed":{
             const paymentIntent = event.data.object;
             const paymentIntentId = paymentIntent.id;

             const session = await stripeInstance.checkout.sessions.list({
                 payment_intent: paymentIntentId
             })
             const {orderId} = session.data[0].metadata;
             await Order.findByIdAndDelete(orderId)
             break;
         }
         default:
             console.error(`Unknown event type ${event.type}`);
             break;
     }
     response.json({received:true})

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