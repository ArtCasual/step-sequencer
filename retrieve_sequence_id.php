<?php
// Replace these variables with your database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "step-sequencer";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Replace 'your_table' with your actual table name and 'your_condition_here' with your condition to retrieve the ID
$sql_select = "SELECT id FROM sequences WHERE your_condition_here";
$result = $conn->query($sql_select);

if ($result->num_rows > 0) {
    // Fetch the result
    $row = $result->fetch_assoc();
    $id = $row["id"];

    // Output the retrieved ID
    echo "Retrieved ID: " . $id;

    // Delete the record with the retrieved ID
    $sql_delete = "DELETE FROM sequences WHERE id = $id";
    if ($conn->query($sql_delete) === TRUE) {
        echo "Record with ID $id deleted successfully";
    } else {
        echo "Error deleting record: " . $conn->error;
    }
} else {
    echo "No records found";
}

// Close the connection
$conn->close();
?>