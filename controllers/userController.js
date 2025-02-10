import userModel from "../models/User.js";
import bcrypt from 'bcrypt';
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import otpSaveInDataBaseModel from "../models/EmailVerification.js";
import generateToken from "../utils/generateTokens.js"
import setTokenCookies from "../utils/setTokenCookie.js";

class UserController {
    //User Registration

    static userRegistration = async (req, res) => {

        try {

            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    status: "failed",
                    message: "All field required"
                })
            }

            //check if email is already registered 

            const existingUser = await userModel.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    status: "failed",
                    message: "Email is already Registered"
                })
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(password, salt);

            //create new User

            const newUser = await new userModel({
                name: name,
                email: email,
                password: hashPassword
            }).save();

            sendEmailVerificationOTP(req, newUser)

            //Send Success response
            return res.status(201).json({
                status: "success",
                message: "Registration Success",
                user: { user: newUser._id, email: newUser.email }
            })

        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failed",
                message: "Unable to Register,please try again later"
            });
        }

    }

    //Otp and Email Verification
    static verifiyEmail = async (req, res) => {
        try {

            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({
                    status: "failed",
                    message: "All field required"
                });
            }

            const emailExists = await userModel.findOne({ email })

            if (!emailExists) {
                return res.status(404).json({
                    status: "failed",
                    message: "Unable to verify email , please try later"
                });
            }

            //if email is already verified

            if (emailExists.is_verfied) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email is already verified"
                })
            }

            // Check hmne jisko email bheja hai uski ha hai ya nhi

            const emailVerification = await otpSaveInDataBaseModel({ userId: emailExists._id, otp })

            if (!emailVerification) {
                if (!emailExists.is_verfied) {
                    return res.status(400).json({
                        status: "failed",
                        message: "Invalid OTP,new OTP send to your email Id"
                    })
                }
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid OTP"
                });
            }

            //check otp is expired

            const currentTime = new Date()
            //jo database me time save hai usme 15 min add kr rhe hai and check kr rhe hai createdA
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);

            if (currentTime > expirationTime) {
                await new sendEmailVerificationOTP(req, emailExists)
                return res.status(400).json({
                    status: "failed",
                    message: "OTP Expired new OTP sent to your email"
                });
            }
            emailExists.is_verfied = true
            await emailExists.save();

            //Delete otp after verfication

            await otpSaveInDataBaseModel.deleteMany({ userId: emailExists._id });
            return res.status(200).json({
                status: "success",
                message: "Email Verified Successfully"
            });


        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failed",
                message: "Unable To Verify OTP, please try again"
            });
        }
    }

    //resend OTP
    static resendOtp = async (req, res) => {
        try {

            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email field is not empty"
                });
            }

            const user = await userModel.findOne({ email })

            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    message: "Email is not registered ,please registred first"
                });
            }

            // check is email is already verified

            if (user.is_verfied) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email is already verified"
                });
            }


            // sbhi otp ko delete kro jo bheja gya ho 

            await otpSaveInDataBaseModel.deleteMany({ userId: user._id })

            //generate new otp

            await sendEmailVerificationOTP(req, user);

            return res.status(200).json({
                status: "success",
                message: "New Otp send to your email"
            });



        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failed",
                message: "Unable To send OTP,please try again"
            })
        }
    }


    //userLogin 
    static userLogin = async (req, res) => {

        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: "failed",
                    message: "Fields cannot be empty"
                });
            }

            const user = await userModel.findOne({ email })

            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    message: "Email not Found ,Please Registered first"
                });
            }

            if (!user.is_verfied) {
                return res.status(401).json({
                    status: "failed",
                    message: "Your account is not Verified , please complete registration first"
                })
            }

            // password match

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid email or password"
                });
            }

            // generate token 
            // yeah apka parchi hota hai just like indentity card jisme tumare bare me data store hota hai

            const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateToken(user)

            // set cookies  
            // jo cookie hota wo token ko store krta hai just like chota sa database

            setTokenCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp)

            return res.status(200).json({
                user: { id: user._id, email: user.email, name: user.name },
                status: "success",
                message: "Login Suceesful",
                access_Token: accessToken,
                refresh_Token: refreshToken,
                is_auth: true
            });


        } catch (error) {
            console.error(error)
            res.status(500)
                .json({
                    status: "failed",
                    message: "Login failed, please try again"
                });
        }

    }




}

export default UserController