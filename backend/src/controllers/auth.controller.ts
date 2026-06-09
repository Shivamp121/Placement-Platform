import {type Request,type Response } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";
export const register = async (req:Request,res:Response)=>{
    try{
        const{email,password,role}=req.body;
        const user=await registerUser(email,password,role);
        return res.status(201).json(user);
    }catch(error:any){
        res.status(400).json({
            message:error.message,
        });

    }
}

export const login = async (req:Request,res:Response)=>{
    try{
        const{email,password}=req.body;
        const result=await loginUser(email,password);
        res.json(result);
    }catch(error:any){
        res.status(400).json({
            message:error.message,
        })
    }
}

export const me = (req:any,res:any)=>{
    res.json(
        req.user
    );
}
