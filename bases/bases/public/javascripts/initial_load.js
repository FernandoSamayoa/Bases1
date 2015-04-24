var socket = io.connect(); 


setInterval(function() {
     socket.emit('rutas');
}, 2000);

 socket.on('respuesta_ruta', function (data) {
    total = JSON.stringify(data);
    console.log(data);
   // console.log(data);
    /*total = 100.00-Number(total);
    var telem = document.getElementById("porcentajeID");
    
    telem.value = total;*/
     var myTable= "<table><tr><td style='width: 200px; color: red;'>Nombre</td>";
    myTable+="<td style='width: 400px; color: red; text-align: right;'>Fecha Nacimiento</td></tr>";

    myTable+="<tr><td style='width: 200px;                   '>---------------</td>";
    myTable+="<td     style='width: 400px; text-align: right;'>---------------</td></tr>";

    var tam = data.rows.length;
    for (var i=0; i<tam; i++) {
    myTable+="<td style='width: 200px; text-align: right;'>" + data.rows[i].NOMBRE + "</td>";
    myTable+="<td style='width: 400px; text-align: right;'>" + data.rows[i].FECHA_NACIMIENTO + "</td></tr>";

    }

    var t = document.getElementById('tclient');
    t.innerHTML = myTable;

});