<?php

/**
 * Соединяемся с БД.
 *
 * @param string $host
 * @param string $port
 * @return array|MongoClient
 */
//function createDbConnect($host = 'localhost', $port = '27017') {
function createDbConnect($host = '192.168.56.1', $port = '27017') {
    try {
        $connection = new MongoClient("mongodb://{$host}:{$port}");

        return $connection;
    } catch (MongoConnectionException $e) {
        return array('error' => 1, 'msg' => "Ошибка соединения с БД.");
    }
}

/**
 * Выбираем коллекцию, (из | в) (которой будем читать данные | или писать данные)
 *
 * @param $db
 * @param $collection
 * @param string $host
 * @param string $port
 * @return array|MongoCollection
 */
function choseCollection($connection, $dbName, $collection, $day, $month, $yesr, $host = 'localhost', $port = '27017') {
    try {
        // выбираем БД
        $db = $connection->selectDB($dbName);

        $collection .= $day . ':' . $month . ':' . $yesr;
        // выбираем коллекцию
        $collection = $db->$collection;

        return $collection;
    } catch (MongoConnectionException $e) {

        $connection->close();

        return array('error' => 1, 'msg' => "Ошибка соединения с БД.");
    } catch (MongoException $e) {

        $connection->close();

        return array('error' => 1, 'msg' => $e->getMessage());
    }
}

/**
 *
 *
 * @param $connection
 * @param $dbName
 * @return array|string
 */
function choseSettingsCollection($connection, $dbName, $collectionName) {
    try {
        // выбираем БД
        $db = $connection->selectDB($dbName);

        // выбираем коллекцию
        $collection = $db->$collectionName;

        return $collection;
    } catch (MongoConnectionException $e) {

        $connection->close();

        return array('error' => 1, 'msg' => "Ошибка соединения с БД.");
    } catch (MongoException $e) {

        $connection->close();

        return array('error' => 1, 'msg' => $e->getMessage());
    }
}