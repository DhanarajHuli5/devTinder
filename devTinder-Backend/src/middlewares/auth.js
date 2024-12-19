const jwt = require("jsonwebtoken")
const User = require("../models/user")



const userAuth = async (req, res, next) => {
    try {
        //Read the token from the req cookies
    
        const cookies = req.cookies;
    
        const { token } = cookies;
        if(!token){
            throw new Error("Token is not valid")
        }
    
        // validate the token
        const decodedObj = await jwt.verify(token,"secret");
        const { userId } = decodedObj;
    
        const user = await User.findById(userId)
        if(!user){
            throw new Error("User not found")
        } 
        req.user = user;
        next()                  
    } 
    catch (error) {
        res.status(404).send("ERROR: " + error.message)    
    }


    // Find the user
}

module.exports = {
    userAuth,
}