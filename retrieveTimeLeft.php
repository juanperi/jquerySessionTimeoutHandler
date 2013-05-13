<?php
session_start();
// The user will never see this page.
// It's only used to keep the user's session alive.

// 60 seconds is the duration of the session
// time() - $_SESSION['lastAccess'] gets how much time is left
echo json_encode(20 - (time() - $_SESSION['lastAccess']));
