<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "step_sequencer";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Assuming your table is named "your_table" and the column to match is "id"
$id_to_delete = 123; // replace with the actual ID you want to delete

// SQL query to delete the entry
$sql = "DELETE FROM sequences WHERE id = $id_to_delete";

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: " . $conn->error;
}

// Close connection
$conn->close();
?>
