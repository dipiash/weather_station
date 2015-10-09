<?php

// Получаем запрос, удаляя пробелы и слеши в начале и конце строки
$request = trim($_SERVER["REQUEST_URI"], '/');

// на всякий случай декодируем
$request = urldecode($request);

// Разбиваем запрос на части
$parts = explode('/', $request);

$parts = array_filter($parts, 'trim');

if ($parts[0] == '') {
    require_once('php/getSettings.php');

    $arrSettings = getSettings();

    require_once('index.html');
    die();
}

if ($parts[1] == 'test') {
    require_once('php/testData.php');
    die;
}

if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    header('Content-Type: application/json');
    # обработка запроса на вставку данных
    # $parts[0] - pushData
    # $parts[1] - ['temp', 'humm', 'press', 'gas', 'light']
    # $parts[2] - value
    if ($parts[0] == 'pushData' AND in_array($parts[1], array('temp', 'humm', 'press', 'gas', 'light'))) {
        if (!isset($parts[2])) {
            $parts[2] = 0;
        }
        # подключаем файл для отправки данных
        require_once('php/pushDataController.php');

        $chekQuery = pushData($parts[1], $parts[2]);

        if (isset($chekQuery['error'])) {
            echo json_encode(array('error' => 1, 'msg' => $chekQuery['msg']));
            die();
        }

        echo json_encode(array('success' => 1));
        die();
    }

    # $parts[0] - getData
    # $parts[1] - ['temp', 'humm', 'press', 'gas', 'light']
    # $parts[2] - day
    # $parts[3] - month
    # $parts[4] - year

    if ($parts[0] == 'getData' AND in_array($parts[1], array('temp', 'humm', 'press', 'gas', 'light')) AND
        isset ($parts[2]) AND isset($parts[3]) AND
        isset($parts[4])) {

        # подключаем файл для запроса данных
        require_once('php/getData.php');
        $data = getData($parts[1], $parts[2], $parts[3], $parts[4]);

        echo json_encode($data);
        die();
    }

    if ($parts[0] == 'getData' AND $parts[1] == 'info') {
        require_once('php/getInfo.php');
        $data = getInfo();

        echo json_encode($data);
        die();
    }

    if ($parts[0] == 'saveSettings' AND in_array($parts[1], array('max', 'min'))) {

        if (!isset($_POST['val'])) {
            echo json_encode(array('error' => 1, 'msg' => 'Неверный запрос.'));
            die();
        }

        require_once('php/saveSettings.php');
        $chekQuery = saveSettings($parts[1], $_POST['val']);

        if (isset($chekQuery['error'])) {
            echo json_encode(array('error' => 1, 'msg' => $chekQuery['msg']));
            die();
        }

        echo json_encode(array('success' => 1));
        die();
    }

    if ($parts[0] == 'getSettings') {
        require_once('php/getSettings.php');

        $arrSettings = getSettings();

        echo json_encode($arrSettings);
        die();
    }

    echo json_encode(array('error' => 1, 'msg' => 'Неверный запрос #index.'));
} else {
    header("Location: /");
}