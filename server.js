const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

const express = require('express');
const app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');


app.set('views', __dirname + '/views'); //select the view directory
app.set('view engine', 'ejs'); //set the ejs as a html rendering engine
app.engine('html', require('ejs').renderFile); //set the ejs as a html rendering engine

var server = app.listen(port, () => console.log(`Example app listening on ${port} port!`));

app.use(express.static('public')); //select the static files' path to public directory

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

var mainRouter = require('./router/main'); //select the router file
app.use('/', mainRouter);