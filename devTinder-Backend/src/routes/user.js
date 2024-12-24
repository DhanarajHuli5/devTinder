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
        .populate("toUserId",["firstName","lastName"]) 

        const data = connectionRequests.map((row) => { 

            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            } else {
                return row.fromUserId
            }
        })
        res.json({
            message: "Data fetched successfully",
            data
        })



    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        
        //User should see all the user card except
        // 0. His own card
        // 1. his connections
        // 2. already ignored people
        // 3. already sent the connection request.

        const loggedInUser = req.user;

        // find all connection requests (both sent and received)
        const connectionsRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("toUserId fromUserId")

        const hideUsersFromFeed = new Set();
        connectionsRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and : [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })

        res.send(users)

    } catch (error) {
        res.status(400).json({
            message: "ERROR: " + error.message
        });
    }
})

module.exports = userRouter