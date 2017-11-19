/**
 * Created by sooglejay on 17/11/19.
 */
var DayApp = function () {
    this.workDaysPerWeek = 5;
    this.secondsPerDay = 24 * 60 * 60 * 1000;
    this.currentDate = new Date();
};


DayApp.prototype.getWorkDaysList = function (date) {
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
    this.currentDate.setTime(milliseconds);
    var resultArray = [];
    for (var i = 0; i < this.workDaysPerWeek; i++) {
        resultArray[i] = new Date(date);
        milliseconds += this.secondsPerDay;
        date.setTime(milliseconds);
    }
    return resultArray;
};
DayApp.prototype.getNextWorkDaysList = function (date) {

    var milliseconds = date.getTime();
    var repackDays = date.getDay() - 1;
    if (repackDays == -1) {
        // 说明date 是周日
        milliseconds += this.secondsPerDay;
    } else {
        while (repackDays <= 7) {
            milliseconds += this.secondsPerDay;
            repackDays++;
        }
    }
    date.setTime(milliseconds);
    this.currentDate.setTime(milliseconds);
    var resultArray = [];
    for (var i = 0; i < this.workDaysPerWeek; i++) {
        resultArray[i] = new Date(date);
        milliseconds += this.secondsPerDay;
        date.setTime(milliseconds);
    }
    return resultArray;
};
DayApp.prototype.getPreWorkDaysList = function (date) {

    var milliseconds = date.getTime();
    var repackDays = date.getDay() - 1;
    if (repackDays == -1) {
        // the date is Sunday
        while (repackDays < 6) {
            milliseconds -= this.secondsPerDay;
            repackDays++;
        }
    } else {
        while (repackDays > -1) {
            milliseconds -= this.secondsPerDay;
            repackDays--;
        }
        while (repackDays < 6) {
            milliseconds -= this.secondsPerDay;
            repackDays++;
        }
    }
    date.setTime(milliseconds);
    this.currentDate.setTime(milliseconds);
    var resultArray = [];
    for (var i = 0; i < this.workDaysPerWeek; i++) {
        resultArray[i] = new Date(date);
        milliseconds += this.secondsPerDay;
        date.setTime(milliseconds);
    }
    return resultArray;
};

