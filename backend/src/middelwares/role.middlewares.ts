export const authorize=(...role:string[])=>{
    return(req:any,res:any,next:any)=>{
        if(!role.includes(req.user.role)){
            return res.status(403).json({
                message:"Forbidden"
            })
        }
        next();
    }
}