import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const connString = process.env.MONGODB_URI;
        mongoose.connection.on('connected', () => console.log("Database connected"));
        await mongoose.connect(`${connString}/learnify`);
    } catch (error) {
        console.log("Error while connecting to DB ", error);
    }
}
export default dbConnection;