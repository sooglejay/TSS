/**
 * Created by sooglejay on 17/11/19.
 */
var DayApp = function () {
    this.workDaysPerWeek = 5;
    this.secondsPerDay = 24 * 60 * 60 * 1000;
    this.getWorkDaysList = function () {
        var date = new Date();
        var milliseconds = date.getTime();
        var repackDays = date.getDay() - 1;
        if (repackDays == -1) {
            milliseconds += this.secondsPerDay;
        } else {
            while (repackDays) {
                milliseconds -= this.secondsPerDay;
                repackDays--;
            }
        }
        date.setTime(milliseconds);
        var resultArray = [];
        for (var i = 0; i < this.workDaysPerWeek; i++) {
            resultArray[i] = new Date(date);
            milliseconds += this.secondsPerDay;
            date.setTime(milliseconds);
        }
        return resultArray;
    };
    this.getFormattedTimeSir = function (date) {
        if (date instanceof Date) {
            return (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear());
        }
        return "Class Type Not Match Date";
    };
};
