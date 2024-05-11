import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import db from './config/db.js'
import { corsOptions } from './config/cors.js';
import userRouter from './routers/user/index.js';
import notesRouter from './routers/notes/index.js';
import profileRouter from './routers/profile/index.js';
import './crons/MatchingBuddy.js';
import matchingsRouter from './routers/matching/index.js';

const port = process.env.PORT;
const app = express();
app.use(express.json()); //parse req.body to json 

app.use(cors({ corsOptions })); //whitelist the cors origin
db(process.env.MONGO_DB_URI); //connect to mongoDB

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get("/", (req, res) => {
    res.end("Welcome to the Connectr's server!");
})

//setup routes 
app.use("/user", userRouter);
app.use("/notes", notesRouter);
app.use("/profile", profileRouter);
app.use("/matching", matchingsRouter);
