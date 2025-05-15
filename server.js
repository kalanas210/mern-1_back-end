import  express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cloudinary from "./configs/cloudinary.js";
import {stripeWebHooks} from "./controllers/orderController.js";

const app = express();

const port = process.env.PORT || 4000;

await connectDB();
await cloudinary;


//allow multiple origins

const allowedOrigins = ["http://localhost:5173"];

app.post('/stripe',express.raw({type:'application/json'}) , stripeWebHooks)

//middleware configuration

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins , credentials: true}));

app.get("/", (req, res) => res.send("API is working"));
app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/address',addressRouter);
app.use('/api/order',orderRouter);



app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})