const setTokenCookies = async (res, accessToken, refreshToken, accessTokenExp, refreshTokenExp) => {

    const accessTokenMaxAge = ((accessTokenExp * 1000) - Date.now());
    //Date.now() hmesa milliseconds me time deta hai 

    /*
     Dekho upr (*** accessTokenExp ** ) yeah time seconds me aa rha hai and Date.now() millseconds me deta hai time
     esliye ccessTokenExp phle millseconds me convert krke minus kr rha hu

     */
    const refreshTokenMaxAge = ((refreshTokenExp * 1000) - Date.now());

    if (accessTokenMaxAge <= 0 || refreshTokenMaxAge <= 0) {
        throw new Error("Token expiration time is in the past");
    }

    // set cookie for accessToken 

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: accessTokenMaxAge,
        sameSite: "strict" // for security reason eska kaam hai cookies tb behja jayega jb same site se request aayega mtlb agr com.google web
        /// hai tumara toh cookies yhi bs jayega aur khi hai mtlb evil.com pr nhi 

    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: refreshTokenMaxAge,
        sameSite: "strict"
    })

}

export default setTokenCookies
