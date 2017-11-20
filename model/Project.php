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

    public function saveProject($projectName)
    {
        try {
            $projectEntity = new Project();
            $projectEntity->setProjectName($projectName);
            $this->_em->persist($projectEntity);
            $this->_em->flush($projectEntity);
            return true;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }
}