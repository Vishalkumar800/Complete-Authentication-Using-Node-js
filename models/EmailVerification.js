import mongoose from "mongoose";

const OtpSaverSchema = mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '15m' }

});

const otpSaveInDataBaseModel = mongoose.model("otp", OtpSaverSchema)

export default otpSaveInDataBaseModel;