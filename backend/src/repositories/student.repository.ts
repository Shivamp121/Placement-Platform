import prisma from "../config/prisma.js";
export const createProfile=(data:any)=>{
    return prisma.studentProfile.create({
        data,
    });
}
export const getProfile=(userId:string)=>{
    return prisma.studentProfile.findUnique({
        where:{
            userId
        }
    })
}

