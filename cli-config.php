<?php
// cli-config.php
namespace TSS;
require_once "bootstrap.php";
$app = new App();
return \Doctrine\ORM\Tools\Console\ConsoleRunner::createHelperSet($app->entityManager);
