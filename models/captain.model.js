const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jwt')
const captainSchema = new mongoose.Schema({
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
     socketid:{type:String},
     status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
     },
     vehicle:{
         color:{
            type:String,
            required:true,
            minlength:[3,"Color must be at least 3 char long"]
         },
         capacity:{
            type:String,
            required:true,
            min:[1,'Capacity must be at least 1'],
         },
         plate:{type:String,required:true,unique:true}
         
     },
     vehicleType:{
        type:String,
        required:true,
        enum:['car','bike','auto']
     },
     location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number,
        }
     }
});

captainSchema.pre("save", async function(){
    if(!this.isModified("password"))return
    this.password = await bcrypt.hash(this.password,10);
})

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id,},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}

captainSchemamethods.comparePassword = async function(candidatepassword){
 return bcrypt.compare(candidatepassword,this.password);
}

module.exports = mongoose.model("captain",captainSchema);