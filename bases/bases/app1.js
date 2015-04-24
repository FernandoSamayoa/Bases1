var express = require('express');
//var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var pg = require("pg");

var app = express(),
    server = http.createServer(app) ,
    io = require('socket.io').listen(server);

var conString = "pg://postgres:050393@localhost:5432/mydatabase";

var client = new pg.Client(conString);
client.connect();

var routes = require('./routes/index');
var users = require('./routes/users');

//var app = express();

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(express.static(__dirname + '/public'));

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
function name_rutas(){

var query = client.query("SELECT * FROM \"CLIENTE\"");
query.on("row", function (row, result) {
    result.addRow(row);
});
query.on("end", function (result) {
    //console.log(JSON.stringify(result.rows, null, "    "));
    var tabla;
    tabla = JSON.stringify(result.rows, null, "    ");
    console.log(result.rows[0].NOMBRE);
    console.log(result.rows.length);
    client.end();
});
}

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

//server.listen(3000)

module.exports = app;

io.sockets.on('connection', function (socket) {
    console.log('A new user connected!');
    socket.on('rutas',function(data){
    socket.emit('rutasinfo',info());
    });
    socket.on('req_kill',function(data){   
    matar(data.my);
    });
    //socket.emit('info', { msg: 'The world is round, there is no up or down.' });
});



/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/
