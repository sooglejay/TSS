<?php
namespace TSS;

require_once dirname(__FILE__) . '/../bootstrap.php';
require_once dirname(__FILE__) . '/../model/User.php';

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 21:53
 */
class AddUserTest extends App
{


    /**
     * AddUserTest constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->add();
    }

    protected function add()
    {
        $userRepo = $this->entityManager->getRepository('TSS\User');
        if ($userRepo instanceof TssUserRepository) {
            $userRepo->saveUser("蒋维", "Gid001", "1234", "1234@qq.com", "研发部");
            $userRepo->saveUser("蒋力", "Gid002", 'root', "root@qq.com", "人力资源部");
        }
    }
}

new AddUserTest();