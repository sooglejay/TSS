/**
 * Created by Johnny on 17/11/19.
 */

/**
 * 初始化
 * @param Date daysList 最近5个工作日的日期
 */
function initTitle(daysList) {
    // 每周5个工作日，这里硬编码了，daysList的最后一个下标是4
    $("#timeRanger").html(getFormattedTimeSir(daysList[0]) + "-" + getFormattedTimeSir(daysList[4]));
    for (var i = 0; i < daysList.length; i++) {
        var d = daysList[i];
        $("#label_day_" + (i + 1)).html((d.getMonth() + 1) + "/" + d.getDate());
    }
}

/**
 * 设置某天的工作时长
 * @param hours 表示工作时长
 * @param dayIndexStartFromOne 表示周几
 */
function appendHoursSelect(hours, dayIndexStartFromOne) {
    var hoursTitle = '';
    if (hours > 1) {
        hoursTitle = hours + ' hours';
    } else {
        hoursTitle = hours + 'hour';
    }
    $("#sel_hour_day_" + dayIndexStartFromOne).append("<option value=" + hours + ">" + hoursTitle + "</option>");
}

/**
 * 清空 工作时长 的select组件
 */
function initHoursSelector() {
    var dayIndexStartFromOne = 1;
    while (dayIndexStartFromOne <= 5) {
        $("#sel_hour_day_" + dayIndexStartFromOne++).empty();
    }
}

/**
 *
 * @param daysList
 * @returns {number} 返回一个时间戳，是每周一的零点时刻，作为weekId给后台查询该周的5个工作日
 */
function getWeekId(daysList) {
    var weekId = new Date(daysList[0].setHours(0, 0, 0, 0)).getTime();
    return weekId;
}

/**
 * 查询最近的5个工作日的项目和任务清空
 * @param weekId 这个参数用来定位某一周
 */
function initDaysFromWebData(weekId) {
    $.getJSON("./../../other.json", {weekId: weekId}, function (data) {
        initWorkTableEx(data);
    });
}
/**
 * 填充模拟数据，用于测试
 */
function testDaysSelector() {
    initHoursSelector();
    for (var i = 1; i <= 5; i++) {
        for (var hours = 1; hours <= 8; hours++) {
            appendHoursSelect(hours, i);
        }
    }
}

function getFormattedTimeSir(date) {
    if (date instanceof Date) {
        return (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear());
    }
    return "Class Type Not Match Date";
}

function init(daysList) {
    initTitle(daysList);

    var weekId = getWeekId(daysList);
    initDaysFromWebData(weekId);
}

/**
 * 表格风格1
 * @param workData
 */
function initWorkTable(workData) {
    var Data = [], itemIndex = 0;

    var dateRowSpanIndex = 0;

    for (var w = 0; w < workData['work'].length; w++) {//每天
        var dayWork = workData['work'][w];
        var rowsCount = 0;

        var projectRowSpanIndex = dateRowSpanIndex;
        for (var p = 0; p < dayWork['projects'].length; p++) {// 每天的项目
            var project = dayWork['projects'][p];
            var rowsCountOfOneProject = 0;
            for (var t = 0; t < project['tasks'].length; t++) {// 每天的每个项目的每个任务
                var task = project['tasks'][t];
                var item = [];
                item['date'] = dayWork['stamp'];
                item['hour'] = project['hour'];
                item['projectName'] = project['projectName'];
                item['taskName'] = task['taskName'];
                Data[itemIndex++] = item;
                rowsCount++;
                rowsCountOfOneProject++;
            }
            (function (index, rowspan) {
                setTimeout(function () {
                    $('#table').bootstrapTable('mergeCells', {
                        index: index,
                        field: 'projectName',
                        rowspan: rowspan
                    });
                }, 3000);
            })(projectRowSpanIndex, rowsCountOfOneProject);
            projectRowSpanIndex += rowsCountOfOneProject;
        }


        (function (index, rowspan) {
            setTimeout(function () {
                $('#table').bootstrapTable('mergeCells', {index: index, field: 'date', rowspan: rowspan});
                $('#table').bootstrapTable('mergeCells', {index: index, field: 'hour', rowspan: rowspan});
            }, 3000);
        })(dateRowSpanIndex, rowsCount);
        dateRowSpanIndex += rowsCount;
    }
    $('#table').bootstrapTable({
        columns: [{
            field: 'date',
            title: 'Date',
            formatter: function (value, row, index) {
                var date = new Date(value);
                console.log(value + "---" + date.getDate() + "--" + date.getMonth());
                return (date.getMonth() + 1) + "/" + (date.getDate());
            }
        }, {
            field: 'hour',
            title: 'Hours',
            editable: {
                type: 'text'
            }
        }, {
            field: 'projectName',
            title: 'Projects'
        }, {
            field: 'taskName',
            title: 'Tasks',
            editable: {
                type: 'select2',
                multiple: false,
                maximumSelectionSize: 1, // 限制数量


                inputclass: 'input-large',
                select2: {
                    tags: ['back-end', 'front-end', 'database', 'union test', 'ui'],
                    tokenSeparators: [',', ' ']
                }
            }
        }],
        data: Data
    });
}

