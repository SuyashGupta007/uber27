const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const TokenBlacklist = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        let token = null;
        if(authHeader && authHeader.startsWith('Bearer ')){
             token = authHeader.split(' ')[1];
    }else if(req.cookies && req.cookies.token){
                 token = String(req.cookies.token).trim();
    }
    if(!token){
        return res.status(401).json({message:"Access denied. You are Unauthorized."});
    }
    
    const isBlacklisted = await TokenBlacklist.findOne({token});
    if(isBlacklisted){
       return  res.status(401).json({message:"Unauthorized:token blacklisted"})
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const userId = decoded && decoded._id;
    const user = await User.findById(userId).select('-password');
    
    if(!user){
        return res.status(401).json({message:"Access denied. You are Unauthorized."});
    }
   
    req.user = user;
    next();


}catch(err){
    console.error("Auth Middleware Error:",err.message);
    return res.status(500).json({message:"Internal server error"});
}
}