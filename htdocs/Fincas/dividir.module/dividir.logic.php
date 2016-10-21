<?php

class Dividir
{
    function getFincas($idUsuario){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select gid from fincas where iduser = $idUsuario"; 
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }
    
    
    function getPreview($gidFinca){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


        $query = "SELECT max(st_xmax(geom))-min(st_xmin(geom)) xinicial, max(st_ymax(geom))-min(st_ymin(geom)) yinicial FROM apartos where gidfinca = $gidFinca";
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);

        if($row[0] < $row[1]){
            $query = "
                SELECT 	gid, 
                    ((geometria.x - medidas.xinicial)/medidas.factor) x, 
                    (480 - ((geometria.y - medidas.yinicial)/medidas.factor)) y 
                FROM 
                   (SELECT 
                    gid, 
                    st_x((ST_DumpPoints(geom)).geom) x, 
                    st_y((ST_DumpPoints(geom)).geom) y 
                    FROM 
                       (SELECT gid, geom  FROM apartos tab where gidfinca = $gidFinca and estado = 0) s 
                   ) geometria,
                   (SELECT 
                       min(st_xmin(geom)) xinicial, 
                       (max(st_ymax(geom))-min(st_ymin(geom)))/480 factor,
                       min(st_ymin(geom)) yinicial 
                    FROM 
                       apartos
                    where gidfinca = $gidFinca and estado = 0
                   ) medidas;"; 
        }
        else{
            $query = "
                SELECT 	gid, 
                    ((geometria.x - medidas.xinicial)/medidas.factor) x, 
                    (480 - ((geometria.y - medidas.yinicial)/medidas.factor)) y 
                FROM 
                   (SELECT 
                    gid, 
                    st_x((ST_DumpPoints(geom)).geom) x, 
                    st_y((ST_DumpPoints(geom)).geom) y 
                    FROM 
                       (SELECT gid, geom  FROM apartos tab where gidfinca = $gidFinca and estado = 0) s 
                   ) geometria,
                   (SELECT 
                       min(st_xmin(geom)) xinicial, 
                       (max(st_xmax(geom))-min(st_xmin(geom)))/480 factor,
                       min(st_ymin(geom)) yinicial 
                    FROM 
                       apartos
                    where gidfinca = $gidFinca and estado = 0 
                   ) medidas;"; 
        }

        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        $gid = '';
        $pointPolygonArray = array();

        while ($row =  pg_fetch_row($result))
        {
            if($gid == '')
            {
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);                        
            }
            else if($gid == $row[0])
            {
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);  
            }
            else
            {   
                $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

                $pointPolygonArray = array();
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);  
            }
        }

        $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

        return($geojson);
    }
    
    
    function separar($gidAparto, $gidFinca){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        
        $arr_apartos_id = [];

        $query = "select geom from temp_table"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        while ($row =  pg_fetch_row($result))
        {
            $geom = $row[0];
            $query = "INSERT INTO apartos(gidfinca, estado, geom) VALUES ($gidFinca, 0,'$geom');";
            pg_query($conn, $query) or die("Error al ejecutar la consulta");


            $query1 = "select max(gid) from apartos"; 
            $rowA = pg_query($conn, $query1) or die("Error al ejecutar la consulta");
            $max_aparto =  pg_fetch_row($rowA);
            $arr_apartos_id[] = $max_aparto[0];

        }
        
        
        $query = "Update apartos set estado = 1 where gid = $gidAparto"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        
        foreach ($arr_apartos_id as $id) {    
            $query = "INSERT INTO aparto_aparto(gidanterior, gidactual) VALUES($gidAparto, $id);"; 
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }


        $query = "SELECT  coalesce(MAX(numeroHistorico),0) AS max_id FROM historicos where gidFinca = $gidFinca"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
        $numHistorico = $row[0]+1;

        $query = "INSERT INTO historicos(numeroHistorico, gidFinca) VALUES($numHistorico, $gidFinca);"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        
        
        
        
        
        $arr_apartos_activos = [];

        $query = "SELECT * from apartos where gidFinca = $gidFinca and estado = 0"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        while ($row =  pg_fetch_row($result))
        {
            $arr_apartos_activos[] = $row[0];
        }
        
        foreach ($arr_apartos_activos as $id) {    
            $query = "INSERT INTO aparto_historico(idhistorico, gidAparto) VALUES( (SELECT MAX(idhistorico) FROM historicos), $id);"; 
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }

        return(1);
    }
        
}

$dividir = new Dividir();

if($_REQUEST['action']=='getFincas') {
    print_r(json_encode($dividir->getFincas($_REQUEST['idUser'])));
}
else if($_REQUEST['action']=='preview') {
    print_r(json_encode($dividir->getPreview($_REQUEST['gidFinca'])));
}
else if($_REQUEST['action']=='divide') {
    print_r(json_encode($dividir->separar($_REQUEST['gidAparto'], $_REQUEST['gidFinca'])));
}

