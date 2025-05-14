import express from 'express';
import {upload} from "../configs/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import {addProduct, changeStock, productById, productList} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]),authAdmin, addProduct);
productRouter.get("/list",productList)
productRouter.get("/id",productById)
productRouter.post("/stock",authAdmin,changeStock)

export default productRouter;