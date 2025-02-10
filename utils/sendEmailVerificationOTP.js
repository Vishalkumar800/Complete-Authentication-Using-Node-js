import transporter from "../config/emailConfig.js";
import otpSaveInDataBaseModel from "../models/EmailVerification.js";

const sendEmailVerificationOTP = async(req,user) => {

    const otp = Math.floor(1000 + Math.random() * 9000);

    console.log(otp)

    //save otp in Database
    await new otpSaveInDataBaseModel({
        userId : user._id,
        otp : otp
    }).save();

    await transporter.sendMail({
        from:process.env.EMAIL_FROM,
        to:user.email,
        subject:"OTP-Verify your account",
        html:`<p>Dear ${user.name} ,</p> <p> Thankyou for signing with our service. To complete your registration,
        please verify your email address by entering the following one time password(OTP) </p>
        <h2> OTP : ${otp} </h2>
        <p> This OTP is valid for only 15 minutes. If you didn't request this OTP. Please Ignore this OTP. </p>
        `
    })

    return otp
}

export default sendEmailVerificationOTP