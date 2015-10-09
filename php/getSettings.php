<?php

function getSettings()
{

    # подключаем функцию соединения с БД и выбора коллекции
    require_once('functions/db_connect.php');

    $connection = createDbConnect();

    # выбираем коллекцию
    $collection = choseSettingsCollection($connection, 'weth', 'settings');

    if (is_object($collection)) {

        $query = array();

        try {


            $valSettings = array(
                'max' => $collection->find(array('setting' => 'max')),
                'min' => $collection->find(array('setting' => 'min'))
            );

            $retData = array(
                'max' => array(),
                'min' => array()
            );

            foreach ($valSettings['max'] as $maxVal) {
                $retData['max'] = $maxVal['max'];
            }

            foreach ($valSettings['min'] as $minVal) {
                $retData['min'] = $minVal['min'];
            }

            $connection->close(true);

            return $retData;
        } catch (MongoCursorException $e) {

            $connection->close(true);

            return array('error' => 1, 'msg' => $e->getMessage());
        }
    }

    $connection->close(true);

    return array('error' => 1, 'msg' => $collection['msg']);
}