import mongoose from "mongoose";


const connectDB = async (DATABSE_URL) => {

    try {

        const DB_OPTIONS = {
            dbName: process.env.DATABASE_NAME // Database Name
        }

        mongoose.connect(DATABSE_URL, DB_OPTIONS)
        console.log("Connected Successfully.......")

    } catch (error) {

        console.log(error)

    }

}

export default connectDB