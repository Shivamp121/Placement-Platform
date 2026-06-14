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

export const updateProfile=(userId:string,data:any)=>{
    return prisma.studentProfile.update({
        where:{userId},
        data:data
    });
}

export const deleteProfile=(userId:string)=>{
    return prisma.studentProfile.delete({
        where:{userId}
    })
}

export const getDashboardData=(userId:string)=>{
    return prisma.studentProfile.findUnique({
        where:{userId},
    })
}
