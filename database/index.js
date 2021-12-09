const mongoose = require("mongoose");
const env = require("../env/index");

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDb connected to : ${connect.connection.name}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;