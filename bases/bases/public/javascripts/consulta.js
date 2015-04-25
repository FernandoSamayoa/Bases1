var socket = io.connect(); 

 socket.emit('clientes');

 var informacion = {};
socket.on('respuesta_cliente', function (data) {
     var myTable= "<select id=\"usuario\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].CLIENTE+"\">"+data.rows[i].NOMBRE+"</option>";
    }
    myTable+="<select>"; 
myTable+="<input type='button' value='submit' onclick='show()' />";
var t1 = document.getElementById('rutausuario');
t1.innerHTML = myTable;
});


socket.on('rfac', function (data) {
     var myTable= "<select id=\"factura\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].FACTURA+"\">"+data.rows[i].FACTURA+"</option>";
    }
    myTable+="<select>"; 
myTable+="<input type='button' value='submit' onclick='showall()' />";
var t1 = document.getElementById('area_bus');
t1.innerHTML = myTable;
});

socket.on('rviaj', function (data) {
     
	informacion["viaje"]=data.rows[0].VIAJE;
	socket.emit("vinfo",informacion);
	console.log(informacion);
});

socket.on('r_vinfo', function (data) {
     
	informacion["ruta"]=data.rows[0].RUTA;
	informacion["inicio"]=data.rows[0].INICIO;
	informacion["fin"]=data.rows[0].FIN;
	informacion["precio"]=data.rows[0].PRECIO;
	socket.emit("fst_tabla",informacion);
	console.log(informacion);
});
socket.on('r_fst_tabla', function (data) {
     

	 var myTable= "<table><tr><td style='width: 200px; color: red;'>Nombre</td>";
    myTable+="<td style='width: 400px; color: red; text-align: right;'>Orden</td></tr>";

    myTable+="<tr><td style='width: 200px;                   '>---------------</td>";
    myTable+="<td     style='width: 400px; text-align: right;'>---------------</td></tr>";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<td style='width: 200px; text-align: right;'>" + data.rows[i].ORDEN + "</td>";
    myTable+="<td style='width: 400px; text-align: right;'>" + data.rows[i].NOMBRE + "</td></tr>";
    if(data.rows[i].PARADA == informacion["inicio"])	
    	informacion["cinicio"]=data.rows[i].ORDEN
    if(data.rows[i].PARADA == informacion["fin"])
    	informacion["cfin"]=data.rows[i].ORDEN

    }

    var t = document.getElementById('mi_bus');
    t.innerHTML = myTable;
	console.log(informacion);
	socket.emit("scnd_tabla",informacion);
});


socket.on('r_scnd_tabla', function (data) {
     
	/*informacion["ruta"]=data.rows[0].RUTA;
	informacion["inicio"]=data.rows[0].INICIO;
	informacion["fin"]=data.rows[0].FIN;
	informacion["precio"]=data.rows[0].PRECIO;
	socket.emit("fst_tabla",informacion);*/
console.log(data);
	 var myTable= "Tu recorrido fue el sisguiente: </br> <table><tr><td style='width: 200px; color: red;'>Nombre</td>";
    myTable+="<td style='width: 400px; color: red; text-align: right;'>Orden</td></tr>";

    myTable+="<tr><td style='width: 200px;                   '>---------------</td>";
    myTable+="<td     style='width: 400px; text-align: right;'>---------------</td></tr>";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<td style='width: 200px; text-align: right;'>" + data.rows[i].ORDEN + "</td>";
    myTable+="<td style='width: 400px; text-align: right;'>" + data.rows[i].NOMBRE + "</td></tr>";

    }

    myTable+="Total: "+informacion["precio"];
    var t = document.getElementById('mi_bus2');
    t.innerHTML = myTable;
	console.log(informacion);
	//socket.emit("scnd_tabla",informacion);
});

function show(){
	document.getElementById('rutausuario').style.visibility= "hidden" ;
	document.getElementById('rutausuario2').style.visibility= "hidden" ;
	document.getElementById('area_bus').style.visibility= "visible" ;
	var e = document.getElementById("usuario");
	var strUser = e.options[e.selectedIndex].value;
	informacion["usuario"]=strUser;
	socket.emit("facturas",informacion);

}

function showall(){
	document.getElementById('area_bus').style.visibility= "hidden" ;
	document.getElementById('mi_bus').style.visibility= "visible" ;
	document.getElementById('mi_bus2').style.visibility= "visible" ;
	var e = document.getElementById("factura");
	var strUser = e.options[e.selectedIndex].value;
	informacion["factura"]=strUser;
	socket.emit("getviaje",informacion);
	console.log("SHOWALL");
}