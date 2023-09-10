;
(function ($) {
    'use strict';

    var titleGraf = $('.grafpanel > .titlegraf'), // title of graph panel
        infoPanel = $('.info'), // information panel
        grafPanel = $('.graf'), // graphic panel
        settingsPanel = $('.settings'), // settings panel

        labelDays = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00",
            "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
            "22:00", "23:00", "00:00"], // array contains hours
        options = { // options for graphic
            fillColor: "rgba(47, 176, 255, 0.48)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(47, 176, 255, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)"
        },
        opt = { // global option for graphic
            animation: false
        },
        dataForCanvas = { // data for sensor
            sensor: {
                labels: labelDays,
                datasets: [
                    {
                        label: "1111",
                        fillColor: options.fillColor,
                        strokeColor: options.strokeColor,
                        pointColor: options.pointColor,
                        pointStrokeColor: options.pointStrokeColor,
                        pointHighlightFill: options.highlightFill,
                        pointHighlightStroke: options.pointHighlightStroke,
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
                    }
                ]
            }
        },
        graph = $('#graph_dr').get(0).getContext("2d"),
        graphBlock = $('#graf-block'),

    // info -- now values of sensor
        infoTempVal = $('.tempVal .value'),
        infoHummVal = $('.hummVal .value'),
        infoPressVal = $('.pressVal .value'),
        infoGasVal = $('.gasVal .value'),
        infoLightVal = $('.lightVal .value'),

    // erros view for panel info
       errTemp = $('.tempVal').find('.bl-err'),
       errHumm = $('.hummVal').find('.bl-err'),
       errPress = $('.pressVal').find('.bl-err'),
       errGas = $('.gasVal').find('.bl-err'),
       errLight = $('.lightVal').find('.bl-err'),

    // preloader
        infoPreloader = $('.info .preload'),
        graphPreloader = $(' .preload'),

    // control selected date
        dayVal = $('.val-day'),
        monthVal = $('.val-month'),
        yearVal = $('.val-year'),

    // date
        dateNow = new Date(),
        dayNow = dateNow.getDate(),
        monthNow = dateNow.getMonth() + 1,
        yearNow = dateNow.getFullYear().toString().substr(2, 2),
        stopFlag_date = 0, // set flag to 1? where date get first

        // select date
        dayBtn = $('#day').find('li a'),
        monthBtn = $('#month').find('li a'),
        yearBtn = $('#year').find('li a'),

        // select date variable
        daySel = '',
        monthSel = '',
        yearSel = '',
        sensorSel = '',

        // settings input
        maxInputs = $('#maxValues').find('input'),
        minInputs = $('#minValues').find('input'),

        // save btns for settings
        saveMax = $('.saveMax'),
        saveMin = $('.saveMin');

// click of nav panel
    $(document).on('click', '.ajax-nav', function (e) {
        e.preventDefault();

        // set active class for nav element
        $('.ajax-nav').removeClass('active');
        $(this).addClass('active');

        var url = $(this).attr('href'),
            typeSensor = $(this).data('sensor');

            sensorSel = typeSensor;

        if (stopFlag_date === 0) {
            dayNow = dayNow < 10 ? "0" + dayNow : dayNow;
            monthNow = monthNow < 10 ? "0" + monthNow : monthNow;
            stopFlag_date = 1;
        }

        // create a query url
        url += createGetUrl('', '', dayNow, monthNow, yearNow);

        if (typeSensor === 'all') { // info panel
            grafPanel.hide();
            settingsPanel.hide();
            infoPanel.show();

            updateData(url, 1);
        } else if (typeSensor === 'setting') {
            grafPanel.hide();
            infoPanel.hide();
            settingsPanel.show();
            createTitleGraf(typeSensor);
            getSettings();

        } else { // sensor graphic
            infoPanel.hide();
            settingsPanel.hide();
            grafPanel.show();
            createTitleGraf(typeSensor);

            updateData(url, 0);
        }

        return false;
    });

    function drawGraph() {
        // flush canvas blocks
        graphBlock.empty();
        // create new canvas blocks
        graphBlock.append('<canvas id="graph_dr" class="large-12 column"></canvas>');
        // get new canvas blocks
        graph = $('#graph_dr').get(0).getContext("2d");
        // draw graphics
        var tempChart = new Chart(graph).Line(dataForCanvas.sensor, opt);
    }

    /**
     * Create url to send query for get data.
     *
     * @param typeQuery string
     * @param typeSensor string ['temp', 'press', 'humm', 'gas', 'light']
     * @param day
     * @param month
     * @param year
     * @returns {string}
     */
    function createGetUrl(typeQuery, typeSensor, day, month, year) {
        if (typeQuery == '' && typeSensor == '') {
            return parseInt(day) + '/' + parseInt(month) + '/' + year;
        }

        return typeQuery + '/' + typeSensor + '/' + parseInt(day) + '/' + parseInt(month) + '/' + year;
    }

    /**
     * get data of url
     * typeData = [0 - graph, 1 - info]
     *
     * @param url
     * @returns {json}
     */
    function updateData(url, typeData) {

        if (typeData === 1) {
            infoPreloader.show();
        }

        if (typeData === 0) {
            graphPreloader.show();
        }

        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            success: function (data) {
                var dt = data;

                if (typeData === 0) { // typeData = 0 -- sensor data
                    var length = 25,
                        dataGet = [];

                    for (var j = 0; j < length; j++) {
                        var val = Number(dt[j]) || '';
                        dataGet[j] = val;
                    }

                    // updateData
                    dataForCanvas.sensor.datasets[0].data = dataGet;
                    // draw graph
                    drawGraph();

                    // redraw graph on resize window
                    window.onresize = function () {
                        drawGraph();
                    }

                    graphPreloader.hide();
                }

                if (typeData === 1) { // typeData = 1 -- info -- values
                    // set new values

                    infoTempVal.text(dt.temp);
                    if ((dt.temp > Number(maxInputs[0].value) && maxInputs[0].value != '') ||
                        (dt.temp < Number(minInputs[0].value) && minInputs[0].value != '')) {
                        errTemp.show();
                        console.log('temp: ' + dt.temp + ' -- max: ' + maxInputs[0].value + ' -- min: ' + minInputs[0].value);
                    } else {
                        errTemp.hide();
                    }

                    infoHummVal.text(dt.humm);
                    if ((dt.humm > Number(maxInputs[1].value) && maxInputs[1].value != '') ||
                        (dt.humm < Number(minInputs[1].value) && minInputs[1].value != '')) {
                        errHumm.show();
                        console.log('humm: ' + dt.humm + ' -- max: ' + maxInputs[1].value + ' -- min: ' + minInputs[1].value);
                    } else {
                        errHumm.hide();
                    }

                    infoPressVal.text(dt.press);
                    if ((dt.press > Number(maxInputs[2].value) && maxInputs[2].value != '') ||
                        (dt.press < Number(minInputs[2].value) && minInputs[2].value != '')) {
                        errPress.show();
                        console.log('press: ' + dt.press + ' -- max: ' + maxInputs[2].value + ' -- min: ' + minInputs[2].value);
                    } else {
                        errPress.hide();
                    }

                    infoGasVal.text(dt.gas);
                    if ((dt.gas > Number(maxInputs[3].value) && maxInputs[3].value != '') ||
                        (dt.gas < Number(minInputs[3].value) && minInputs[3].value != '')) {
                        errGas.show();
                        console.log('gas: ' + dt.gas + ' -- max: ' + maxInputs[3].value + ' -- min: ' + minInputs[3].value);
                    } else {
                        errGas.hide();
                    }

                    infoLightVal.text(dt.light);
                    if ((dt.light > Number(maxInputs[4].value) && maxInputs[4].value != '') ||
                        (dt.light < Number(minInputs[4].value) && minInputs[4].value != '')) {
                        errLight.show();
                        console.log('light: ' + dt.light + ' -- max: ' + maxInputs[4].value + ' -- min: ' + minInputs[4].value);
                    } else {
                        errLight.hide();
                    }

                    infoPreloader.hide();
                }
            }
        })
    }

    /**
     * set title for now graph sensor
     *
     * @param title
     */
    function createTitleGraf(title) {
        var header = 'Chart of ',
            sensor = '';

        switch (title) {
            case 'temp':
                sensor = 'temperature';
                break

            case 'humm':
                sensor = 'humidity';
                break

            case 'press':
                sensor = 'pressure';
                break

            case 'gas':
                sensor = 'gas pollution';
                break

            case 'light':
                sensor = 'illumination';
                break;

            case 'setting':
                header = 'Settings: ';
                sensor = 'acceptable indicators';
                break;
        }

        titleGraf.text(header + sensor);
    }


    dayBtn.on('click', function() {
        var value = $(this).data('value'),
            url = '/getData';

        dayVal.text(value);
        daySel = value;

        url += createGetUrl('', sensorSel, daySel, monthSel, yearSel);

        console.log(url);

        updateData(url, 0);
    });

    monthBtn.on('click', function() {
        var value = $(this).data('value'),
            url = '/getData';

        monthVal.text(value);
        monthSel = value;

        url += createGetUrl('', sensorSel, daySel, monthSel, yearSel);

        updateData(url, 0);
    });

    yearBtn.on('click', function() {
        var value = $(this).data('value'),
            url = '/getData';

        yearVal.text(value);
        yearSel = value;

        url += createGetUrl('', sensorSel, daySel, monthSel, yearSel);

        updateData(url, 0);
    });

    /**
     * save settings function
     *
     * @param typeSettings
     * @param dataSettings
     * @param countSettings
     */
    function sendSettings(typeSettings, dataSettings, countSettings) {
        var data = {},
            svMx = saveMax.find('.preload'),
            svMn = saveMin.find('.preload'),
            svMxErr = saveMax.find('.error'),
            svMnErr = saveMin.find('.error');

        for (var i = 0; i < countSettings; i++) {
            data[dataSettings[i].name] = dataSettings[i].value;
        }

        $.ajax({
            type: "POST",
            data: {val : JSON.stringify(data)},
            url: 'saveSettings/' + typeSettings,
            dataType: "json",
            success: function(data) {
                if (data.success === 1) {
                    if (typeSettings === 'max') {
                        svMx.hide();
                        svMxErr.hide();
                    }

                    if (typeSettings === 'min') {
                        svMn.hide();
                        svMnErr.hide();
                    }
                }

                if (data.error === 1) {
                    if (typeSettings === 'max') {
                        svMx.hide();
                        svMxErr.show();
                    }

                    if (typeSettings === 'min') {
                       svMn.hide();
                       svMnErr.show();
                    }
                }
            }
        });
    }

    /**
     * get settings for sensors
     */
    function getSettings() {
        $.ajax({
            type: "GET",
            url: '/getSettings/',
            dataType: 'json',
            success: function(data) {
                var dt = data;

                maxInputs[0].value = dt.max.temp;
                maxInputs[1].value = dt.max.humm;
                maxInputs[2].value = dt.max.press;
                maxInputs[3].value = dt.max.gas;
                maxInputs[4].value = dt.max.light;

                minInputs[0].value = dt.min.temp;
                minInputs[1].value = dt.min.humm;
                minInputs[2].value = dt.min.press;
                minInputs[3].value = dt.min.gas;
                minInputs[4].value = dt.min.light;

                maxInputs = $('#maxValues').find('input');
                minInputs = $('#minValues').find('input');
            }
        });
    }

    saveMax.on('click', function() {
        maxInputs = $('#maxValues').find('input');
        $(this).find('.preload').show();
        sendSettings('max', maxInputs, 5);

    });

    saveMin.on('click', function() {
        minInputs = $('#minValues').find('input');
        $(this).find('.preload').show();
        sendSettings('min', minInputs, 5);
    });


    //--------------------------------------------------/
    updateData('/getData/info/', 1);
    setInterval(function () {
        updateData('/getData/info/', 1);
    }, 5000);

    daySel = dayNow < 10 ? "0" + dayNow : dayNow;
    monthSel = monthNow < 10 ? "0" + monthNow : monthNow;
    yearSel = yearNow;

    dayVal.text(daySel);
    monthVal.text(monthSel);
    yearVal.text(yearSel);

}(jQuery))
