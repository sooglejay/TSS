/**
 * Created by sooglejay on 17/11/19.
 */

function getWorkDaysList() {
    var _SECONDS_ = 24 * 60 * 60 * 1000;
    var date = new Date();
    var milliseconds = date.getTime();
    var repackDays = date.getDay() - 1;
    if (repackDays == -1) {
        milliseconds += _SECONDS_;
    } else {
        while (repackDays) {
            milliseconds -= _SECONDS_;
            repackDays--;
        }
    }
    date.setTime(milliseconds);
    var resultArray = [];
    for (var i = 0; i < 5; i++) {
        resultArray[i] = new Date(date);
        milliseconds += _SECONDS_;
        date.setTime(milliseconds);
    }
    return resultArray;
}
$(function () {
    var dd = getWorkDaysList();
    for (var i = 0; i < dd.length; i++) {
        var d = dd[i];
        var youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); //格式化
        console.log(youWant + "\n");
    }
});