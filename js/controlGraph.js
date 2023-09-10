var grpBtns = {
    temp: $('#tempBtns'),
    humm: $('#hummBtns'),
    press: $('#pressBtns'),
    gas: $('#gasBtns'),
    light: $('#lightBtns')
};

/**
 * create group buttons for view data of interest day
 *
 * @param sensorTypes
 * @param balocks
 */
function createBtnGroup(sensorTypes) {
    // get now Date
    var dateNow = new Date(),
        dayNow = dateNow.getDate(),
        monthNow = dateNow.getMonth() + 1,
        yearNow = dateNow.getFullYear();

    if (dayNow < 10) {
        dayNow = "0" + dayNow;
    }

    if (monthNow < 10) {
        monthNow = "0" + monthNow;
    }

    yearNow += "";
    yearNow = yearNow.toString().substr(2, 2);

    for (var i = 0; i < sensorTypes.length; i++) {
        var group = '<li> \
                    <button href="#" data-dropdown="' + sensorTypes[i] + 'Day" aria-controls="' + sensorTypes[i] + 'Day" aria-expanded="false" \
                    class="small button dropdown">Choose the day\
                    </button>\
                    <br>\
                    <ul id="' + sensorTypes[i] + 'Day" data-dropdown-content class="f-dropdown days" aria-hidden="true">\
                        <div style="overflow-y: auto; height: 200px;">\
                            <li>1</li>\
                            <li>2</li>\
                            <li>3</li>\
                            <li>4</li>\
                            <li>5</li>\
                            <li>6</li>\
                            <li>7</li>\
                            <li>8</li>\
                            <li>9</li>\
                            <li>10</li>\
                            <li>11</li>\
                            <li>12</li>\
                            <li>13</li>\
                            <li>14</li>\
                            <li>15</li>\
                            <li>16</li>\
                            <li>17</li>\
                            <li>18</li>\
                            <li>19</li>\
                            <li>20</li>\
                            <li>21</li>\
                            <li>22</li>\
                            <li>23</li>\
                            <li>24</li>\
                            <li>25</li>\
                            <li>26</li>\
                            <li>27</li>\
                            <li>28</li>\
                            <li>29</li>\
                            <li>30</li>\
                            <li>31</li>\
                        </div>\
                    </ul>\
                    </li>\
                <li>\
                    <button href="#" data-dropdown="' + sensorTypes[i] + 'Month" aria-controls="' + sensorTypes[i] + 'Month" aria-expanded="false"\
                    class="small button dropdown">Choose the month\
                    </button>\
                    <br>\
                    <ul id="' + sensorTypes[i] + 'Month" data-dropdown-content class="f-dropdown months" aria-hidden="true">\
                        <div style="overflow-y: auto; height: 200px;">\
                            <li>1</li>\
                            <li>2</li>\
                            <li>3</li>\
                            <li>4</li>\
                            <li>5</li>\
                            <li>6</li>\
                            <li>7</li>\
                            <li>8</li>\
                            <li>9</li>\
                            <li>10</li>\
                            <li>11</li>\
                            <li>12</li>\
                        </div>\
                    </ul>\
                </li>\
                <li>\
                    <button href="#" data-dropdown="' + sensorTypes[i] + 'Year" aria-controls="' + sensorTypes[i] + 'Month" aria-expanded="false"\
                    class="small button dropdown">Choose the year\
                    </button>\
                    <br>\
                    <ul id="' + sensorTypes[i] + 'Year" data-dropdown-content class="f-dropdown years" aria-hidden="true" style="max-height: 200px; overflov-y: auto;">\
                        <div style="overflow-y: auto; height: 200px;">\
                            <li>2014</li>\
                            <li>2015</li>\
                            <li>2016</li>\
                            <li>2017</li>\
                            <li>2018</li>\
                            <li>2019</li>\
                            <li>2020</li>\
                            <li>2021</li>\
                            <li>2022</li>\
                            <li>2023</li>\
                            <li>2024</li>\
                            <li>2025</li>\
                            <li>2026</li>\
                            <li>2027</li>\
                            <li>2028</li>\
                            <li>2029</li>\
                            <li>2030</li>\
                        </div>\
                    </ul>\
                </li>\
                <li>\
                    <a href="/getData/' + sensorTypes[i] + '/' + dayNow + '/' + monthNow + '/' + yearNow + '" id="' + sensorTypes[i] + '-aj-btn" class="button small ajax-btn">Apply</a>\
                </li>';

        if (sensorTypes[i] == 'temp') {
            grpBtns.temp.append(group);
        }

        if (sensorTypes[i] == 'humm') {
            grpBtns.humm.append(group);
        }

        if (sensorTypes[i] == 'press') {
            grpBtns.press.append(group);
        }

        if (sensorTypes[i] == 'gas') {
            grpBtns.gas.append(group);
        }

        if (sensorTypes[i] == 'light') {
            grpBtns.light.append(group);
        }
    }
}

// create btn groups on page
createBtnGroup(['temp', 'humm', 'press', 'gas', 'light']);

// get control btns
var ajBtns = {
    temp: $('#temp-aj-btn'),
    humm: $('#humm-aj-btn'),
    press: $('#press-aj-btn'),
    gas: $('#gas-aj-btn'),
    light: $('#light-aj-btn')
};

$(document).on('click', '.ajax-btn', function(e) {
    e.preventDefault();

    console.log($(this).attr('id'));

    return false;
});

$(document).on('click', '.f-dropdown.days>div>li, .f-dropdown.months>div>li, .f-dropdown.years>div>li', function () {
    var id = $(this).parent().parent().attr('id');

    console.log(id);
});

//$(document).on('click', '.f-dropdown.months>div>li', function () {
//    var id = $(this).parent().parent().attr('id');
//
//    console.log(id);
//});
//
//$(document).on('click', '.f-dropdown.years>div>li', function () {
//    var id = $(this).parent().parent().attr('id');
//
//    console.log(id);
//});
