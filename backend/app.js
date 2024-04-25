import express, { response } from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

import userRouter from './routes/user.js';
import postRouter from './routes/post.js';

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({
    limit:"50mb",
    extended: false
}));
app.use(express.json({
    limit : "50mb"
}));

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(3065, () => {
    console.log('server running');
});