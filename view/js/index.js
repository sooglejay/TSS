/**
 * Created by Johnny on 17/11/19.
 *
 * 一些约定
 * 前端：
 *    1、项目名输入框的id 构造型如：input_project_projectNum
 *
 * 解释：
 *     （1）projectNum可以用来表示第几个项目，从1自增。不可用数据库id替代
 *
 *    2、任务名输入框的id 构造型如：input_task_taskNum_projectNum
 *
 * 解释：
 *     （1）projectNum同上
 *     （2）taskNum表示这是该项目的第几个任务
 *
 *    3、每天工作小时数的id 构造型如：input_day_(1-5)_taskNum_projectNum
 *
 * 解释：
 *     （1）projectNum和taskNum同上
 *     （2）1-5 分表表示周一至周五
 *
 *    4、任务行tr的id，型如 'row_taskNum_projectNum' ，所以用 '_' 拆分后，数组长度是3
 *    5、项目行tr的id，型如 'row_projectNum'，所以拆分后，数组长度是2
 *    6、项目名所在的列td的id, 型如 'td_project_projectNum'
 *    7、添加任务的行id 是 row_addTask_projectNum  表示给哪个项目添加任务
 *    8、操作栏的id型如 'action_projectNum'
 *
 * （应该不用解释了）
 *
 * 注意共同点：所有的 id字符串 都用'_projectNum'结尾，这样可以方便修改id
 *
 * 目前还有bug，会搞出问题。。。。现在绘制表格 比较搓鼻。后面再优化
 */

var JsonData = '{"weekId": 1511712000000,"work":[{"projectName": "这是项目一","projectId": 1,"tasks": [{"taskId": 1,"taskName": "这是项目一的任务1","stamp": 1511764230000,"hour": 0.30},{"taskId": 2,"taskName": "这是项目一的任务2","stamp": 1511836200000,"hour": 0.30}]},{"projectName": "这是项目二","projectId": 2,"tasks": [{"taskId": 3,"taskName": "这是项目二的任务，任务Id是3","stamp": 1511940600000,"hour": 0.30},{"taskId": 4,"taskName": "这是项目二的任务，任务Id是4","stamp": 1512023400000,"hour": 1.30}]},{"projectName": "这是项目三","projectId": 3,"tasks": [{"taskId": 5,"stamp": 1511764230000,"taskName": "这是属于项目三的任务，任务id是5","hour": 1.30},{"taskId": 6,"taskName": "这是属于项目三的任务，任务id是6","stamp": 1511836200000,"hour": 1.30}]},{"projectName": "这是项目四","projectId": 4,"tasks": [{"taskId": 7,"stamp": 1511940600000,"taskName": "这是属于项目四的任务，任务Id是7","hour": 2.30},{"taskId": 8,"stamp": 1512023400000,"taskName": "这是属于项目四的任务，任务Id是8","hour": 2.30}]}]}';

/**
 * 初始化表格上面的文字内容
 * @param daysList 最近5个工作日的日期
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
 * 用时间Date对象，构造表格前面的字符串
 * @param date
 * @returns {*}
 */
function getFormattedTimeSir(date) {
    if (date instanceof Date) {
        return (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear());
    }
    return "Class Type Not Match Date";
}

/**
 * 设置某天的工作时长
 * @param hours 表示工作时长，小时整数
 * @param dayIndexStartFromOne 表示周几，用 1-5 代表 周一到周五
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
 * 返回一个时间戳，是每周一的零点时刻，作为weekId给后台查询该周的5个工作日
 * @param daysList 目前所在的星期 的五个工作日的 五个Date对象
 * @returns {number} weekId
 *
 */
function getWeekId(daysList) {
    var weekId = new Date(daysList[0].setHours(0, 0, 0, 0)).getTime();
    return weekId;
}
/**
 * 初始化表格
 * @param data 从后台获取的数据
 */
