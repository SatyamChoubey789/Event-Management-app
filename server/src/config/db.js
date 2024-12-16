const mongoose = require("mongoose");
const process = require("node:process");


const ConnectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected",connection);
    } catch (error) {
        console.log("Connection error: " + error);
            process.exit(1);
    }
}

module.exports = ConnectDB;