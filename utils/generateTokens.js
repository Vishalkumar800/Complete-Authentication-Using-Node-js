// **********  access Token    **********
/*

yeah token kuch time tk valid hota hai . jisme tumare (*** data store **) rhta hai koi bhi data ho skhta hai just like
( ** email , name ** ) koi bhi chijje jo tum chate ho 

yeah minimun 10 ya 5 ya 2 min tk valid rhta hai 

*/


// **** Refresh Token **********
/*

Es token ka kaam hota hai (*** access token **) generate krna yeah. apka apka koi data nhi rkhte hai eska validation tume jyada 
rkhena pdta hai minimum 30 days it depends upon you

*/


import jwt from 'jsonwebtoken'
import UserRefreshTokenModel from '../models/UserRefreshToken.js';

const generateToken = async (user) => {

    try {

        const payload = { _id: user._id, email: user.email }
        const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // 100 seconds tk valid rhega

        const accessToken = jwt.sign(
            { ...payload, exp: accessTokenExp },
            process.env.JWT_ACCESS_TOKEN_SCERET_KEY
        )

        // generate refresh token 

        const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; //expires in 5 days 
        const refreshToken = jwt.sign(
            { ...payload, exp: refreshTokenExp },
            process.env.JWT_REFESH_TOKEN_SCERET_KEY
        )

        const anyRefreshTokenPresent = await UserRefreshTokenModel.findOne({ userId: user._id })

        if (anyRefreshTokenPresent) {
            await anyRefreshTokenPresent.deleteOne({ userId: user._id })
        }

        // save in database 

        await new UserRefreshTokenModel({
            userId: user._id,
            token: refreshToken
        }).save();

        return Promise.resolve({ accessToken, refreshToken, accessTokenExp, refreshTokenExp });



    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            message: "Token generation Failed"
        });
    }

}

export default generateToken