function setUpTable(data) {
    if (data['work'] != undefined) {
        var work = data.work;
        setUpRowWithData(1, work[0]);
        for (var i = 1; i < work.length; i++) {
            addProject();
            var project = work[i];
            setUpRowWithData(i + 1, project);
        }
    }
}

/**
 * 初始化表格的 一个项目
 * @param rowIndex 项目行
 * @param projectData 项目数据
 */
function setUpRowWithData(rowIndex, projectData) {

    var projectName = projectData['projectName'];
    var projectId = projectData['projectId'];
    var tasks = projectData['tasks'];
    $("#input_project_" + rowIndex).append('<option selected="selected" value="' + projectId + '">' + projectName + '</option>');
    for (var t = 1; t <= tasks.length; t++) {
        if (t > 1) {
            //添加一个新任务 需要先把html给渲染好，再填充任务数据
            addTask($("#addTask_" + rowIndex));
        }
        var taskName = tasks[t - 1]['taskName'];
        var taskId = tasks[t - 1]['taskId'];
        $('#input_task_' + t + '_' + rowIndex).append('<option selected="selected" value="' + taskId + '">' + taskName + '</option>');
        var dateObj = new Date(tasks[t - 1]['stamp']);
        var day = dateObj.getDay();
        var dayId = "#input_day_" + day + "_" + t + "_" + rowIndex;
        var hours = tasks[t - 1]['hour'];
        $(dayId).val(hours);
    }
}
/**
 * 查询最近的5个工作日的项目和任务清空
 * @param weekId 这个参数用来定位某一周，它要传給后台
 */
