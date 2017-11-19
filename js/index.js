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
$(function () {
    initWorkingDays();
});