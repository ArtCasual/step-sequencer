<?php
// Retrieve the raw data from the request body
$data = file_get_contents('php://input');

// Check if data is present
if ($data) {
    $decodedData = json_decode($data, true);
    $arrayData = $decodedData['value'];
    $stringData = implode(",", $arrayData);

    // SERVER CONNECTION
    $servername = "localhost";
    $username = "root";
    $password = "";

    // Database and table names
    $dbToCreate = "step_sequencer";
    $tableToCreate = "sequences";

    $conn = new mysqli($servername, $username, $password);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Create the database if it doesn't exist
    $createDbQuery = "CREATE DATABASE IF NOT EXISTS $dbToCreate";
    if ($conn->query($createDbQuery) === TRUE) {
        echo "Database created or already exists successfully<br>";
    } else {
        echo "Error creating database: " . $conn->error . "<br>";
    }

    // Select the specified database
    $conn->select_db($dbToCreate);

    // Create the "sequences" table if it doesn't exist
    $createTableQuery = "CREATE TABLE IF NOT EXISTS $tableToCreate (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        steps TEXT NOT NULL
    )";
    
    if ($conn->query($createTableQuery) === TRUE) {
        echo "Table created or already exists successfully<br>";
    } else {
        echo "Error creating table: " . $conn->error . "<br>";
    }

    // SQL QUERIES
    $sql = "INSERT INTO $tableToCreate (`name`, `steps`) VALUES ('neo sequence', '$stringData')";

    if (mysqli_query($conn, $sql)) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    // Close the connection
    $conn->close();
} else {
    echo "No data received.";
}
?>
