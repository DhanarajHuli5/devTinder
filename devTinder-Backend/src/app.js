const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const { validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");   
const { default: isEmail } = require("validator/lib/isEmail");
const validator = require("validator")


app.use(express.json())
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
      console.log(error)
      res.status(500).send("ERROR " + error.message)
    }
   
    
})


// Get user by email
app.get("/user", async (req,res) => {
  const userEmail = req.body.emailId;
  
   
  try{
    const user = await User.findOne({emailId: userEmail})
    console.log(user);
    
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong")
  }
  
})

// Feed API - GET /feed - get all users from the database
app.get("/feed", async (req,res) => {
  try{
    const user = await User.find({})
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong")
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

    const isPasswordValid = await  bcrypt.compare(password,user.password)

    if(isPasswordValid){
      res.send("Login successfull !!")
    } else {
      throw new Error("Invalid credentials")
    }




  } catch (err){
    res.status(400).send("ERROR : " + err.message)
  }
})

// Delete user
app.delete("/user", async (req,res) => {
  const userId = req.body.userId; 
  try{
    const user = await User.findByIdAndDelete(userId)
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong")
  }
})


app.patch("/user/:userId", async (req,res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try{

    //allowed updates
    const ALLOWED_UPDATES =["photoUrl","about","gender","age","skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k)
    )

    if(!isUpdateAllowed){
      throw new Error("Update not allowed he he");
    }

    const user = await User.findByIdAndUpdate({_id: userId}, data, {
      returnDocument:"after",
      runValidators: true,
    })
    console.log(user);
    res.send("User updated successfully")
  } catch(error){
    res.status(400).send("Error is " + error.message);
  }
})

connectDB().then(() => {
  console.log("Database connected...");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
  
}).catch( err => {
  console.error("Database connection failed");
})
