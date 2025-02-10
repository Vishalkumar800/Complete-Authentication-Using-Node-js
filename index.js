import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import passport  from 'passport';
import userRoutes from './routes/UserRoutes.js'
//connect Database

import connectDB from './config/connectdb.js';


const app = express()
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT
//For Format click SHIFT + ALT +F
const coreOptions = {
    origin: process.env.HOST,
    credential: true,
    optionsSuccessStatus: 200
}

app.use(cors(coreOptions))
app.use(cookieParser())

// Database Connection
const DATABASE_URL = process.env.DATABASE_URL
connectDB(DATABASE_URL)

//passport
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send("Hello")
})

app.use("/api/user",userRoutes)

app.listen(port, () => {
    console.log(`Server Run at http://localhost:${port}`)

})