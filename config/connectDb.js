const mongoose = require("mongoose");
const colors = require("colors");
const { error } = require("console");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Server Running on ${mongoose.connection.host}`.bgCyan.white);
    } catch (e) {
        console.error(`${error}`.bgRed
        );
        process.exit(1);
    }
};

module.exports = connectDb;
