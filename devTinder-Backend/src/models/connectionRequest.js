const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted",  "rejected"],
            message: `{VALUE} is not supported` 
        }
    }
},{
    timestamps: true
})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}, {unique: true})

connectionRequestSchema.pre("save", async function(next){
    const connectionRequest = this; 
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself")
    }
    next();
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema); 

module.exports = ConnectionRequestModel;