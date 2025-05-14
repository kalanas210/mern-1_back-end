import express from 'express';
import authUser from "../middleware/authUser.js";
import {getAllOrders, getUserOrders, placeOrderCOD} from "../controllers/orderController.js";
import authAdmin from "../middleware/authAdmin.js";

const orderRouter = express.Router();
orderRouter.post('/cod', authUser,placeOrderCOD);
orderRouter.get('/user', authUser,getUserOrders);
orderRouter.get('/admin', authAdmin,getAllOrders);

export default orderRouter;