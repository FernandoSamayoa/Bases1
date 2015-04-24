var socket = io.connect(); 



//setInterval(function() {
    socket.emit('buses');
//}, 2000);

 socket.on('respuesta_buses', function (data) {
    total = JSON.stringify(data);
    console.log(data);
   // console.log(data);
    /*total = 100.00-Number(total);
    var telem = document.getElementById("porcentajeID");
    
    telem.value = total;*/
     var myTable= "<select id=\"celiminar\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].BUS+"\">"+data.rows[i].BUS+"</option>";
    }
    myTable+="<select>";
    var btn ="<input type='button' value='submit' onclick='eliminar()' />";


    var t = document.getElementById('tbus1');
    t.innerHTML = myTable+btn;

    myTable= "<select id=\"celiminar2\">";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<option value=\""+data.rows[i].BUS+"\">"+data.rows[i].BUS+"</option>";
    }
    myTable+="<select>";

    myTable+= "<select id=\"ctipo\">";
    myTable+="<option value=\"1\">Economico</option>";
    myTable+="<option value=\"2\">Empresarial</option>";
    myTable+="<select>";
    myTable+="<input type='button' value='submit' onclick='actualizar()' />";
    var t1 = document.getElementById('tbus2');
    t1.innerHTML = myTable;

    myTable="<input type='button' value='submit' onclick='agregar()' />";

    myTable+= "<select id=\"cadd\">";
    myTable+="<option value=\"1\">Economico</option>";
    myTable+="<option value=\"2\">Empresarial</option>";
    myTable+="<select>";
    var j = document.getElementById('tbus3');
    j.innerHTML = myTable;

});

 function eliminar(){
 	var e = document.getElementById("celiminar");
	var strUser = e.options[e.selectedIndex].value;
 	socket.emit('eliminar_bus',strUser);
 }
 function actualizar(){
 	var obj={};
var e = document.getElementById("celiminar2");
	var strUser = e.options[e.selectedIndex].value;
	obj["bus"] = strUser;
var d = document.getElementById("ctipo");
	var strUser2 = d.options[d.selectedIndex].value;
	obj["tipo"] = strUser2;
 	//console.log(obj);
 	socket.emit('actualizar_bus',obj);

 }

 function agregar(){
 	var e = document.getElementById("cadd");
	var strUser = e.options[e.selectedIndex].value;
 	socket.emit('agregar_bus',strUser);
 }