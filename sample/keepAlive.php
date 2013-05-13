<?php
session_start();
// The user will never see this page.
// It's only used to keep the user's session alive.

$_SESSION['lastAccess'] = time();
// 60 seconds = 1 minute -> duration of the session
echo json_encode(20);
