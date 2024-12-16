

const mongoose = require('mongoose');

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
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
        
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

const User = mongoose.model("User",userSchema);

module.exports = User;