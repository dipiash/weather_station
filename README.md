# Веб интерфейс для погодной станции

### Используемые интсрументы
- PHP/JS/HTML
- [Foundation](http://foundation.zurb.com/)
- [Chart.js](http://www.chartjs.org/)
- [MongoDb](https://www.mongodb.org/)

### Запуск (тестовый режим)
- #### Для windows
  - Можно установить [OpenServer](http://open-server.ru/).
  - Положить проект в папку "%ROOT_DIR%\OpenServer\domains\"
  - Запустить OpenServer с правами администратора
  - Установить в настрйоках OpenServer используемые модули ("Настройки"->"Модули"):
    - PHP 5.*
    - MongoDB 2.* или 3.*
    - Apche + Nginx
  - Запустить сервер: "Запустить"
  - Открыть адрес в браузере [weather_station/](weather_station/)
  - 
