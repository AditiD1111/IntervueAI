//connect to mongo db
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        console.log(
            "Continuing without MongoDB. Auth and sessions will use local file storage, while chat routes can still work normally."
        );
    }
};

module.exports = connectDB;
