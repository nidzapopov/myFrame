
<?php
	require_once(dirname(__FILE__) . "/dbconfig.php");
	$result_array = array();

	$upit=$_POST['action'];
	
	if($upit=="getAll"){
		$table = $_POST['table'];
		try{
			$sql = 'SELECT * FROM `'.$table.'` ';
			$result = $conn->query($sql);
			if ($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
					array_push($result_array, $row);
				}
				echo json_encode($result_array);
			}else{
				array_push($result_array, 'error');	
				echo json_encode($result_array);
			}
		}catch(PDOException $e){
	        echo $e->getMessage();
	    }
	}else if($upit=="save"){
		$table = $_POST['table'];
		try{
			$array = array();
			$arraySec = array();
			foreach ($_POST as $value => $element) {
				if($value == 'table' || $value == 'action'){
					unset($_POST[$value]);
				}else{
					array_push($array, $value );
					array_push($arraySec, $element );
				}
			}
			$comma_separated = implode(",", $array);
			$comma_separatedSec = implode("','", $arraySec);
			$comma_separatedSec = "'".$comma_separatedSec."'";
			$sql = 'INSERT INTO `'.$table.'` (id,'.$comma_separated.') VALUES ( NULL,'.$comma_separatedSec.' )';
			
			if ($conn->query($sql) === TRUE){
				array_push($result_array, $conn->insert_id);
				echo json_encode($result_array);
			}else{
				array_push($result_array, 'error');
				echo json_encode($result_array);
			}
		}catch(PDOException $e){
	        echo $e->getMessage();
	    }
	}else if($upit=="update"){
		$table = $_POST['table'];
		try{
			$array = array();
			$id = $_POST['id'];
			foreach ($_POST as $value => $element) {
				$str = '';
				if($value == 'table' || $value == 'action' || $value == 'id'){
					unset($_POST[$value]);
				}else{
					array_push($array, $value.'="'.$element.'"');
				}
			}
			$implodeArray = implode(', ', $array);
			$sql = 'UPDATE `'.$table.'` SET '.$implodeArray.' WHERE id="'.$id.'"';
			if ($conn->query($sql) === TRUE){
				array_push($result_array, 'ok');
				echo json_encode($result_array);
			}else{
				array_push($result_array, 'error');
				echo json_encode($result_array);
			}
			
		}catch(PDOException $e){
	        echo $e->getMessage();
	    }
	}else if($upit=="delete"){
		$table = $_POST['table'];
		try{
			$id = $_POST['id'];
			$sql = 'DELETE FROM `'.$table.'` WHERE id="'.$id.'"  ';
			if ($conn->query($sql) === TRUE){
				array_push($result_array, 'ok');
				echo json_encode($result_array);
			}else{
				array_push($result_array, 'error');
				echo json_encode($result_array);
			}
		}catch(PDOException $e){
	        echo $e->getMessage();
	    }
	}else if($upit=="singleImg"){
		$temp = explode(".", $_FILES["file"]["name"]);
		$newfilename = $_POST['name'];
		$id = $_POST['id'];
		$ext = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
		if (0 < $_FILES['file']['error']) {
			array_push($result_array, 'error');
			echo json_encode($result_array);
		} else {
			if (file_exists('uploads/'.$id)) {
				move_uploaded_file($_FILES["file"]["tmp_name"],'uploads/'.$id.'/'.$newfilename);
			} else {
				mkdir('uploads/'.$id, 0777, true);
				move_uploaded_file($_FILES["file"]["tmp_name"],'uploads/'.$id.'/'.$newfilename);
			}
			array_push($result_array, 'ok');
			echo json_encode($result_array);
		}
	}

	$conn->close();
?>