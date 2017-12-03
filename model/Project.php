<?php
namespace TSS;
require_once dirname(__FILE__) . '/../model/Task.php';

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityRepository;

ini_set('date.timezone', 'Asia/Shanghai');

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 19:44
 * @Entity(repositoryClass="ProjectRepository")
 * @Table(name="tss_project")
 */
class Project
{
    /** @Id  @GeneratedValue @Column(type="integer") */
    protected $id;

    /**
     * @Column(type="string")
     * @var
     */
    protected $projectName;

    /**
     * One Project has Many Task.
     * @OneToMany(targetEntity="Task", mappedBy="project")
     */
    protected $tasks;

    /**
     * Project constructor.
     */
    public function __construct()
    {
        $this->tasks = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getProjectName()
    {
        return $this->projectName;
    }

    /**
     * @param mixed $projectName
     */
    public function setProjectName($projectName)
    {
        $this->projectName = $projectName;
    }

    /**
     * @return mixed
     */
    public function getTasks()
    {
        return $this->tasks;
    }

    /**
     * @param Task $task
     */
    public function addTask($task)
    {
        $this->tasks[] = $task;
    }
}

class ProjectRepository extends EntityRepository
{

    public function saveProject($projectName, $taskList)
    {
        try {
            $p = $this->findOneBy(array('projectName' => $projectName));
            if ($p instanceof Project) {
                echo $projectName . "已经存在.\n";
                return false;
            }
            $taskRepo = $this->_em->getRepository('TSS\Task');
            $projectEntity = new Project();
            if ($taskRepo instanceof TaskRepository) {
                foreach ($taskList as $taskName) {
                    $taskEntity = $taskRepo->findOneBy(array('taskName' => $taskName));
                    if (is_null($taskEntity)) {
                        $taskEntity = new Task();
                        $taskEntity->setTaskName($taskName);
                    }
                    if ($taskEntity instanceof Task) {
                        $projectEntity->addTask($taskEntity);
                        $taskEntity->setProject($projectEntity);
                        $projectEntity->setProjectName($projectName);
                        $this->_em->persist($projectEntity);
                        $this->_em->persist($taskEntity);
                        $this->_em->flush();
                    }
                }
                return true;
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
        return false;
    }

    public function addTask($projectName, $taskList)
    {
        try {
            $projectEntity = $this->findOneBy(array('projectName' => $projectName));
            if (!($projectEntity instanceof Project)) {
                echo "项目 " . $projectName . "不存在.\n";
                return false;
            }
            $taskRepo = $this->_em->getRepository('TSS\Task');
            if ($taskRepo instanceof TaskRepository) {
                foreach ($taskList as $taskName) {
                    foreach ($projectEntity->getTasks() as $tasksAdded) {
                        if ($tasksAdded == $taskName) {
                            echo "任务 $taskName 已经存在,添加失败\n";
                            continue;
                        }
                        $taskEntity = $taskRepo->findOneBy(array('taskName' => $taskName));
                        if ($taskEntity instanceof Task) {
                            $projectEntity->addTask($taskEntity);
                            $taskEntity->setProject($projectEntity);
                            $projectEntity->setProjectName($projectName);
                            $this->_em->persist($projectEntity);
                            $this->_em->persist($taskEntity);
                            $this->_em->flush();
                        }
                    }
                }
                return true;
            }
        } catch
        (\Exception $e) {
            echo $e->getMessage();
        }
        return false;
    }

}