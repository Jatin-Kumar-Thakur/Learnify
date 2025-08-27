import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from './configs/db.js';

//Initialize express
const app = express();
dotenv.config();


//DB connect
await dbConnection();

//Middleware
app.use(cors());


//Routes
app.get('/', (req, res) => {
    res.send("Home route")
})


//PORT
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is Running on port ", PORT);
})