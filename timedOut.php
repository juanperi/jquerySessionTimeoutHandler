<?php
session_start();
// do whatever you need to destroy the session
$_SESSION = array();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Session Timeout</title>
	</head>
	<body>
		<p>Your session was timed out.</p>
	</body>
</html>