function initDaysFromWebData(weekId) {

    // $.getJSON("./../../weekData.json", {weekId: weekId}, function (data) {
    //     setUpTable(data);
    // });

    setUpTable(JSON.parse(JsonData));
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

function init(daysList) {
    initTitle(daysList);

    var weekId = getWeekId(daysList);
    initDaysFromWebData(weekId);
}


/***
 * 统计目前一共显示了多少个项目，用于在添加新项目的时候，给新项目设置id
 * @returns {number}
 */
function getProjectsCount() {
    var projectNum = 0;
    while ($('#input_project_' + (projectNum + 1)).length > 0) {
        projectNum++;
    }
    return projectNum;
}

/**
 * 添加新项目时，需要构造一个project 行
 */
function getProjectTr(newProjectIndex) {

    var projectTr =
        '<tr id="row_1_' + newProjectIndex + '">' +
        '<td id="td_project_' + newProjectIndex + '" rowspan="2">' +
        '<select class="projectName" id="input_project_' + newProjectIndex + '"></select> ' +
        '</td>' +
        '<td class="taskColumn"> ' +
        '<div class="input-group"> ' +
        '<select class="taskName" id="input_task_1_' + newProjectIndex + '"></select>' +
        '<span onclick="removeTask(this)" class="removeTask glyphicon glyphicon-remove-circle">' +
        '</span>' +
        '</div> ' +
        '</td>' +
        '<td>' +
        '<input class="day form-control" id="input_day_1_1_' + newProjectIndex + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_2_1_' + newProjectIndex + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_3_1_' + newProjectIndex + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_4_1_' + newProjectIndex + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_5_1_' + newProjectIndex + '" type="text" placeholder="hours"></td> ' +
        '<td id="action_' + newProjectIndex + '" colspan="2" rowspan="2" class="actionColumn"> ' +
        '<button onclick="editRow(this)" class="btn btn-sm btn-warning pull-left">Edit</button> ' +
        '<button onclick="removeProject(this)" class="btn btn-sm btn-danger pull-right">Delete</button> ' +
        '</td>' +
        '</tr>';
    return projectTr;

}

/***
 * 添加新任务 html
 * @param newTaskNum
 * @param projectNum
 * @returns {string}
 */
function getNewTaskTr(newTaskNum, projectNum) {

    var taskTr =
        '<tr id="row_' + newTaskNum + '_' + projectNum + '">' +

        '<td class="taskColumn"> ' +
        '<div class="input-group"> ' +
        '<select class="taskName" id="input_task_' + newTaskNum + '_' + projectNum + '"></select>' +
        '<span onclick="removeTask(this)" class="removeTask glyphicon glyphicon-remove-circle">' +
        '</span>' +
        '</div></td>' +
        '<td>' +
        '<input class="day form-control" id="input_day_1_' + newTaskNum + '_' + projectNum + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_2_' + newTaskNum + '_' + projectNum + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_3_' + newTaskNum + '_' + projectNum + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_4_' + newTaskNum + '_' + projectNum + '" type="text" placeholder="hours"></td> ' +
        '<td>' +
        '<input class="day form-control" id="input_day_5_' + newTaskNum + '_' + projectNum + '" type="text" placeholder="hours"></td> ' +

        '</tr>';

    return taskTr;
}
/***
 * 添加新项目时，需要构造一个 添加任务行，taskNum等于0，因为它是添加按钮
 * @param newProjectIndex
 * @returns {string}
 */
function getAddTaskTr(newProjectIndex) {
    var addTaskTr =
        '<tr id="row_addTask_' + newProjectIndex + '"> ' +
        '<td><span id="addTask_' + newProjectIndex + '" onclick="addTask(this)" class="addTask glyphicon glyphicon-play-circle glyphicon-plus-sign" style="margin-top: 5%;cursor: hand"></span>' +
        '</td> ' +
        '<td colspan="5"></td> ' +
        '</tr>';
    return addTaskTr;
}


/**
 * 添加新项目 时，表格行html代码是字符串拼接起来的
 *
 */
function addProject() {
    var projectNum = getProjectsCount();
    var newProjectIndex = projectNum + 1;

    var newProjectTr = getProjectTr(newProjectIndex);
    var addTaskTr = getAddTaskTr(newProjectIndex);

    $('#row_0').before(newProjectTr);
    $('#row_0').before(addTaskTr);
}

/**
 *
 * 从一个id字符串中获取 projectNum
 *
 * 由于所有的idStr都型如'***_projectNum'，所以可以使用本方法获取projectNum
 * @param idStr
 * @returns {number}
 */
function getProjectNumFromIdStr(idStr) {
    var arr = idStr.split('_');
    var id = Number(arr[arr.length - 1]);
    if (!isNaN(id)) {
        return id;
    } else {
        alert('error from getting row number!');
        return -1;
    }
}

/***
 * 根据项目的个数，获取该项目的任务的个数
 */
function getTaskNumFromProjectNum(projectNum) {
    var taskNum = 1;
    while ($('#input_task_' + taskNum + '_' + projectNum).length > 0) {
        taskNum++;
    }
    //返回的是任务的个数
    return taskNum - 1;
}

/**
 * 添加任务，其实是添加了 任务、周一、周二、...、周五 这几列，在实现中，其实是添加了一行
 * 然后再使得project列和action列的rowSpan，增加一
 * @param obj
 */
function addTask(obj) {
    var tastTr = $(obj).parent().parent();
    var id = $(tastTr).attr('id');
    var projectNum = getProjectNumFromIdStr(id);
    var taskNum = getTaskNumFromProjectNum(projectNum) + 1;
    var newTaskTr = getNewTaskTr(taskNum, projectNum);
    $(tastTr).before(newTaskTr);
    modifyRowSpan(projectNum, 1);
}

/**
 * 修改 项目列 和  操作列  的 rowSpan
 * @param projectNum
 * @param oneWithFlag  1 或 －1  分别代表自增1和自减1
 */
function modifyRowSpan(projectNum, oneWithFlag) {
    // 调整projectName、action列的rowSpan，要自增1
    var pObj = $('#td_project_' + projectNum);
    var actionObj = $('#action_' + projectNum);
    var pRowSpan = Number(pObj.attr('rowSpan'));
    var actionRowSpan = Number(actionObj.attr('rowSpan'));
    pObj.attr('rowSpan', (pRowSpan + oneWithFlag));
    actionObj.attr('rowSpan', (actionRowSpan + oneWithFlag));
}

/**
 * 删除一个任务
 * @param obj
 */
function removeTask(obj) {
    // 型如 input_task_2_1
    var idStr = $(obj).parent().children('select').attr('id');

    var projectNum = Number(idStr.split('_')[3]);
    var allTaskCount = getTaskNumFromProjectNum(projectNum);
    if (1 == allTaskCount) {//如果
        alert('Can not remove this task! Since You Have to remain one at least!');
        return;
    }
    var currentTaskNum = Number(idStr.split('_')[2]);
    var cond = "[id=row_" + currentTaskNum + '_' + projectNum + "]";
    if (currentTaskNum == 1) {
        alert("you can not remove first task!");
        return;
    }
    $("tr" + cond).remove();
    if (currentTaskNum < allTaskCount) {
        for (var i = currentTaskNum + 1; i <= allTaskCount; i++) {
            var taskTrObj = $("#row_" + i + '_' + projectNum);
            taskTrObj.attr('id', "row_" + (i - 1) + '_' + projectNum);

            var taskInputTd = $('#input_task_' + i + '_' + projectNum);
            taskInputTd.attr('id', "input_task_" + (i - 1) + '_' + projectNum);
        }
    }
    modifyRowSpan(projectNum, -1);

}

/**
 * 删除表格的一行
 * @param obj
 */
function removeProject(obj) {
    var projectNum = getProjectsCount();
    if (projectNum == 1) {
        alert('Can not remove last one!');
        return;
    }
    var id = obj.parentNode.parentNode.id;
    var removeIndex = getProjectNumFromIdStr(id);
    if (removeIndex == projectNum) {
        removeProjectByProjectNum(removeIndex);
    } else {
        removeProjectByProjectNum(removeIndex);
        for (var r = removeIndex + 1; r <= projectNum; r++) {
            // 修改之前，先获取该项目一共有多少个任务行
            var taskNum = getTaskNumFromProjectNum(r);

            // 项目行 tr 修改id
            var projectTr = $('#row_1_' + r);
            modifyId(projectTr);

            //任务行 tr 修改id，注意任务行的taskNum从2开始的
            for (var t = 2; t <= taskNum; t++) {
                var taskTr = $('#row_' + t + '_' + r);
                modifyId(taskTr);
            }

            //添加任务的按钮行 也要修改id
            var addTaskTr = $('#row_addTask_' + r);
            modifyId(addTaskTr);
        }
    }
}

/**
 * 这里 需要注意，任务行tr id中的taskNum，是从2开始自增的，因为taskNum＝1 已经在项目行中使用了
 * @param projectNum
 */
function removeProjectByProjectNum(projectNum) {
    // 删除所有 跟该项目有关的任务，按钮等
    var tail = '[id$=' + '_' + projectNum + "]";
    $("tr" + tail).remove();
}

/**
 * 递归修改id算法
 * 1、删除某行后，其后的各行的id要相应修改
 * 2、修正id，修改一个元素下的所有子元素的id（如果有的话），使得id减少1
 *
 * 3、注意，这里的id，必须是使用'_数字'结尾，也就是说'***_数字'的格式，'数字'就是行号，行号减1，这就是目的
 *
 * @param obj 该元素
 */
function modifyId(obj) {
    var childNodes = $(obj).children();
    for (var i = 0; i < childNodes.length; i++) {
        modifyId(childNodes[i]);
    }
    var idStr = $(obj).attr('id');
    if (idStr && idStr.length > 0) {
        var projectNum = getProjectNumFromIdStr(idStr);
        if (projectNum > 0) {
            var arr = idStr.split('_');
            var newId = arr.slice(0, arr.length - 1).join('_') + "_" + (projectNum - 1);
            $(obj).attr('id', newId);
        }
    }
}

function editRow(obj) {
    $('select').removeAttr('disabled');
    $('.addTask,.removeTask').show();
}

function getSelectText(selectorObj) {
    return $(selectorObj).find('option:selected').text();
}
function getSelectValue(selectorObj) {
    return $(selectorObj).find("option:selected").val();
}
function getWeekDay(n) {
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return week[n];

}
function isFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;
    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}
