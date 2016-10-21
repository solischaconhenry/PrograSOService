<?php

class Subir
{

    function insertar($string){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "delete from temp_table"; 
        pg_query($conn, $query) or die("Error al ejecutar la consulta");

        $res=$string;
        $res=explode(";",$res);

        foreach ($res as $Poligono) {
            $query = "insert into temp_table(geom) values( (SELECT ST_GeomFromText('MULTIPOLYGON((($Poligono)))', 5367)) );"; 
            pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }
    }

    function previsualizar(){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


        $query = "SELECT max(st_xmax(geom))-min(st_xmin(geom)) xinicial, max(st_ymax(geom))-min(st_ymin(geom)) yinicial FROM temp_table";
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
                       (SELECT gid, geom  FROM temp_table tab) s 
                   ) geometria,
                   (SELECT 
                       min(st_xmin(geom)) xinicial, 
                       (max(st_ymax(geom))-min(st_ymin(geom)))/480 factor,
                       min(st_ymin(geom)) yinicial 
                    FROM 
                       temp_table 
                   ) medidas; "; 
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
                       (SELECT gid, geom  FROM temp_table tab) s 
                   ) geometria,
                   (SELECT 
                       min(st_xmin(geom)) xinicial, 
                       (max(st_xmax(geom))-min(st_xmin(geom)))/480 factor,
                       min(st_ymin(geom)) yinicial 
                    FROM 
                       temp_table 
                   ) medidas; "; 
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

    function save($idUser){

        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


        $query = "select ST_Multi(st_union(geom)) geom from temp_table"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
        $geomFinca = $row[0];

        $query = "INSERT INTO fincas(idUser,geom) VALUES ($idUser,'$geomFinca');"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");


        $query = "select max(gid) from fincas"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
        $gidFinca = $row[0];



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



        $query = "SELECT  coalesce(MAX(numeroHistorico),0) AS max_id FROM historicos where gidFinca = $gidFinca"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
        $numHistorico = $row[0]+1;

        $query = "INSERT INTO historicos(numeroHistorico, gidFinca) VALUES($numHistorico, $gidFinca);"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        foreach ($arr_apartos_id as $id) {    
            $query = "INSERT INTO aparto_historico(idhistorico, gidAparto) VALUES( (SELECT MAX(idhistorico) FROM historicos), $id);"; 
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }

        return(1);
    }

    function upload(){
        $target_dir = "C:/xampp/htdocs/Fincas/";
        $target_file = $target_dir . basename($_FILES["file"]["name"]);

        move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);

        $jsonData=file_get_contents($target_file);

        return ($jsonData);
    }
}

$subir = new Subir();

if($_REQUEST['action']=='insert') {
    $subir->insertar($_REQUEST['string']);
}
else if($_REQUEST['action']=='preview') {
    print_r(json_encode($subir->previsualizar()));
}
else if($_REQUEST['action']=='save') {
    print_r($subir->save($_REQUEST['idUser']));
}
else if($_REQUEST['action']=='upload') {
     print_r($subir->upload());
}
?>