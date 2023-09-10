<?php

// https://php.net/manual/ru/class.mongodate.php

$day = date('j');
$month = date('m');
$year = date('y');

$strYMD = $year."-".$month."-".$day;

$arrayTimeInterval = array();
for ($i = 0; $i < 25; $i++) {
    if ($i < 10) {
        $hour = "0".$i;
    } else {
        $hour = $i;
    }
    array_push($arrayTimeInterval, $strYMD." ".$hour.":00:00");
}

echo "Time intervals:<br>";
print_r($arrayTimeInterval);
echo "<hr>";

require_once('php/functions/db_connect.php');

$connection = createDbConnect();
$collection = choseCollection($connection, 'weth', 'weth', date('j'), date('m'), date('y'));

//$start = new MongoDate(strtotime(strftime("%Y-%m-%d %H:%M:%S", time() + 5*60*60)));
//$end = new MongoDate(strtotime(strftime("%Y-%m-%d %H:%M:%S", time() + 7*60*60)));

# запрашиваем данные для каждого промежутка
for ($i = 0; $i < count($arrayTimeInterval) - 1; $i++) {
    $start = new MongoDate(strtotime($arrayTimeInterval[$i]) + 3*60*60);
    $end = new MongoDate(strtotime($arrayTimeInterval[$i+1]) + 3*60*60);

    $query = array('type' => 'temp', 'date' => array('$gt' => $start, '$lte' => $end));

    $cursor = $collection->find($query);
    $arrData = array();
    foreach ($cursor as $value) {
        $arrData[] = $value['value'];
    }


    echo "time-interval: ".$arrayTimeInterval[$i]." -- ".$arrayTimeInterval[$i+1]."<br>";
    print_r($arrData);
    echo "<hr>";
}

$connection->close(true);
