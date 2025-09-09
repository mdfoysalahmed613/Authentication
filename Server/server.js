import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import "dotenv/config"
import connectDB from './Config/mongodb.js'
import authRouter from './Routes/authRoute.js'

const app = express()
const port = process.env.PORT || 4000;

app.use(cors({
  origin: ['https://authentication-kappa-five.vercel.app'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser({Credential: true}))
connectDB();

// Api Endpoint
app.get("/",(req,res)=>{
  res.send("server is running")
})
app.use("/api/auth",authRouter)


app.listen(port,()=>{
  console.log(`Server is running on http://localhost:${port}`)
})