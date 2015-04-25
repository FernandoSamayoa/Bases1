var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');//'./routes/index'
var users = require('./routes/users');
var abc = require('./routes/abc');
var planificador = require('./routes/planificador');
var reserva = require('./routes/reserva');
var boleto = require('./routes/boleto');
var consulta = require('./routes/consulta');
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

var conString = "pg://postgres:050393@localhost:5432/practica";

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
app.use('/abc',abc);
app.use('/planificador',planificador);
app.use('/reserva',reserva);
app.use('/boleto',boleto);
app.use('/consulta',consulta);
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

    socket.on('clientes',function(data){
      var query = client.query("SELECT * FROM \"CLIENTE\"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_cliente', result);
        });
    });

        socket.on('rutas',function(data){
      var query = client.query("SELECT * FROM \"RUTA\"");
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

                socket.on('viajes',function(data){
      var query = client.query("SELECT * FROM \"VIAJE\"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_viaje', result);
        });
    });

                socket.on('paradas',function(data){
      var query = client.query("SELECT * FROM \"PARADA\"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_parada', result);
        });
    });

      socket.on('ruta_parada',function(data){
      var query = client.query("select R.\"NOMBRE\" as \"ruta\", P.\"NOMBRE\", RP.\"ORDEN\" FROM \"RUTA\" R, \"PARADA\" P, \"RUTA_PARADA\" RP WHERE RP.\"RUTA\" = R.\"RUTA\" AND RP.\"PARADA\" = P.\"PARADA\" ORDER BY(R.\"NOMBRE\") ");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_rutas_paradas', result);
        });

    });

    socket.on('parada_ruta',function(data){
      var query = client.query("select R.\"RUTA\",P.\"PARADA\", P.\"NOMBRE\" FROM \"RUTA\" R, \"PARADA\" P, \"RUTA_PARADA\" RP WHERE R.\"RUTA\" = "+data["ruta"]+" AND RP.\"RUTA\" = R.\"RUTA\" AND RP.\"PARADA\" = P.\"PARADA\"  ");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_paradas_ruta', result);
        });

    });

      socket.on('buses',function(data){
      var query = client.query("SELECT * FROM \"BUS\"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_buses', result);
        });
    });
      socket.on('eliminar_bus',function(data){
      var query = client.query("DELETE FROM \"ASIGNACION\" WHERE \"BUS\"="+data+";");
      query = client.query("DELETE FROM \"BUS\" WHERE \"BUS\"="+data+";");
      console.log("Bus eliminado!");       
    });

      socket.on('agregar_ruta_bus',function(data){
      var query = client.query("DELETE FROM \"ASIGNACION\" WHERE \"BUS\"="+data["bus"]+";");
      query = client.query("INSERT INTO \"ASIGNACION\" (\"BUS\", \"RUTA\") VALUES("+data["bus"]+","+data["ruta"]+");");
      console.log("Bus-ruta eliminado!");       
    });

    socket.on('actualizar_bus',function(data){
      var query = client.query("UPDATE \"BUS\" SET \"TIPO_BUS\" = "+data["tipo"]+" WHERE \"BUS\"="+data["bus"]+"; ");
      console.log("Bus Actualizado!");       
    });

    socket.on('agregar_bus',function(data){
      var query = client.query("INSERT INTO \"BUS\" (\"BUS\", \"TIPO_BUS\" ) VALUES(nextval('seq_bus'),"+data+");");
      console.log("Bus Ingresado!");       
    });

    socket.on('agregar_ruta_parada',function(data){
      var query = client.query("INSERT INTO \"RUTA_PARADA\" (\"RUTA\", \"PARADA\", \"ORDEN\" ) VALUES("+data["ruta"]+","+data["parada"]+","+data["orden"]+");");
      console.log("Parada agregada a ruta Ingresado!");       
    });

    socket.on('crear_viaje',function(data){
      var query = client.query("INSERT INTO \"VIAJE\" (\"VIAJE\",\"PRECIO\",\"RUTA\",\"INICIO\",\"FIN\")VALUES(nextval('seq_viaje'),"+data["precio"]+","+data["ruta"]+","+data["inicio"]+","+data["fin"]+");");
      console.log("Viaje Ingresado!");       
    });

        socket.on('costo',function(data){
      var query = client.query("select \"PRECIO\" FROM \"VIAJE\" WHERE \"VIAJE\" = "+data["viaje"]+";");
      query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_costo', result);
        });   
    });

    socket.on('up_factura',function(data){
      var query = client.query("UPDATE \"FACTURA\" SET \"TOTAL\" = "+data["costo"]+" WHERE \"FACTURA\" = "+data["no"]+";");
      for(var i=0;i<data["cantidad"];i++){
      query = client.query("INSERT INTO \"TICKET\" (\"TICKET\",\"CANCELADO\",\"DESCRIPCION\",\"VIAJE\",\"FACTURA\") VALUES(nextval('seq_ticket'),true,' ',"+data["viaje"]+","+data["no"]+");");
    }

    });

     socket.on('kilometraje',function(data){
      var query = client.query(" select R.\"RUTA\",P.\"PARADA\", P.\"NOMBRE\",P.\"LOCALIZACION\"FROM \"RUTA\" R,\"PARADA\" P, \"RUTA_PARADA\" RP WHERE R.\"RUTA\" = "+data["ruta"]+" AND RP.\"RUTA\" = R.\"RUTA\" AND RP.\"PARADA\" = P.\"PARADA\"  AND (P.\"PARADA\" = "+data["inicio"]+"OR P.\"PARADA\" = "+data["fin"]+")");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);
            socket.emit('respuesta_kilometraje', result);
        });
    });

    socket.on('crear_factura',function(data){
      var query = client.query("INSERT INTO \"FACTURA\" (\"FACTURA\",\"VIAJE\",\"CLIENTE\") VALUES(nextval('seq_factura'),"+data["viaje"]+","+data["usuario"]+")");
    console.log("factura creada");
    console.log(data);
    query = client.query("SELECT last_value as \"v\" FROM seq_factura;");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);

            socket.emit('respuesta_factura', result);
        });
    });

        socket.on('facturas',function(data){
      var query = client.query("SELECT * FROM \"FACTURA\" WHERE \"CLIENTE\"= "+data["usuario"]+"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);

            socket.emit('rfac', result);
        });
    });

     socket.on('getviaje',function(data){
      var query = client.query("SELECT \"VIAJE\" FROM \"FACTURA\" WHERE \"FACTURA\"= "+data["factura"]+"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);

            socket.emit('rviaj', result);
        });
    });

          socket.on('vinfo',function(data){
      var query = client.query("SELECT * FROM \"VIAJE\" WHERE \"VIAJE\" = "+data["viaje"]+"");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);

            socket.emit('r_vinfo', result);
        });
    });

     socket.on('fst_tabla',function(data){
      var query = client.query("select R.\"RUTA\",P.\"PARADA\", P.\"NOMBRE\", RP.\"ORDEN\" FROM \"RUTA\" R, \"PARADA\" P, \"RUTA_PARADA\" RP WHERE R.\"RUTA\" = "+data["ruta"]+"AND RP.\"RUTA\" = R.\"RUTA\" AND RP.\"PARADA\" = P.\"PARADA\"  ");
     query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);

            socket.emit('r_fst_tabla', result);
        });
    });

          socket.on('scnd_tabla',function(data){
            var x = parseInt(data["cinicio"]);
            var y = parseInt(data["cfin"]);
            if(x < y){
              console.log("inicio menor que final");
      var query = client.query("select R.\"RUTA\",P.\"PARADA\", P.\"NOMBRE\", RP.\"ORDEN\" FROM \"RUTA\" R, \"PARADA\" P, \"RUTA_PARADA\" RP WHERE R.\"RUTA\" = "+data["ruta"]+"AND RP.\"RUTA\" = R.\"RUTA\" AND RP.\"PARADA\" = P.\"PARADA\" AND RP.\"ORDEN\" <= "+ data["cfin"]+"AND RP.\"ORDEN\" >= "+data["cinicio"]);
    }else{
      console.log("final menor que inicio");
      var query = client.query("select R.\"RUTA\",P.\"PARADA\", P.\"NOMBRE\", RP.\"ORDEN\" FROM \"RUTA\" R, \"PARADA\" P, \"RUTA_PARADA\" RP WHERE R.\"RUTA\" = "+data["ruta"]+"AND RP.\"RUTA\" = R.\"RUTA\" AND RP.\"PARADA\" = P.\"PARADA\" AND RP.\"ORDEN\" <= "+ data["cinicio"]+"AND RP.\"ORDEN\" >= "+data["cfin"]);
     }query.on('row', function(row,result) {
            //console.log(row);
            //socket.emit('respuesta_ruta', row);
           result.addRow(row);
        });
     query.on('end', function(result) {
            //console.log(result.rows);

            socket.emit('r_scnd_tabla', result);
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

