# Веб интерфейс для погодной станции

### Используемые интсрументы
- PHP/JS/HTML
- [Foundation](http://foundation.zurb.com/)
- [Chart.js](http://www.chartjs.org/)
- [MongoDb](https://www.mongodb.org/)

### Запуск (тестовый режим)
##### Для windows
  1. Можно установить [OpenServer](http://open-server.ru/).
  2. Положить проект в папку "%ROOT_DIR%\OpenServer\domains\"
  3. Запустить OpenServer с правами администратора
  4. Установить в настрйоках OpenServer используемые модули ("Настройки"->"Модули"):
    - PHP 5.*
    - MongoDB 2.* или 3.*
    - Apche + Nginx
  5. Запустить сервер: "Запустить"
  6. Открыть адрес в браузере: "weather_station/"
  7. Открыть консоль разработчика: Ctrl + Shift + I
  8. Перейти на вкладку Console
  9. Вставить и исполнить следующий скрипт, который заполнить БД тестовыми данными:
    ```
    function generateValues(min, max, flag) {
    var type = Math.floor(Math.random() * (2)) + 1;

    console.log('type= ' + type)

     // генерировать отрицательные
        if (type === 1) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        if (flag === 1 && type === 2) {
            return -(Math.floor(Math.random() * (max - min + 1)) + min);
        } else {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        return 0;
    }

    function generateType(type) {
        //var type = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

        var retType = '';
        if (type === 1) {
            retType = 'temp';
        }

        if (type === 2) {
            retType = 'humm';
        }

        if (type === 3) {
            retType = 'press';
        }

        if (type === 4) {
            retType = 'gas';
        }

        if (type === 5) {
            retType = 'light';
        }

        return retType;
    }

    function generateData(type) {
        var arrayData = [];

        for (var i = 0; i < 24; i++) {
            var tmpData = {
                type: '',
                value: ''
            };

            tmpData.type = generateType(type);

            if (tmpData.type === 'temp') {
                tmpData.value = generateValues(-100, 70, 1);
            }

            if (tmpData.type === 'humm') {
                tmpData.value = generateValues(0, 99, 0);
            }

            if (tmpData.type === 'press') {
                tmpData.value = generateValues(850, 950, 0);
            }

            if (tmpData.type === 'gas') {
                tmpData.value = generateValues(0, 5, 0);
            }

            if (tmpData.type === 'light') {
                tmpData.value = generateValues(0, 200, 0);
            }

            arrayData.push(tmpData);
        }

        for (var i = 0; i < 24; i++) {
            $.ajax({
                url: '/pushData/' + arrayData[i].type + '/' + arrayData[i].value,
                dataType: 'json'
            }).done(function(data) {
                console.log(data);
            });
        }
    }

    generateData(1);
    generateData(2);
    generateData(3);
    generateData(4);
    generateData(5);
    ```
  10. Перейти на вкладку "Настройки" (шестеренка) в веб интерфейсе и установить ограничивающие параметры
  11. Готово. Можно смотреть статистику по всем датчикам и по каждому в отдельности (с графиками)

#### Генерация параметров за другие часы текущей даты
1. Открыть файл  "php/functions/insertData.php"
2. Найти строку
```
'date' => new MongoDate(strtotime(strftime(strftime("%Y-%m-%d %H:%M:%S", time() + 5 * 60 * 60))))
```
3. Изменяя "+ 5" на другие значения
4. Сохраняем
5. Выполняем скрипт в консоле браузера указанный выше
