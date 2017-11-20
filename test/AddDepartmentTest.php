<?php
namespace TSS;
require_once dirname(__FILE__) . '/../bootstrap.php';
require_once dirname(__FILE__) . '/../model/Department.php';

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 21:53
 */
class AddDepartmentTest extends App
{
    /**
     * AddUserTest constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->add("研发部");
        $this->add("人力资源部");
        $this->add("市场部");
    }

    protected function add($departmentName)
    {
        $departmentRepo = $this->entityManager->getRepository('TSS\Department');
        if ($departmentRepo instanceof DepartmentRepository) {
            $departmentRepo->saveDepartment($departmentName);
        }
    }
}

new AddDepartmentTest();