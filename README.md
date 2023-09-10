# Web Interface for Weather Station

##### This project was quickly put together with the aim of creating a prototype.

### Tools Used
- PHP/JS/HTML
- [Foundation](http://foundation.zurb.com/)
- [Chart.js](http://www.chartjs.org/)
- [MongoDb](https://www.mongodb.org/)

### Launch (Test Mode)
##### For Windows
  1. You can install [OpenServer](http://open-server.ru/).
  2. Place the project in the folder "%ROOT_DIR%\OpenServer\domains\"
  3. Run OpenServer with administrator rights.
  4. Set the used modules in OpenServer settings ("Settings"->"Modules"):
    - PHP 5.*
    - MongoDB 2.* or 3.*
    - Apache + Nginx
  5. Start the server: "Start"
  6. Open the address in the browser: "weather_station/"
  7. Open developer console: Ctrl + Shift + I
  8. Go to the Console tab.
  9. Insert and execute the following script, which will populate the database with test data:
    ```javascript
    // [The provided JavaScript code]
    ```
  10. Go to the "Settings" tab (gear icon) in the web interface and set the limiting parameters.
  11. Done. You can view statistics for all sensors and for each one separately (with charts).

#### Generating Parameters for Other Hours of the Current Date
1. Open the file "php/functions/insertData.php"
2. Find the line
   ```
   'date' => new MongoDate(strtotime(strftime(strftime("%Y-%m-%d %H:%M:%S", time() + 5 * 60 * 60))))
   ```
3. Change "+ 5" to other values.
4. Save.
5. Execute the script in the browser console as mentioned above.
