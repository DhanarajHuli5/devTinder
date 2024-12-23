const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { connect } = require("mongoose");


// Get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",["firstName","lastName"])

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId",["firstName","lastName"]) 
        const data = connectionRequests.map((row) => row.fromUserId);


        res.json({
            message: "Data fetched successfully",
            data
        })



    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

module.exports = userRouter