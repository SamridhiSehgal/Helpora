import jwt from 'jsonwebtoken';
const ngoAuth=async(req,res,next)=>{
    try{
        const {token}=req.headers;
        if(!token){
            return res.json({success:false,message:"No token provided"});

        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET_Ngo);
        req.ngoId=token_decode.id;
        next();
    }
    catch(error){
        return res.json({success:false,message:"Invalid token"});
    }

}

const victimAuth=async(req,res,next)=>{
    try{
        const {token}=req.headers;
        if(!token){
            return res.json({success:false,message:"No token provided"});

        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET_Victim);
        req.victimId=token_decode.id;
        next();
    }   
    catch(error){
        return res.json({success:false,message:"Invalid token"});
    }

}
export {ngoAuth,victimAuth};
 

