const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        default:null,
    },
    lastname:{
        type:String,
        required:true,
        default:null,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        default:null,
    },
    password:{
        type:String,
        required:true,
    },
     isAdmin: { 
        type: Boolean, 
        default: false 
    },
});

module.exports=mongoose.model('User',userSchema);