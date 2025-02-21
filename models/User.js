import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true, trim: true },
    is_verfied: { type: Boolean, default: false }

})

const userModel = mongoose.model("user", userSchema)

export default userModel