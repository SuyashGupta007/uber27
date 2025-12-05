const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({

    fullname:{
        firstname:{type:String , required:true,minlength:3},
        lastname:{type:String ,minlength:3},
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    socketid:{type:String}

});

userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password,10);

})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}
userSchema.methods.comparePassword = async function(candidatepassword){
 return bcrypt.compare(candidatepassword,this.password);
}
module.exports = mongoose.model('User',userSchema);