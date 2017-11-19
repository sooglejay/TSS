<?php
namespace TSS;

use Doctrine\ORM\EntityRepository;

ini_set('date.timezone', 'Asia/Shanghai');

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/11/19
 * Time: 19:44
 * @Entity(repositoryClass="UserRepository")
 * @Table(name="tss_user")
 */
class User
{
    /** @Id  @GeneratedValue @Column(type="integer") */
    protected $id;

    /**
     * @Column(type="string")
     * @var
     */
    protected $displayName;

    /**
     * @Column(type="string")
     * @var
     */
    protected $gid;

    /**
     * @Column(type="string")
     * @var
     */
    protected $password;

    /**
     * @ManyToOne(targetEntity="Department",inversedBy="users")
     * @JoinColumn(name="department_id", referencedColumnName="id")
     * @var
     */
    protected $department;

    /**
     * @Column(type="string")
     * @var
     */
    protected $email;

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
    public function getDisplayName()
    {
        return $this->displayName;
    }

    /**
     * @param $displayName
     * @return $this
     */
    public function setDisplayName($displayName)
    {
        $this->displayName = $displayName;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getGid()
    {
        return $this->gid;
    }

    /**
     * @param $gid
     * @return $this
     */
    public function setGid($gid)
    {
        $this->gid = $gid;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDepartment()
    {
        return $this->department;
    }

    /**
     * @param $department
     * @return $this
     */
    public function setDepartment($department)
    {
        $this->department = $department;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     * @return $this
     */
    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @param $email
     * @return $this
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }
}

class UserRepository extends EntityRepository
{

    public function saveUser($displayName, $gid, $password, $email, $departmentName)
    {
        $departmentEntity = $this->_em->getRepository('Department')->findOneBy(array('departmentName' => $departmentName));

        if ($departmentEntity instanceof Department) {
            $userEntity = new User();
            $userEntity->setDisplayName($displayName)
                ->setEmail($email)
                ->setGid($gid)
                ->setPassword($password)
                ->setDepartment($departmentEntity);
            $departmentEntity->addUsers($userEntity);
            $this->_em->persist($userEntity);
            $this->_em->persist($departmentEntity);
            $this->_em->flush();
        }
    }

}