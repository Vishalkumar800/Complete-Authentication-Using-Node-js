import dotenv from 'dotenv'
dotenv.config()

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // admin gmail
        pass: process.env.EMAIL_PASS // admin password
    }
})

export default transporter