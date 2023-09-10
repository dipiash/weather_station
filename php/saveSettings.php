<?php

function saveSettings($typeSetting, $values) {
    require_once('functions/db_connect.php');
    require_once('functions/insertData.php');

    $connection = createDbConnect();

    $collection = choseSettingsCollection($connection, 'weth', 'settings');

    if (is_object($collection)) {

        $insData = insertSettingsData($collection, $typeSetting, $values);
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
