import express, { response } from "express";
import path from "path";
import cors from "cors";
const app = express();
const __dirname = path.resolve();

import postRouter from './routes/post.js';
import userRouter from './routes/user.js';

app.use(express.static("public"));
app.use(cors());

app.use('/posts', postRouter);
app.use('/users', userRouter);
app.listen(3000, () => {
  console.log("실행");
});
