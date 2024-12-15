const mongoose = require("mongoose");



const connectDB = async () => {
    await mongoose.connect("mongodb+srv://dhanrajhuli8762:Sj0ZGro2pYFFkJxX@cluster0.v7ki5i1.mongodb.net/devTinder")
}

module.exports = connectDB;

