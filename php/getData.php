<?php

/**
 * Get data from sensor
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

    # format string year-month-day
    $strYMD = $year . "-" . $month . "-" . $day;

    # formad time ranges
    $arrayTimeInterval = array();
    for ($i = 0; $i < 25; $i++) {
        if ($i < 10) {
            $hour = "0" . $i;
        } else {
            $hour = $i;
        }
        array_push($arrayTimeInterval, $strYMD . " " . $hour . ":00:00");
    }

    # connect the function of connecting to the database and selecting a collection
    require_once('functions/db_connect.php');

    $connection = createDbConnect();

    $collection = choseCollection($connection, 'weth', 'weth', $day, $month, $year);

    if (is_object($collection)) {
        try {

            $arrData = array($type => array());
            # request data for each interval
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

            # data that the function will return
            $resultValue = array();

            # the keys of the intervals
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
