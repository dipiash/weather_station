<?php

function saveSettings($typeSetting, $values) {
    # подключаем функцию соединения с БД и выбора коллекции
    require_once('functions/db_connect.php');
    # подключаем функцию вставки данных в БД
    require_once('functions/insertData.php');

    $connection = createDbConnect();

    # выбираем коллекцию
    $collection = choseSettingsCollection($connection, 'weth', 'settings');

    if (is_object($collection)) {

        # записываем данные в коллекцию
        $insData = insertSettingsData($collection, $typeSetting, $values);
        if (isset($insData['error'])) {

            $connection->close();

            return array('error' => 1, 'msg' => $insData['msg']);
        }

        $connection->close();

        # если все прошло успешно
        return 1;
    }

    $connection->close();

    return array('error' => 1, 'msg' => $collection['msg']);
}