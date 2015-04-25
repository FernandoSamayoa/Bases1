var socket = io.connect();

socket.emit('ruta_parada');
socket.emit('rutas');
socket.emit('paradas');
socket.emit('buses');


socket.on('respuesta_rutas_paradas', function (data) {
    total = JSON.stringify(data);
    console.log(data);
   // console.log(data);
    /*total = 100.00-Number(total);
    var telem = document.getElementById("porcentajeID");
    
    telem.value = total;*/
     var myTable= "<table><tr><td style='width: 200px; color: red;'>Nombre Ruta</td>";
    myTable+="<td style='width: 400px; color: red; text-align: right;'>Nombre Parada</td>";
        myTable+="<td style='width: 100px; color: red; text-align: right;'>Orden</td></tr>";

    myTable+="<tr><td style='width: 200px;                   '>---------------</td>";
    myTable+="<td     style='width: 200px; text-align: right;'>---------------</td>";
    myTable+="<td     style='width: 200px; text-align: right;'>---------------</td></tr>";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<td style='width: 200px; text-align: right;'>" + data.rows[i].ruta + "</td>";
    myTable+="<td style='width: 200px; text-align: right;'>" + data.rows[i].NOMBRE + "</td>";
    myTable+="<td style='width: 200px; text-align: right;'>" + data.rows[i].ORDEN + "</td></tr>";

    }

    var t = document.getElementById('tablarutas');
    t.innerHTML = myTable;

    myTable="<input type='text' id='nruta'/>"
    myTable+="<input type='button' value='submit' onclick='agregar_r()' />";
   var z = document.getElementById('area_ruta');
    z.innerHTML = myTable;

});

 socket.on('respuesta_ruta', function (data) {
    total = JSON.stringify(data);
    console.log(data);
   // console.log(data);
    /*total = 100.00-Number(total);
    var telem = document.getElementById("porcentajeID");
    
    telem.value = total;*/
     var myTable = "<select id=\"cruta\">";
      var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
     myTable+="<option value=\""+data.rows[i].RUTA+"\">"+data.rows[i].NOMBRE+"</option>";

    }
    myTable+="<select>";

  

    var t = document.getElementById('ddlrutas');
    t.innerHTML = myTable;

    myTable = "<select id=\"cruta2\">";
    for (var i=0; i<tam; i++) {
     myTable+="<option value=\""+data.rows[i].RUTA+"\">"+data.rows[i].NOMBRE+"</option>";

    }
    myTable+="<select>";

     var a = document.getElementById('area_bus');
    a.innerHTML = myTable;

});

  socket.on('respuesta_buses', function (data) {
    total = JSON.stringify(data);
    console.log(data);
   // console.log(data);
    /*total = 100.00-Number(total);
    var telem = document.getElementById("porcentajeID");
    
    telem.value = total;*/
     var myTable = "<select id=\"cbus2\">";
      var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
     myTable+="<option value=\""+data.rows[i].BUS+"\">"+data.rows[i].BUS+"</option>";

    }
    myTable+="<select>";

    myTable+="<input type='button' value='submit' onclick='agregar_b()' />";

     var z = document.getElementById('mi_bus');
    z.innerHTML = myTable;

});

  socket.on('respuesta_parada', function (data) {
    total = JSON.stringify(data);
    console.log(data);
   // console.log(data);
    /*total = 100.00-Number(total);
    var telem = document.getElementById("porcentajeID");
    
    telem.value = total;*/
     var myTable = "<select id=\"cparada\">";
      var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
     myTable+="<option value=\""+data.rows[i].PARADA+"\">"+data.rows[i].NOMBRE+"</option>";

    }
    myTable+="<select>";

  

 

    myTable += "<select id=\"corden\">";
     myTable+="<option value=\"1\">1</option>";
    myTable+="<option value=\"2\">2</option>";
     myTable+="<option value=\"3\">3</option>";
    myTable+="<option value=\"4\">4</option>";
     myTable+="<option value=\"5\">5</option>";
    myTable+="<option value=\"6\">6</option>";
     myTable+="<option value=\"7\">7</option>";
    myTable+="<option value=\"8\">8</option>";
     myTable+="<option value=\"9\">9</option>";
    myTable+="<option value=\"10\">10</option>";
    myTable+="<select>";

     myTable+="<input type='button' value='submit' onclick='agregar_pr()' />";
   var t = document.getElementById('ddlparadas');
    t.innerHTML = myTable;
});



function agregar_pr(){
	var obj={};
var e = document.getElementById("cruta");
	var strUser = e.options[e.selectedIndex].value;
	obj["ruta"] = strUser;
var d = document.getElementById("cparada");
	var strUser2 = d.options[d.selectedIndex].value;
	obj["parada"] = strUser2;

	var o = document.getElementById("corden");
	var strUser3 = o.options[o.selectedIndex].value;
	obj["orden"] = strUser3;
 	console.log(obj);
 	socket.emit('agregar_ruta_parada',obj);

}

function agregar_b(){
	var obj={};
var e = document.getElementById("cruta2");
	var strUser = e.options[e.selectedIndex].value;
	obj["ruta"] = strUser;
var d = document.getElementById("cbus2");
	var strUser2 = d.options[d.selectedIndex].value;
	obj["bus"] = strUser2;

 	console.log(obj);
 	socket.emit('agregar_ruta_bus',obj);

}

function agregar_r(){
    var valor = document.getElementById('nruta').value;
    
    socket.emit('agregar_ruta',valor)
}