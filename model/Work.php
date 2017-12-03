<?php
namespace TSS;
require_once dirname(__FILE__) . '/../model/Task.php';
require_once dirname(__FILE__) . '/../model/Project.php';
require_once dirname(__FILE__) . '/../model/User.php';
require_once dirname(__FILE__) . '/../model/Department.php';
require_once dirname(__FILE__) . '/../model/MainModel.php';

use Doctrine\ORM\EntityRepository;

ini_set('date.timezone', 'Asia/Shanghai');

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 19:44
 * @Entity(repositoryClass="WorkRepository")
 * @Table(name="tss_work")
 */
class Work extends MainModel
{
    /** @Id  @GeneratedValue @Column(type="integer") */
    protected $id;

    /** @Column(type="integer") */
    protected $hours;

    /** @Column(type="integer") */
    protected $weekId;

    /** @Column(type="string") */
    protected $time;

    /**
     * @ManyToOne(targetEntity="Project")
     * @JoinColumn(name="project_id", referencedColumnName="id")
     */
    protected $project;

    /**
     * @ManyToOne(targetEntity="Task")
     * @JoinColumn(name="task_id", referencedColumnName="id")
     */
    protected $task;

    /**
     * @ManyToOne(targetEntity="User")
     * @JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

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
    public function getTime()
    {
        return $this->time;
    }

    /**
     * @param mixed $time
     */
    public function setTime($time)
    {
        $this->time = $time;
    }

    /**
     * @return mixed
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * @param mixed $project
     */
    public function setProject($project)
    {
        $this->project = $project;
    }

    /**
     * @return mixed
     */
    public function getTask()
    {
        return $this->task;
    }

    /**
     * @param mixed $task
     */
    public function setTask($task)
    {
        $this->task = $task;
    }

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getHours()
    {
        return $this->hours;
    }

    /**
     * @param mixed $hours
     */
    public function setHours($hours)
    {
        $this->hours = $hours;
    }

    /**
     * @return mixed
     */
    public function getWeekId()
    {
        return $this->weekId;
    }

    /**
     * @param mixed $weekId
     */
    public function setWeekId($weekId)
    {
        $this->weekId = $weekId;
    }

}

class WorkRepository extends EntityRepository
{

    public function saveWork($userName, $projectName, $taskName, $hours, $time)
    {
        try {
            $work = new Work();
            $userRepo = $this->_em->getRepository('TSS\User');
            $projectRepo = $this->_em->getRepository('TSS\Project');
            $taskRepo = $this->_em->getRepository('TSS\Task');
            $userEntity = $userRepo->findOneBy(array("displayName" => $userName));
            $taskEntity = $taskRepo->findOneBy(array("taskName" => $taskName));
            $projectEntity = $projectRepo->findOneBy(array("projectName" => $projectName));

            if ($projectEntity instanceof Project) {
                $work->setProject($projectEntity);
            } else {
                echo "没有 $projectName 这个项目";
                return false;
            }
            if ($userEntity instanceof User) {
                $work->setUser($userEntity);
            } else {
                echo "没有 $userName 这个用户";
                return false;
            }
            if ($taskEntity instanceof Task) {
                $work->setTask($taskEntity);
            } else {
                echo "没有 $taskName 这个任务";
                return false;
            }
            $weekId = $work->getWeekIdByTime($time);
            $work->setWeekId($weekId);
            $work->setTime($time);
            $work->setHours($hours);
            $this->_em->persist($work);
            $this->_em->flush($work);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
            return false;
        }
        return true;
    }
}
