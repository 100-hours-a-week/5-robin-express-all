const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require('express-session');

const userRouter = require('./routes/user.js');
const postRouter = require('./routes/post.js');
const imageRouter = require('./routes/image.js');
const headerRouter = require('./routes/header.js');

const app = express();

app.use(cors({
    origin : "http://localhost:3000",
    method : ["GET", "POST", "PATCH", "DELETE"],
    credentials : true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({
    limit:"50mb",
    extended: false
}));
app.use(express.json({
    limit : "50mb"
}));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/public/userImg', imageRouter);
app.use('/header', headerRouter);

app.listen(3065, () => {
    console.log('server running');
});
