<?php
function getInfo() {
    $dictionaryType = array('temp', 'humm', 'press', 'gas', 'light');

    # подключаем функцию соединения с БД и выбора коллекции
    require_once('functions/db_connect.php');

    $connection = createDbConnect();

    $collection = choseCollection($connection, 'weth', 'weth', date('j'), date('m'), date('y'));
    if (is_object($collection)) {
        try {
            $retData = array();

            for ($i = 0; $i < count($dictionaryType); $i++) {
                # запрашиваем данные  по типу
                $query = array('type' => $dictionaryType[$i]);

                $cursor = $collection->find($query)->sort(array("_id" => -1))->limit(1);
                foreach ($cursor as $value) {
                    $retData[$dictionaryType[$i]] = $value['value'];
                }
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