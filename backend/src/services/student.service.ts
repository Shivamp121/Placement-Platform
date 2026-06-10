import { createProfile, getProfile } from "../repositories/student.repository.js";
export const createStudentProfile=(data:any)=>{
return createProfile(data);
}

export const getStudentProfile=(userId:string)=>{
    return getProfile(userId);
}
