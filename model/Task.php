<?php
namespace TSS;
require_once dirname(__FILE__) . '/../model/Project.php';

use Doctrine\ORM\EntityRepository;

ini_set('date.timezone', 'Asia/Shanghai');

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 19:44
 * @Entity(repositoryClass="TaskRepository")
 * @Table(name="tss_task")
 */
class Task
{
    /** @Id  @GeneratedValue @Column(type="integer") */
    protected $id;

    /**
     * @ManyToOne(targetEntity="Project", inversedBy="tasks")
     * @JoinColumn(name="project_id", referencedColumnName="id")
     */
    protected $project;

    /**
     * @Column(type="string")
     */
    protected $taskName;

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
    public function getTaskName()
    {
        return $this->taskName;
    }

    /**
     * @param mixed $taskName
     */
    public function setTaskName($taskName)
    {
        $this->taskName = $taskName;
    }


}

class TaskRepository extends EntityRepository
{
    public function saveTask($projectName, $taskName)
    {
        try {
            $projectEntity = $this->_em->getRepository('Project')->findOneBy(array('projectName' => $projectName));
            if ($projectEntity instanceof Project) {
                $taskEntity = new Task();
                $taskEntity->setTaskName($taskName);
                $taskEntity->setProject($projectEntity);
                $projectEntity->addTask($taskEntity);
                $this->_em->persist($taskEntity);
                $this->_em->persist($projectEntity);
                $this->_em->flush();
            } else {
                echo '类型错误！';
                return false;
            }
            return true;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

}