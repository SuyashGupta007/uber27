const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
module.exports.registerUser = async (req,res)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    const{fullname,email,password} = req.body;
    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password
    });
    const token = user.generateAuthToken();
    return res.status(201).json({token,user});

    const jwt = require('jsonwebtoken');


};

module.exports.loginUser = async (req,res)=>{
    try{
        const{email,password} = req.body;
        const user = await userModel.findOne({email}).select('+password');
        console.log(user);
        if(!user){
            return res.status(401).json({message:"Invalid email or password"});

        }
        const ok = await user.comparePassword(password);
        console.log('password match:',ok);
        if(!ok){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token =await user.generateAuthToken;
        res.cookie('token',token,{httpOnly:true});
        return res.status(200).json({token,user});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}