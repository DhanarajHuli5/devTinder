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



connectDB().then(() => {
  console.log("Database connected...");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
  
}).catch( err => {
  console.error("Database connection failed");
})
