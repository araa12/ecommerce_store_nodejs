const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token  = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_KEY, (err,user)=>{
            if(err) res.status(401).json("Token is Not Valid");
            req.user = user;
            next();
        });

    }else{
       return res.status(401).json("You are not Authenticated")
    }
};


const verifyTokenAndAuth = (req,res,next)=> {
    verifyToken(req,res,()=> {
       if(req.user.id === req.params.id || req.user.isAdmin){
        next();
       }else{
           res.status.json("You are not Allowed to do that");
       }
    });
}


const verifyTokenAndAdmin = (req,res,next)=> {
    verifyToken(req,res,()=> {
       if(req.user.isAdmin){
        next();
       }else{
           res.status(401).json("You are not Allowed to do that");
       }
    });
}
module.exports = {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin};