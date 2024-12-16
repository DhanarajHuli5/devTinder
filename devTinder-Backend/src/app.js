const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")

app.use(express.json())
app.post("/signup", async (req,res) => {
    // creating a new instance of User model
    const user = new User(req.body);
    try {
      await user.save()
      res.send("User added successfully")
    } catch (error) {
      console.log(error)
      res.status(500).send("Error adding user")
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


app.patch("/user", async (req,res) => {
  const userId = req.body.userId;
  const data = req.body;

  try{
    await User.findByIdAndUpdate({_id: userId}, data)
    res.send("User updated successfully")
  }
  catch(err){
    res.status(400).send("Something went wrong");
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