function getTableData() {
    var projectNum = getProjectsCount();
    var workData = [];
    for (var p = 1; p <= projectNum; p++) {
        var project = [];
        var tasks = [];

        var projectName = getSelectText($(('#input_project_' + p)));
        var projectId = getSelectValue($(('#input_project_' + p)));

        project['projectName'] = projectName;
        project['projectId'] = projectId;
        var tasksC = getTaskNumFromProjectNum(p);
        for (var t = 1; t <= tasksC; t++) {
            var taskSelector = $('#input_task_' + t + "_" + p);
            var task = [];
            var taskName = getSelectText(taskSelector);
            var taskId = getSelectValue(taskSelector);
            if (taskName.length < 1) {
                alert("please fill the table No." + p + " line's task!");
                return -1;
            }
            for (var d = 1; d <= 5; d++) {
                var hours = $('#input_day_' + d + '_' + t + '_' + p).val();
                if (hours.length < 1) {
                    //空字符串，说明这个任务今天没有做，就传0或者-1，这个可以跟后台协商
                    hours = 0;
                }
                if (isFloat(hours)) {
                    hours = parseFloat(hours);
                } else {
                    alert("please check No." + p + " line's " + getWeekDay(d) + "'s hours");
                    return -1;
                }
                task['day_' + d] = hours;
            }
            task.taskName = taskName;
            task.taskId = taskId;
            tasks[t - 1] = task;
        }
        project.tasks = tasks;
        workData[p - 1] = project;
    }
    return workData;
}
/**
 * 提交数据 一周的数据，目前，不管如何改动，都会把这一周的数据全部提交
 *
 * @param isSave 保存，或者 正式提交
 */
