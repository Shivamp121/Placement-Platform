import { createProfile, deleteProfile, getDashboardData, getProfile, updateProfile } from "../repositories/student.repository.js";
export const createStudentProfile=(data:any)=>{
return createProfile(data);
}

export const getStudentProfile=(userId:string)=>{
    return getProfile(userId);
}
export const updateStudentProfile=(userId:string,data:any)=>{
    return updateProfile(userId,data);
}

export const deleteStudentProfile=(userId:string)=>{
    return deleteProfile(userId);
}

export const getStudentDashboardData=async(userId:string)=>{
    const user=await getDashboardData(userId);
    let completion=0;
    if(user?.firstName)
        completion+=20;
    if(user?.degree)
        completion+=20;
    if(user?.college)
        completion+=20;
    if(user?.skills?.length)
        completion += 20;
    if(user?.githubUrl)
        completion+=20;
    return {
        user,
        completionPercentage:completion
    }
}
