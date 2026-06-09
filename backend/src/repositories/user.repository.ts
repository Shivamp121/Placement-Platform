import prisma from "../config/prisma.js";
import {Role} from "@prisma/client"
export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where : {
            email,
        },
    });
};
export const createUser = async (email: string, password:string,role:Role)=>{
return prisma.user.create({
    data:{
        email,
        password,
        role
    },
});
};