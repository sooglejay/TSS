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
    $.getJSON("./../../weekData.json", {weekId: weekId}, function (data) {
        initWorkTable3(data);
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

function getTableDataLength() {
    return getTableData().length;
}
function getTableData() {
    return $('#row_0').parent().children();
}
function getRowNumFromIdStr(idStr) {
    var arr = idStr.split('_');
    var id = Number(arr[arr.length - 1]);
    if (!isNaN(id)) {
        return id;
    } else {
        alert('error from getting row number!');
        return -1;
    }
}

function getNewTaskHtml(rowNumber, taskNumber) {
    var html =
        '<div class="input-group">' +
        '<input class="form-control" style="width:90%;align-content: center" id="task_input_' + taskNumber + '_' + rowNumber + '" type="text" value="" placeholder="task name">' +
        //删除任务
        '<span onclick="removeTask(this)" class=" glyphicon glyphicon-remove-circle" style="width:1%;margin-top:10px;margin-left:5px;cursor:hand;text-align: center"></span>' +
        '</div>';

    return html;

}

/**
 * 添加一行
 * id构造的算法是  ***_行号  也就是说行号是id这个字符串的最后一个数值
 */
function addRow() {
    var newRowIndex = getTableDataLength();
    var newRow =
        //行开始
        '<tr id="row_' + newRowIndex + '">' +

        //项目
        '<td>' +
        '<input class="form-control" id="project_input_' + newRowIndex + '" type="text" value="" placeholder="project name">' +
        '</td>' +

        //任务  宽带可以设置
        '<td style="min-width: 150px">' +
        '<div id="task_wrapper_' + newRowIndex + '" align="center">' +
        getNewTaskHtml(newRowIndex, 1) +
        //添加任务
        '<span onclick="addTask(this)" class="glyphicon glyphicon-play-circle glyphicon-plus-sign" style="margin-top: 5%;cursor: hand"></span>' +
        '</div>' +
        '</td>' +

        //周一
        '<td><input  class="day form-control" type="text" id="day_input_1_' + newRowIndex + '" placeholder="hours"/></td>' +
        //周二
        '<td><input  class="day form-control" type="text" id="day_input_2_' + newRowIndex + '" placeholder="hours"/></td>' +
        //周三
        '<td><input  class="day form-control" type="text" id="day_input_3_' + newRowIndex + '" placeholder="hours"/></td>' +
        //周四
        '<td><input  class="day form-control" type="text" id="day_input_4_' + newRowIndex + '" placeholder="hours"/></td>' +
        //周五
        '<td><input  class="day form-control" type="text" id="day_input_5_' + newRowIndex + '" placeholder="hours"/></td>' +

        //操作
        '<td colspan="2" style="min-width: 120px">' +
        '<button onclick="editRow(this)" class="btn btn-sm btn-warning pull-left">Edit</button>' +
        '<button onclick="removeRow(this)" class="btn btn-sm btn-danger pull-right">Delete</button>' +
        '</td>' +

        //行结束
        '</tr>';
    $('#row_0').before(newRow);
}

/**
 * 添加一个任务
 * @param obj
 */
function addTask(obj) {
    var newTaskNumber = obj.parentNode.childNodes.length;
    var rowNumber = getRowNumFromIdStr(obj.parentNode.id);
    var taskHtml = getNewTaskHtml(rowNumber, newTaskNumber);
    $(obj).before(taskHtml);
}

/**
 * 删除一个任务
 * @param obj
 */
function removeTask(obj) {

}

/**
 * 删除特定的一行
 * @param obj
 */
function removeRow(obj) {
    var rowsLen = getTableDataLength();
    var id = obj.parentNode.parentNode.id;
    var removeIndex = Number(id.split('_')[1]);
    if (removeIndex == rowsLen) {
        $('#row_' + removeIndex).remove();
    } else {
        $('#row_' + removeIndex).remove();
        var tableData = getTableData();
        for (var r = removeIndex - 1; r < tableData.length - 1; r++) {
            var rowData = tableData[r];
            modifyId(rowData);
        }
    }
}


/**
 * 编辑一行
 * @param obj
 */
function editRow(obj) {

}

/**
 * 递归修改id算法
 * 1、删除某行后，其后的各行的id要相应修改
 * 2、修正id，修改一个元素下的所有子元素的id（如果有的话），使得id减少1
 * 3、注意，这里的id，是使用'***_***_数字'的格式，'数字'就是行号，行号减1，这就是目的
 *
 * @param obj 该元素
 */
function modifyId(obj) {
    var childNodes = obj.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        modifyId(childNodes[i]);
    }
    if (obj.id && obj.id.length > 0) {
        var id = getRowNumFromIdStr(obj.id);
        if (id > 0) {
            var arr = obj.id.split('_');
            id = arr.slice(0, arr.length - 1).join('_') + "_" + (id - 1);
            obj.id = id;
        }
    }
}

/**
 * 提交数据 一周的数据，目前，不管如何改动，都会把这一周的数据全部提交
 */
function submit() {

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
        addRow();
    });
});
