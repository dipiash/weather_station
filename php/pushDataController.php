<?php

function pushData($type, $value) {
    if (!is_numeric($value)) {
        return array('error' => 1, 'msg' => 'Incorrect data type in `value`.');
    }

    require_once('functions/db_connect.php');
    require_once('functions/insertData.php');

    $connection = createDbConnect();

    $collection = choseCollection($connection, 'weth', 'weth', date('j'), date('m'), date('y'));
    if (is_object($collection)) {

        $insData = insertData($collection, $type, $value);
        if (isset($insData['error'])) {

            $connection->close();

            return array('error' => 1, 'msg' => $insData['msg']);
        }

        $connection->close();

        return 1;
    }

    $connection->close();

    return array('error' => 1, 'msg' => $collection['msg']);
}
