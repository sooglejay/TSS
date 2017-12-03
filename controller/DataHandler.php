<?php
/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/12/2
 * Time: 16:28
 */
namespace TSS;
require_once dirname(__FILE__) . './../bootstrap.php';
class DataHandler extends App
{

    /**
     * DataHandler constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->userRepo = $this->entityManager->getRepository('TSS\User');
        $this->workRepo = $this->entityManager->getRepository('TSS\Work');
        $this->taskRepo = $this->entityManager->getRepository('TSS\Task');
        $this->projectRepo = $this->entityManager->getRepository('TSS\Project');
        $this->departmentRepo = $this->entityManager->getRepository('TSS\Department');
    }

    public function saveDepartment($departmentName)
    {
        if ($this->departmentRepo instanceof DepartmentRepository) {
            if ($this->departmentRepo->saveDepartment($departmentName)) {
                echo "\nsuccess save department\n";
            }
        }
    }

    public function saveProject($projectName, $taskList)
    {
        if ($this->projectRepo instanceof ProjectRepository) {
            if ($this->projectRepo->saveProject($projectName, $taskList)) {
                echo "\nsuccess save project $projectName \n";
            }
        }
    }

    public function saveWork($userName, $projectName, $taskName, $hours, $time)
    {
        if ($this->workRepo instanceof WorkRepository) {
            if ($this->workRepo->saveWork($userName, $projectName, $taskName, $hours, $time)) {
                echo "\nsuccess save work\n";
            } else {
                echo "\n";
            }
        }
    }
}

$handler = new DataHandler();

$handler->saveProject("这是项目一", array("这是项目一的任务1", "这是项目一的任务2"));
$handler->saveProject("这是项目二", array("这是项目二的任务1", "这是项目二的任务2"));
$handler->saveProject("这是项目三", array("这是项目三的任务1", "这是项目三的任务2"));
$handler->saveProject("这是项目四", array("这是项目四的任务1", "这是项目四的任务2"));

//周一
$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务1", 8, strtotime("2017-11-27 10:30:45"));
$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务2", 8, strtotime("2017-11-27 10:30:45"));
$handler->saveWork("蒋维", "这是项目二", "这是项目二的任务1", 8, strtotime("2017-11-27 14:30:45"));
$handler->saveWork("蒋维", "这是项目二", "这是项目二的任务2", 8, strtotime("2017-11-27 15:30:45"));
//
//
////周二
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务1", 8, strtotime("2017-11-27 10:30:45"));
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务2", 8, strtotime("2017-11-27 10:30:45"));
//
////周三
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务1", 8, strtotime("2017-11-27 10:30:45"));
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务2", 8, strtotime("2017-11-27 10:30:45"));
//
////周四
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务1", 8, strtotime("2017-11-27 10:30:45"));
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务2", 8, strtotime("2017-11-27 10:30:45"));
//
////周五
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务1", 8, strtotime("2017-11-27 10:30:45"));
//$handler->saveWork("蒋维", "这是项目一", "这是项目一的任务2", 8, strtotime("2017-11-27 10:30:45"));
//
