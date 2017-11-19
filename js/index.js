/**
 * Created by sooglejay on 17/11/19.
 */
function initWorkingDays() {
    var dayApp = new DayApp();
    var dd = dayApp.getWorkDaysList();
    for (var i = 0; i < dd.length; i++) {
        var d = dd[i];
        $("#label_day_" + (i + 1)).html((d.getMonth() + 1) + "/" + d.getDate());
    }
    $("#timeRanger").html(dayApp.getFormattedTimeSir(dd[0]) + "-" + dayApp.getFormattedTimeSir(dd[dd.length - 1]));
}

function initDaysSelector() {
    var hS = '';
    for (var i = 1; i <= 5; i++) {
        for (var hours = 1; hours <= 8; hours++) {
            if (hours > 1) {
                hS = 'hours';
            } else {
                hS = 'hour';
            }
            $("#sel_day_" + i).append("<option value=" + hours + ">" + hours + " " + hS + "</option>");
        }
    }
}
$(function () {
    initWorkingDays();
    initDaysSelector();
});