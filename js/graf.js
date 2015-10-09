// get now Date
var dateNow = new Date(),
    dayNow = dateNow.getDate(),
    monthNow = dateNow.getMonth() + 1,
    yearNow = dateNow.getFullYear();

// get div blocks for create canvas elements
var conteinerGrafData = {
        temp: $('#temp-graf'),
        humm: $('#humm-graf'),
        press: $('#press-graf'),
        gas: $('#gas-graf'),
        light: $('#light-graf')
    },

    grafData = getGrafData(), // get canvas blocks

    labelDays = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
        "22:00", "23:00"]; // array of hours of day

// options for graphic
var options = {
    fillColor: "rgba(47, 176, 255, 0.48)",
    strokeColor: "rgba(220,220,220,1)",
    pointColor: "rgba(47, 176, 255, 1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(220,220,220,1)"
};

var opt = { // gloval option for graphic
    animation: false
};

var dataForCanvas = { // data for sensor
    temp: {
        labels: labelDays,
        datasets: [
            {
                label: "�����������",
                fillColor: options.fillColor,
                strokeColor: options.strokeColor,
                pointColor: options.pointColor,
                pointStrokeColor: options.pointStrokeColor,
                pointHighlightFill: options.highlightFill,
                pointHighlightStroke: options.pointHighlightStroke,
                data: []
            }
        ]
    },
    humm: {
        labels: labelDays,
        datasets: [
            {
                label: "���������",
                fillColor: options.fillColor,
                strokeColor: options.strokeColor,
                pointColor: options.pointColor,
                pointStrokeColor: options.pointStrokeColor,
                pointHighlightFill: options.highlightFill,
                pointHighlightStroke: options.pointHighlightStroke,
                data: []
            }
        ]
    },
    press: {
        labels: labelDays,
        datasets: [
            {
                label: "��������",
                fillColor: options.fillColor,
                strokeColor: options.strokeColor,
                pointColor: options.pointColor,
                pointStrokeColor: options.pointStrokeColor,
                pointHighlightFill: options.highlightFill,
                pointHighlightStroke: options.pointHighlightStroke,
                data: []
            }
        ]
    },
    gas: {
        labels: labelDays,
        datasets: [
            {
                label: "��������������",
                fillColor: options.fillColor,
                strokeColor: options.strokeColor,
                pointColor: options.pointColor,
                pointStrokeColor: options.pointStrokeColor,
                pointHighlightFill: options.highlightFill,
                pointHighlightStroke: options.pointHighlightStroke,
                data: []
            }
        ]
    },
    light: {
        labels: labelDays,
        datasets: [
            {
                label: "������������",
                fillColor: options.fillColor,
                strokeColor: options.strokeColor,
                pointColor: options.pointColor,
                pointStrokeColor: options.pointStrokeColor,
                pointHighlightFill: options.highlightFill,
                pointHighlightStroke: options.pointHighlightStroke,
                data: []
            }
        ]
    }
};

/**
 * get canvas blocks
 *
 * @returns {{temp: (CanvasRenderingContext2D|jQuery), humm: (CanvasRenderingContext2D|jQuery), press: (CanvasRenderingContext2D|jQuery), gas: (CanvasRenderingContext2D|jQuery), light: (CanvasRenderingContext2D|jQuery)}}
 */
function getGrafData() {
    var grafData = {
        temp: $('#temperature').get(0).getContext("2d"),
        humm: $('#hummid').get(0).getContext("2d"),
        press: $('#press').get(0).getContext("2d"),
        gas: $('#gas').get(0).getContext("2d"),
        light: $('#light').get(0).getContext("2d")
    };

    return grafData;
}

function initGraf(type, day, month, year) {

    var dataRet = [];

    if (day < 10) {
        day = "0" + day;
    }

    if (month < 10) {
        month = "0" + month;
    }

    year += "";
    year = year.toString().substr(2, 2);

    var arrData = [];
    $.ajax({
        url: '/getData/' + type + '/' + day + '/' + month + '/' + year,
        dataType: 'json',
        success: function (data) {
            var data = data;
            var length = 24;

            if (data.length < 24) {
                length = data.length;
            }

            for (var j = 0; j < length; j++) {
                dataRet.push(Number(data[j].value));
            }

            init(type, dataRet);
        }
    });
}

function init(typeSensor, dataSensor) {
    if (typeSensor === 'temp') {
        dataForCanvas.temp.datasets[0].data = dataSensor;
        var tempChart = new Chart(grafData.temp).Line(dataForCanvas.temp, opt);
    }

    if (typeSensor === 'humm') {
        dataForCanvas.humm.datasets[0].data = dataSensor;
        var tempChart = new Chart(grafData.humm).Line(dataForCanvas.humm, opt);
    }

    if (typeSensor === 'press') {
        dataForCanvas.press.datasets[0].data = dataSensor;
        var tempChart = new Chart(grafData.press).Line(dataForCanvas.press, opt);
    }

    if (typeSensor === 'gas') {
        dataForCanvas.gas.datasets[0].data = dataSensor;
        var tempChart = new Chart(grafData.gas).Line(dataForCanvas.gas, opt);
    }

    if (typeSensor === 'light') {
        dataForCanvas.light.datasets[0].data = dataSensor;
        var tempChart = new Chart(grafData.light).Line(dataForCanvas.light, opt);
    }
}

window.onresize = function () {
    // flush canvas blocks
    conteinerGrafData.temp.empty();
    conteinerGrafData.humm.empty();
    conteinerGrafData.press.empty();
    conteinerGrafData.gas.empty();
    conteinerGrafData.light.empty();

    setTimeout(500);

    // create new canvas blocks
    conteinerGrafData.temp.append('<canvas id="temperature" class="large-12 column"></canvas>');
    conteinerGrafData.humm.append('<canvas id="hummid" class="large-12 column"></canvas>');
    conteinerGrafData.press.append('<canvas id="press" class="large-12 column"></canvas>');
    conteinerGrafData.gas.append('<canvas id="gas" class="large-12 column"></canvas>');
    conteinerGrafData.light.append('<canvas id="light" class="large-12 column"></canvas>');

    // get new canvas blocks
    grafData = getGrafData();

    setTimeout(500);

    // draw graphics
    tempChart = new Chart(grafData.temp).Line(dataForCanvas.temp, opt);
    setTimeout(100);
    hummChart = new Chart(grafData.humm).Line(dataForCanvas.humm, opt);
    setTimeout(100);
    pressChart = new Chart(grafData.press).Line(dataForCanvas.press, opt);
    setTimeout(100);
    gasChart = new Chart(grafData.gas).Line(dataForCanvas.gas, opt);
    setTimeout(100);
    lightChart = new Chart(grafData.light).Line(dataForCanvas.light, opt);
}

initGraf('temp', dayNow, monthNow, yearNow);
initGraf('humm', dayNow, monthNow, yearNow);
initGraf('press', dayNow, monthNow, yearNow);
initGraf('gas', dayNow, monthNow, yearNow);
initGraf('light', dayNow, monthNow, yearNow);