const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username:{
        type:String,
        required:true,
        minLength:8,
        maxLength:20,
    },
    email:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:14,
    }
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
