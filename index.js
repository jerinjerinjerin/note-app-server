import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config.json' assert { type: 'json' };
import mongoose from 'mongoose';
import UserRoute from './routes/user.route.js';
import NoteRoute from './routes/note.route.js';



mongoose.connect(config.connectionString)
.then(() => {
    console.log(`Connected to MongoDB Atlas: ${mongoose.connection.host}`);
}).catch((err) => {
   console.log(err);
})

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
}))

app.use("/user", UserRoute);

app.use("/note", NoteRoute);

app.get("/", (req, res) => {
    res.json({data: "my app is"})
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})