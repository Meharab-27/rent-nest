import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config/index";
import { RegisteredUserPayload } from "./user.interface";



const registerUserIntoDB = async(payload: RegisteredUserPayload) =>{
    const {name, email, password, role} = payload
     const isUserExist = await prisma.user.findUnique({
        where : {email}
    })

    if(isUserExist){
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data : {
            name,
            email,
            password:hashedPassword,
            role: role ?? "TENANT",
        },
        include: {
            properties: true,
        }
    });

    return createdUser;
}


export const userService = {
    registerUserIntoDB
}