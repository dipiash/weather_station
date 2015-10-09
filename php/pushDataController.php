<?php

# вставка данных пришедших с дачиков в БД
function pushData($type, $value) {
    # проверям, что `value` число
    if (!is_numeric($value)) {
        return array('error' => 1, 'msg' => 'Неверный тип данных в `value`.');
    }

    # подключаем функцию соединения с БД и выбора коллекции
    require_once('functions/db_connect.php');
    # подключаем функцию вставки данных в БД
    require_once('functions/insertData.php');

    $connection = createDbConnect();

    # выбираем коллекцию
    $collection = choseCollection($connection, 'weth', 'weth', date('j'), date('m'), date('y'));
    if (is_object($collection)) {

        # записываем данные в коллекцию
        $insData = insertData($collection, $type, $value);
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