function submit(isSave) {
    //提交到服务器
    var tableData = getTableData();
    if (tableData == -1) {
        return;
    }
    console.log(tableData);
    var project = {projectName: "test project"};
    project = project.serialize();
    console.log(project);
    $.ajax({
        data: JSON.stringify(tableData),
        url: "/update/project",
        method: "GET",
        success: function (data) {
            alert("提交成功");
        }, error: function (e) {
            console.log(e);
            alert(e);
        }
    });
}

function initTable() {
    var trs = $('#workTable').find('tr');
    for (var tr = 2; tr < trs.length; tr++) {
        if ($(trs[tr]).attr('id') == 'row_addTask_1')continue;
        if ($(trs[tr]).attr('id') == 'row_0')continue;
        $(trs[tr]).remove();
    }
    $("#td_project_1").attr('rowSpan',2);
    $("#action_1").attr('rowSpan',2);
}

$(function () {
    var dayApp = new DayApp();
    var daysList = dayApp.getWorkDaysList(new Date());
    init(daysList);

    $("#btnPreWeek").click(function () {
        initTable();
        var preWeekDaysList = dayApp.getPreWorkDaysList();
        init(preWeekDaysList);
    });

    $("#btnNextWeek").click(function () {
        initTable();
        var nextWeekDaysList = dayApp.getNextWorkDaysList();
        init(nextWeekDaysList);
    });
    $('#btnAdd').click(function () {
        addProject();
    });

    $('#btnSave').click(function () {
        submit(true);
    });
    $('#btnSubmit').click(function () {
        submit(false);
    });

    $('select').change(function () {
        $('select').children().removeAttr('selected');
        $(this).attr('selected', 'selected');
    });
});
