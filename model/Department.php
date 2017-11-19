<?php
namespace TSS;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityRepository;

ini_set('date.timezone', 'Asia/Shanghai');

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 19:44
 * @Entity(repositoryClass="DepartmentRepository")
 * @Table(name="tss_department")
 */
class Department
{
    /** @Id  @GeneratedValue @Column(type="integer") */
    protected $id;

    /**
     * @Column(type="string")
     * @var
     */
    protected $departmentName;

    /**
     * @OneToMany(targetEntity="User",mappedBy="department")
     */
    protected $users;

    /**
     * Project constructor.
     */
    public function __construct()
    {
        $this->users = new ArrayCollection();
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
    public function getDepartmentName()
    {
        return $this->departmentName;
    }

    /**
     * @param mixed $departmentName
     */
    public function setDepartmentName($departmentName)
    {
        $this->departmentName = $departmentName;
    }

    /**
     * @return mixed
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param User $users
     */
    public function addUsers($users)
    {
        $this->users = $users;
    }

}

class DepartmentRepository extends EntityRepository
{

    public function saveDepartment($departmentName)
    {
        try {
            $entity = new Department();
            $entity->setDepartmentName($departmentName);
            $this->_em->persist($entity);
            $this->_em->flush($entity);
            return true;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }
}