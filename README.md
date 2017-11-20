# TSS

This is a project in sole purpose of learning javascript


$ composer install
$ vendor/bin/doctrine orm:schema-tool:create


Doctrine 数据库管理快捷命令

//全部删除
vendor/bin/doctrine orm:schema-tool:drop --force

//新建数据库
vendor/bin/doctrine orm:schema-tool:create

//更新数据库表
vendor/bin/doctrine orm:schema-tool:update --force
