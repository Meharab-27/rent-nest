import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const loginUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const payload = req.body;
    const {accessToken} = await authService.loginUser(payload);

    res.cookie("accessToken",accessToken,{

        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000 * 60 *60* 24
    })

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User logged in successfully",
        data: {accessToken}
    })
})

const registerUser = catchAsync(async(req:Request,res:Response)=>{
    const payload = req.body;
    const user = await authService.registerUser(payload);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User registered successfully",
        data: {user}
    })
})

const getMe = catchAsync(async(req:Request,res:Response)=>{
    const user = (req as Request & { user?: { id: string; name: string; email: string; role: string } }).user;

    if (!user) {
        res.status(httpStatus.UNAUTHORIZED).json({
            success:false,
            statusCode:httpStatus.UNAUTHORIZED,
            message:"Authentication token is required"
        });
        return;
    }

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User fetched successfully",
        data: {user}
    })
})

export const authController = {
    loginUser,
    registerUser,
    getMe
}