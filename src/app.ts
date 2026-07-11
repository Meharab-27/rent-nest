import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config/index";
import httpStatus from "http-status"
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { landlordRoutes } from "./modules/landlord/landlord.routes";
import { rentalRoutes } from "./modules/rental/rental.routes";
import { paymentRoutes } from "./modules/payment/payment.routes";
import { reviewRoutes } from "./modules/review/review.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { propertyRoutes } from "./modules/property/property.routes";
import { categoryRoutes } from "./modules/category/category.routes";

const app : Application = express();


app.use(cors({
    origin: process.env.NODE_ENV === "production" ? config.app_url : true,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get("/",(req:Request,res:Response)=>{
    
        res.send("hello world");
})


app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/properties", propertyRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/landlord",landlordRoutes)
app.use("/api/rentals", rentalRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/admin", adminRoutes)


export default app;