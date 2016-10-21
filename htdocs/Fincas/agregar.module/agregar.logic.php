<?php

class Agregar
{
    function save($gidFinca){

        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


        $query = "update fincas set geom = (select st_union(t.geom, f.geom) geom from (select ST_Multi(st_union(geom)) geom from temp_table) t, fincas f where f.gid = $gidFinca) where gid = $gidFinca"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        
        return(1);
    }
}

$agregar = new Agregar();

if($_REQUEST['action']=='add') {
    $agregar->save($_REQUEST['gidFinca']);
}
?>