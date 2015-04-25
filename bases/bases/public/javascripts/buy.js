var socket = io.connect(); 

 socket.emit('clientes');
  socket.emit('viajes');

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

socket.on('respuesta_viaje', function (data) {
     var myTable= "<select id=\"viaje\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].VIAJE+"\">"+data.rows[i].VIAJE+"</option>";
    }
    myTable+="<select>";

    myTable+= "<select id=\"cantidad\">";

    var tam = data.rows.length;
    for (var i=0; i<11; i++) {
    myTable+="<option value=\""+i+"\">"+i+"</option>";
    }
    myTable+="<select>";

    myTable+="<input type='button' value='submit' onclick='show()' />";
var t2 = document.getElementById('rutausuario2');
t2.innerHTML = myTable;
});


socket.on('respuesta_factura', function (data) {
     informacion["no"]=data.rows[0].v;
     console.log(informacion);
     socket.emit('costo',informacion);
});

socket.on('respuesta_costo', function (data) {
     informacion["costo"]=informacion["cantidad"] * data.rows[0].PRECIO
     console.log(informacion);
     socket.emit('up_factura',informacion);
});



function show(){
	var e = document.getElementById("usuario");
	var strUser = e.options[e.selectedIndex].value;
	informacion["usuario"]=strUser;
	e = document.getElementById("viaje");
	strUser = e.options[e.selectedIndex].value;
	informacion["viaje"]= strUser;
  e = document.getElementById("cantidad");
  strUser = e.options[e.selectedIndex].value;
  informacion["cantidad"]= strUser;
	document.getElementById('rutausuario').style.visibility= "hidden" ;
	document.getElementById('rutausuario2').style.visibility= "hidden" ;
	document.getElementById('area_bus').style.visibility= "visible" ;
	//console.log(informacion);
	socket.emit('crear_factura',informacion);
}
/*
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
}*/