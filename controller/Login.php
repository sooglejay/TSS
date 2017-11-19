<?php
/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 21:11
 */

namespace TSS;


class Login extends App
{


    /**
     * Login constructor.
     */
    public function __construct()
    {
        parent::__construct();
        if (!isset($_POST['userName'])) {
            echo json_encode(array('code' => 201, 'message' => '请输入用户名'));
            return;
        }
        if (!isset($_POST['password'])) {
            echo json_encode(array('code' => 201, 'message' => '请输入用户名密码'));
            return;
        }
        $userName = $_POST['userName'];
        $password = $_POST['password'];

        echo json_encode($this->login($userName, $password));
    }

    private function login($userName, $password)
    {
        $result = array();
        $result['code'] = 201;
        $result['message'] = '未知错误';
        $userEntity = $this->entityManager->getRepository('User')->findOneBy(array('displayName' => $userName, 'password' => $password));
        if ($userEntity instanceof User) {
            $_SESSION['userName'] = $userEntity->getDisplayName();
            $_SESSION['userID'] = $userEntity->getId();
            $result['message'] = '登录成功！';
            $result['code'] = 200;
        } else {
            $result['message'] = '用户名或密码不匹配！';
        }
        return $result;
    }

}