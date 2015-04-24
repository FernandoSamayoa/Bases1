var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');//'./routes/index'
var users = require('./routes/users');
/*var procesos = require('./routes/procesos');
var memoria = require('./routes/memoria');*/
var fs = require('fs');//
var sys = require('sys')
var exec = require('child_process').exec;
var pg = require("pg");
var infor = {idle: 0};
var proc = {dt: 0};
var app = express(),
    server = http.createServer(app) ,
    io = require('socket.io').listen(server);

var conString = "pg://postgres:050393@localhost:5432/mydatabase";

var client = new pg.Client(conString);
client.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
/*app.use('/procesos',procesos);
app.use('/memoria',memoria);*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



// client.query("CREATE TABLE IF NOT EXISTS emps(firstname varchar(64), lastname varchar(64))");
// client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);
// client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Mayor', 'McCheese']);
/*
var query = client.query("SELECT * FROM \"CLIENTE\"");
query.on("row", function (row, result) {
    result.addRow(row);
});
query.on("end", function (result) {
    //console.log(JSON.stringify(result.rows, null, "    "));
    var tabla;
    tabla = JSON.stringify(result.rows, null, "    ");
    //console.log(result.rows[0].NOMBRE);
    //console.log(result.rows.length);
    //proc.dt = result;
    //console.log(proc.dt);
    client.end();
});*/


server.listen(3000)

module.exports = app;

io.sockets.on('connection', function (socket) {
    console.log('A new user connected!');
    socket.on('rutas',function(data){
      var query = client.query("SELECT * FROM \"CLIENTE\"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_ruta', result);
        });
    });
    socket.on('req_kill',function(data){   
    matar(data.my);
    });
    //socket.emit('info', { msg: 'The world is round, there is no up or down.' });
});
/*
io.sockets.on('req_meminfo', function (data) {
    console.log(data);
    socket.emit('meminfo', JSON.stringify(info()));
});*/

