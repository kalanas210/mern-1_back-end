import express from 'express';
import {adminLogin, adminLogout, isAdminAuth} from "../controllers/AdminController.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post('/login',adminLogin);
adminRouter.get('/is-auth',authAdmin,isAdminAuth);
adminRouter.get('/logout',adminLogout);

export default adminRouter;