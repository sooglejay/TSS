<?php
namespace TSS;

use Doctrine\ORM\EntityRepository;

require_once dirname(__FILE__) . '/../model/User.php';

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
        }
        return false;
    }
}