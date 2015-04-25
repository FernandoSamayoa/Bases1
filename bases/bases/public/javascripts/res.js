var socket = io.connect(); 

 socket.emit('clientes');
  socket.emit('rutas');

 var informacion = {};
socket.on('respuesta_cliente', function (data) {
     var myTable= "<select id=\"usuario\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].CLIENTE+"\">"+data.rows[i].NOMBRE+"</option>";
    }
    myTable+="<select>"; 

var t1 = document.getElementById('rutausuario');
t1.innerHTML = myTable;
});

socket.on('respuesta_ruta', function (data) {
     var myTable= "<select id=\"ruta\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].RUTA+"\">"+data.rows[i].NOMBRE+"</option>";
    }
    myTable+="<select>";


    myTable+="<input type='button' value='submit' onclick='show()' />";
var t2 = document.getElementById('rutausuario2');
t2.innerHTML = myTable;
});

socket.on('respuesta_paradas_ruta', function (data) {
     var myTable= "Parada Inicio <select id=\"inicio\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].PARADA+"\">"+data.rows[i].NOMBRE+"</option>";
    }
    myTable+="<select>";

    myTable+= "Parada Fin <select id=\"fin\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].PARADA+"\">"+data.rows[i].NOMBRE+"</option>";
    }
    myTable+="<select>";

    myTable+="<input type='button' value='submit' onclick='send_trip()' />";
var t2 = document.getElementById('area_bus');
t2.innerHTML = myTable;
});


socket.on('respuesta_kilometraje', function (data) {

	if(data.rows[0].LOCALIZACION.value > data.rows[1].LOCALIZACION.value)
	{
		informacion["precio"] = data.rows[0].LOCALIZACION - data.rows[1].LOCALIZACION
	}else{
		informacion["precio"] = data.rows[1].LOCALIZACION - data.rows[0].LOCALIZACION
	}
     console.log(informacion);
     //creamos el viejo recien hecho
     socket.emit('crear_viaje',informacion);
});


function show(){
	var e = document.getElementById("usuario");
	var strUser = e.options[e.selectedIndex].value;
	informacion["usuario"]=strUser;
	e = document.getElementById("ruta");
	strUser = e.options[e.selectedIndex].value;
	informacion["ruta"]= strUser;
	document.getElementById('rutausuario').style.visibility= "hidden" ;
	document.getElementById('rutausuario2').style.visibility= "hidden" ;
	document.getElementById('area_bus').style.visibility= "visible" ;
	//console.log(informacion);
	socket.emit('parada_ruta',informacion);
}

function send_trip(){
	var e = document.getElementById("inicio");
	var strUser = e.options[e.selectedIndex].value;
	informacion["inicio"]=strUser;
	e = document.getElementById("fin");
	strUser = e.options[e.selectedIndex].value;
	informacion["fin"]= strUser;
	if(informacion["inicio"]!=informacion["fin"]){
		//console.log(informacion);
		socket.emit('kilometraje',informacion);
	}else{
		console.log("No hay viaje que reservar")
	}
}