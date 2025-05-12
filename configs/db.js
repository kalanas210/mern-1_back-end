import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        mongoose.connection.on('error', (err) => console.error("Database Connection Error:", err));

        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        // Exit the process with a failure code
        process.exit(1);
    }
}

export default connectDB;