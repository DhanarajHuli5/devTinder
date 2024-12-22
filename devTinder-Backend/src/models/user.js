const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid" + value)
            }
        }
    },
    password:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum:{
            values: ["male","female","others"],
            message: "Gender is not valid"
        },
    },
    photoUrl:{
        type:String,
        default: "https://www.webert.it/prod-dummy-image-1-2/?lang=en"
    },
    about:{
        type: String,
        default: "I am a software developer"
    },
    skills:{
        type:[String]
    }
},{
    timestamps: true
}) 


userSchema.methods.getJWT = async function(){
    const user = this;
    
    const token = await jwt.sign({userId: user._id}, "secret")
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);
module.exports = User;