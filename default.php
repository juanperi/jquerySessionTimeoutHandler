<?php
session_start();
$_SESSION['lastAccess'] = time();
?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Session Timeout</title>
		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/ui-lightness/jquery-ui.css">
	</head>
	<body>
		<p>Test page</p>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
		<script src="epilgrimSessionTimeout.js"></script>
		<script>
			$(document).ready(function(){
				$('body').sessionTimeout({
					warnWhenLeft: 10000
				});
			});
		</script>
	</body>
</html>