import express from "express"
import { config } from "dotenv"
import routes from "./routes/index.js"
import mongoose from "mongoose"
import cors from 'cors'

config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: error.message || 'Problem while executing request'
  })
})

const listener = app.listen(process.env.API_PORT, process.env.API_HOST, async () => {
  console.log(`Server started at http://${listener.address().address}:${listener.address().port}`)
  console.log('Press Ctrl+C to stop')

  try {
    await mongoose.connect(process.env.MONGO_ADDR)
    console.log('MongoDB connected')

  } catch (err) {
    console.error('Problem while connecting to MongoDB')
  }
})


