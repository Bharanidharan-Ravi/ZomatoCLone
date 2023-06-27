const express = require ("express");
const mongoose = require ("mongoose");
const app = express();
const cors = require ("cors")
const appRoute = require("./appRoute/router");
const mongoDB = "mongodb://127.0.0.1:27017/batch08jan";
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use("/", appRoute);

mongoose.connect(mongoDB).then (() =>{
    console.log("DB connected");
    app.listen(3001, () => {
        console.log("server started at port 3001");
    });
}).catch((error) => {
    console.log(error);
});