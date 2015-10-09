<?php

/**
 * Получить данные для датчика.
 *
 * @param $type
 * @param $day
 * @param $month
 * @param $year
 * @return array|int
 */
function getData($type, $day, $month, $year)
{
    $dictionaryType = array('temp', 'humm', 'press', 'gas', 'light');

    if (!in_array($type, $dictionaryType)) {
        return array('error' => 1, 'msg' => 'Неверный тип датчика.');
    }

    # формируем строку год-месяц-день
    $strYMD = $year . "-" . $month . "-" . $day;

    # формируем временные интервалы
    $arrayTimeInterval = array();
    for ($i = 0; $i < 25; $i++) {
        if ($i < 10) {
            $hour = "0" . $i;
        } else {
            $hour = $i;
        }
        array_push($arrayTimeInterval, $strYMD . " " . $hour . ":00:00");
    }

    # подключаем функцию соединения с БД и выбора коллекции
    require_once('functions/db_connect.php');

    $connection = createDbConnect();

    $collection = choseCollection($connection, 'weth', 'weth', $day, $month, $year);

    if (is_object($collection)) {

//        # запрашиваем данные  по типу
//        $query = array('type' => $type);

        try {

            $arrData = array($type => array());
            # запрашиваем данные для каждого промежутка
            for ($i = 0; $i < count($arrayTimeInterval) - 1; $i++) {
                $start = new MongoDate(strtotime($arrayTimeInterval[$i]) + 3*60*60);
                $end = new MongoDate(strtotime($arrayTimeInterval[$i+1]) + 3*60*60);

                $query = array('type' => $type, 'date' => array('$gt' => $start, '$lte' => $end));

                $cursor = $collection->find($query);
                foreach ($cursor as $value) {
                    $arrData[$type][$i][] = $value['value'];
                }
            }

            $connection->close(true);

            # данные которые будет возвращать функуия
            $resultValue = array();

            # получаем ключи промежутков
            $keys = array_keys($arrData[$type]);

            for ($i = 0; $i < count($keys); $i++) {
                $sum = 0;
                $count = count($arrData[$type][$keys[$i]]);
                for ($k = 0; $k < $count; $k++) {
                    $sum += $arrData[$type][$keys[$i]][$k];
                }

                $res = $sum / $count;

                $resultValue[$keys[$i]] = $res;
            }

            return $resultValue;
        } catch (MongoCursorException $e) {

            $connection->close(true);

            return array('error' => 1, 'msg' => $e->getMessage());
        }
    }

    $connection->close(true);

    return array('error' => 1, 'msg' => $collection['msg']);
}