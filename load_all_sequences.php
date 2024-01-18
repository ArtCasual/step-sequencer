<?php

$servername = "localhost"; 
 $username = "root"; 
 $password = ""; 
 $dbname = "step_sequencer";

 $conn = new mysqli($servername, $username, $password, $dbname);

 if ($conn->connect_error) {
     die("Connection failed: " . $conn->connect_error);
 }

// SQL query to retrieve data
$query = "SELECT * FROM sequences";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $sequences = array();
    // Loop through the results and fetch each row
    while ($row = mysqli_fetch_assoc($result)) {
        $sequences[] = $row;
    }
} else {
    $sequences = null;
}

// Close the database connection
$conn->close();

// Return the data as JSON
echo json_encode($sequences);

 ?>