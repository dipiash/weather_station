<?php

/**
 * Вставляем данные в коллекцию.
 * type - тип датчика
 *      -- 'temp' - температура
 *      -- 'humm' - влажность
 *      -- 'press' - давление
 *      -- 'gas' - загазованность
 *      -- 'light' - освещенность
 *
 * @param $collection
 * @param $type
 * @param $value
 * @return array|int
 */
function insertData($collection, $type, $value)
{
    $dictionaryType = array('temp', 'humm', 'press', 'gas', 'light');

    if (!in_array($type, $dictionaryType)) {
        return array('error' => 1, 'msg' => 'Неверный тип датчика.');
    }

    $data = array(
        '_id' => new MongoId(),
        'type' => $type,
        'value' => $value,
        'date' => new MongoDate(strtotime(strftime(strftime("%Y-%m-%d %H:%M:%S", time() + 5 * 60 * 60))))
    );

    try {
        $collection->insert($data);

        return 1;
    } catch (MongoException $e) {
        return array('error' => 1, 'msg' => $e->getMessage());
    }
}

/**
 * Сохранить настроки для датчиков
 *
 * @param $collection
 * @param $typeSettings
 * @param $values
 * @return array|int
 */
function insertSettingsData($collection, $typeSettings, $values)
{
    $dictionaryType = array('max', 'min');

    if (!in_array($typeSettings, $dictionaryType)) {
        return array('error' => 1, 'msg' => 'Неверные параметры.');
    }

    $values = json_decode($values, true);

    foreach ($values as $val) {
        if (!is_numeric($val)) {

            if (strlen(trim($val)) == 0) {
                $val = trim($val);
            } else {
                return array('error' => 1, 'msg' => "Не допустимое значение.");
            }

        }
    }

    $data = array(
        '_id' => new MongoId(),
        'setting' => $typeSettings,
        $typeSettings => array(
            'temp' => $values['temp'],
            'humm' => $values['humm'],
            'press' => $values['press'],
            'gas' => $values['gas'],
            'light' => $values['light']
        )
    );

    try {
        # проверка на существование настроек
        $query = array('setting' => $typeSettings);
        $cursor = $collection->find($query);

        $count = 0;
        foreach ($cursor as $value) {
            if (isset($value['setting'])) {
                $count++;
            }
        }

        # если настройки существуют, то обновляем
        if ($count == 1) {
            $query = array('$set' => array(
                $typeSettings => array(
                    'temp' => $values['temp'],
                    'humm' => $values['humm'],
                    'press' => $values['press'],
                    'gas' => $values['gas'],
                    'light' => $values['light'])
            ));

            $collection->update(array('setting' => $typeSettings), $query);
        }

        # если настроек нет, то вставляем данные
        if ($count == 0) {
            $collection->insert($data);
        }

        return 1;
    } catch (MongoException $e) {
        return array('error' => 1, 'msg' => $e->getMessage());
    }
}