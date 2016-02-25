var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

//fakes
var fakeLog  = require('./routes/fake/log');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function(req, res, next) {//fake cros
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//livereload
app.use('/', fakeLog);

if(app.get('env') == 'development'){
    app.use(require('connect-livereload')());
}

app.get(/^\/event\/\w*$/, function (req,res,next) {
    res.sendFile(__dirname+'/app/index.html');
});

app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use('/docs',express.static(path.join(__dirname, 'docs')));
app.use('/config',express.static(path.join(__dirname, 'config')));
//app.use('/fakedocs',express.static(path.join(__dirname, 'fakedocs')));
app.use('/css_example',express.static(path.join(__dirname, 'css_example')));

//test
//app.get(/^\/dist\/(?!(images|css|log)).*/, function (req,res,next) {
//    res.sendFile(__dirname+'/app/dist/index.html');
//});

app.get(/^\/(?!(images|css|log|source)).*/, function (req,res,next) {
    res.sendFile(__dirname+'/app/index.html');
});

module.exports = app;