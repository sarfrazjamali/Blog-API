const express = require('express');
const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes');
const app = express();

//MIDDLEWARES TO PARSE REQUEST BODY
//parse incoming json Data from body of req into javascript obj
app.use(express.json());
//parse url encoded form data into a javaScript object
app.use(express.urlencoded({extended:true}));

//MIDDLEWARE FOR API ENDPOINTS
app.use('/api',userRouter)
app.use('/api/posts',postRouter);



module.exports = app;
//to server.js