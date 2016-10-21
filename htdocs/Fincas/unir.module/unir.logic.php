<?php

class Unir
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
        
    function unirApartos($gidFinca,$arrayApartos){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");
            
        
        
        //INSERTAR NUEVO APARTO UNIDO
        $query = "INSERT INTO apartos(gidfinca, estado, geom) VALUES ($gidFinca, 0, (select st_multi(st_union(geom)) from apartos where gid in ($arrayApartos)))";
        pg_query($conn, $query) or die("Error al ejecutar la consulta");
        
        $arrayApartosId=explode(",",$arrayApartos);
        
        //ACTUALIZAR ESTADOS
        foreach ($arrayApartosId as $id) {    
            $query = "Update apartos set estado = 1 where gid = $id"; 
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }
        
        //OBTENER ULTIMO APARTO, QUE SERIA LA NUEVA UNION 
        $query1 = "select max(gid) from apartos"; 
        $rowA = pg_query($conn, $query1) or die("Error al ejecutar la consulta");
        $max_aparto =  pg_fetch_row($rowA);
        
        
        //INSERTAR EN APARTOAPARTO LA RELACION DE DONDE VIENE EL NUEVO APARTO PARA HISTORIAL
        foreach ($arrayApartosId as $id) {    
            $query = "INSERT INTO aparto_aparto(gidanterior, gidactual) VALUES($id, $max_aparto[0])"; 
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }
        
        //INSERTAR UN NUEVO HISTORICO 
        $query = "SELECT  coalesce(MAX(numeroHistorico),0) AS max_id FROM historicos where gidFinca = $gidFinca"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
        $numHistorico = $row[0]+1;

        $query = "INSERT INTO historicos(numeroHistorico, gidFinca) VALUES($numHistorico, $gidFinca)"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        
        //INSERCION EN SEGMENTO HISTORICO
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
        return ($arrayApartosId);
    }
}

$unir = new Unir();

if($_REQUEST['action']=='getFincas') {
    print_r(json_encode($unir->getFincas($_REQUEST['idUser'])));
}
else if($_REQUEST['action']=='preview') {
    print_r(json_encode($unir->getPreview($_REQUEST['gidFinca'])));
}
else if($_REQUEST['action']=='unir') {
    print_r(json_encode($unir->unirApartos($_REQUEST['gidFinca'],$_REQUEST['arrayAparto'])));
}

