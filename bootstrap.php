<?php
namespace TSS;
session_start();
// bootstrap.php
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;

require_once "vendor/autoload.php";
require_once dirname(__FILE__) . './model/Department.php';
require_once dirname(__FILE__) . './model/User.php';
require_once dirname(__FILE__) . './model/Task.php';
require_once dirname(__FILE__) . './model/Project.php';
require_once dirname(__FILE__) . './model/Work.php';

class App
{

    public $departmentRepo;
    public $projectRepo;
    public $taskRepo;
    public $workRepo;
    public $userRepo;


    private $isDevMode = true;
// database configuration parameters
    private $conn = array(
        'dbname' => 'tss',
        'user' => 'root',
        'password' => 'root',
        'host' => 'localhost:3307',
        'driver' => 'pdo_mysql',
    );

    public $entityManager;

    /**
     * App constructor.
     */
    public function __construct()
    {
        $config = Setup::createAnnotationMetadataConfiguration(array(__DIR__ . "/model"), $this->isDevMode, __DIR__ . "/proxy");
        $this->entityManager = EntityManager::create($this->conn, $config);
    }
}
