const express = require("express");
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser"); // Import cookie-parser

app.use(express.json())
app.use(cookieParser()); // Use cookie-parser middleware

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDB().then(() => {
  console.log("Database connected...");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });      
  
}).catch( err => {
  console.error("Database connection failed");
})
