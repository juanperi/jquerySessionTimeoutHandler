<?php
session_start();
// do whatever you need to destroy the session
$_SESSION = array('lastAccess' => 0);
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Session Timeout</title>
	</head>
	<body>
		<p>You are now logged out.</p>
	</body>
</html>