/**
 * 表格风格2
 * @param workData
 */
function initWorkTableEx(workData) {
    var hours = [0, 0, 0, 0, 0];//每天的工作小时
    var Data = [], itemIndex = 0;
    for (var w = 0; workData['work'] && w < workData['work'].length; w++) {//每天
        var dayWork = workData['work'][w];
        for (var p = 0; dayWork['projects'] && p < dayWork['projects'].length; p++) {// 每天的项目
            var project = dayWork['projects'][p];
            var item = [];
            item['projectName'] = project['projectName'];
            item['projectId'] = project['projectId'];
            item['weekId'] = workData['weekId'];
            item['tasks'] = project['tasks'];
            Data[itemIndex++] = item;
        }
        hours[w] = dayWork['hour'];
    }

    var $table = $('#table');

    $table.bootstrapTable({
            columns: [
                {
                    field: 'projectName',
                    title: 'Projects'
                },

                {
                    field: 'tasks',
                    title: 'Tasks',
                    editable: {
                        type: 'select2',
                        inputclass: 'input-large',
                        select2: {
                            multiple: false,
                            tags: (function () {//动态获取数据
                                var result = [];
                                $.ajax({
                                    url: "./../../tasks.json",
                                    async: false,
                                    type: "get",
                                    data: {},
                                    success: function (data, status) {
                                        data = JSON.parse(data);
                                        var tasks = data.tasks;
                                        for (var i = 0; i < tasks.length; i++) {
                                            result[i] = tasks[i];
                                        }
                                        console.log(result);
                                    }
                                });
                                return result;
                            })(),
                            tokenSeparators: ['\t', ',']

                        }

                    },
                    formatter: function (value, row, index) {
                        var tasks = [];
                        for (var i = 0; i < value.length; i++) {
                            tasks[i] = value[i]['taskName'];
                        }
                        return tasks;
                    }
                },
                {
                    field: 'Monday',
                    title: 'Monday',
                    editable: {
                        type: 'text'
                    }
                }
                ,
                {
                    field: 'Tuesday',
                    title: 'Tuesday',
                    editable: {
                        type: 'text'
                    }
                }
                ,
                {
                    field: 'Wednesday',
                    title: 'Wednesday',
                    editable: {
                        type: 'text'
                    }
                }
                ,
                {
                    field: 'Thursday',
                    title: 'Thursday', editable: {
                    type: 'text'
                }
                }
                ,
                {
                    field: 'Friday',
                    title: 'Friday', editable: {
                    type: 'text'
                }
                }
            ],
            data: Data
        }
    );
}

/**
 * 表格风格3
 * @param workData
 */
function initWorkTable3(workData) {
    var hours = [0, 0, 0, 0, 0];//每天的工作小时
    var Data = [], itemIndex = 0;
    for (var w = 0; workData['work'] && w < workData['work'].length; w++) {//每天
        var dayWork = workData['work'][w];
        for (var p = 0; dayWork['projects'] && p < dayWork['projects'].length; p++) {// 每天的项目
            var project = dayWork['projects'][p];
            var item = [];
            item['projectName'] = project['projectName'];
            item['projectId'] = project['projectId'];
            item['weekId'] = workData['weekId'];
            item['tasks'] = project['tasks'];
            Data[itemIndex++] = item;
        }
        hours[w] = dayWork['hour'];
    }
}

/**
 * 提交数据 一周的数据，目前，不管如何改动，都会把这一周的数据全部提交
 * @param isSave
 */
function submit(isSave) {

}

$(function () {
    var dayApp = new DayApp();
    var daysList = dayApp.getWorkDaysList(new Date());
    init(daysList);

    $("#btnPreWeek").click(function () {
        var preWeekDaysList = dayApp.getPreWorkDaysList();
        init(preWeekDaysList);
    });

    $("#btnNextWeek").click(function () {
        var nextWeekDaysList = dayApp.getNextWorkDaysList();
        init(nextWeekDaysList);
    });
    $('#btnAdd').click(function () {
        addRow([], true);
    });
});
