const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const { validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");   
const { default: isEmail } = require("validator/lib/isEmail");
const validator = require("validator")
const cookieParser = require("cookie-parser"); // Import cookie-parser
const jwt = require("jsonwebtoken")
const { userAuth} = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser()); // Use cookie-parser middleware

app.post("/signup", async (req,res) => {
  // creating a new instance of User model
  try {
      // Validation of data
      validateSignUpData(req)

    const { firstName, lastName, emailId, password } = req.body;

      // Encrypt the password
      const passwordHash = await bcrypt.hash(password,10)

      const user = new User({ 
        firstName,lastName, emailId, password: passwordHash
      });
      await user.save()
      res.send("User added successfully")
    } catch (error) {
      res.status(500).send("ERROR " + error.message)
    }
})

// Login API
app.post("/login", async (req,res) => {
  try{
    const { emailId , password } = req.body;
    if(!validator.isEmail(emailId)){
      throw new Error("Invalid emailId")
    }

    const user = await User.findOne({emailId: emailId})
    if(!user){  
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await user.validatePassword(password)

    if(isPasswordValid){
      //JWT token create 
      const token = await user.getJWT();
      res.cookie("token",token) 
      res.send("Login successfull !!")
    } else {
      throw new Error("Invalid credentials")
    }
  } catch (err){
    res.status(400).send("ERROR : " + err.message)
  }
})

// Profile 
app.get("/profile",userAuth,  async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("Authentication failed: " + error.message);
  }
})


// send connection request 

app.post("/sendConnectRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending a connection request");

  res.send(user.firstName + "sent the connection request !!")
  
})




connectDB().then(() => {
  console.log("Database connected...");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });      
  
}).catch( err => {
  console.error("Database connection failed");
})
