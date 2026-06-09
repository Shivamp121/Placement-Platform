import jwt from "jsonwebtoken";
export const protect=(req:any,res:any,next:any)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const token=authHeader.split(" ")[1];
    try{
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET!
        );
        req.user=decoded;

        next();

    }catch(error:any){
        return res.status(401)
      .json({
        message:"Invalid token",
        error:error.message
      });
    }
}