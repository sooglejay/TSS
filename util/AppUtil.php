<?php
namespace TSS;

/**
 * Created by PhpStorm.
 * User: sooglejay
 * Date: 17/12/2
 * Time: 17:48
 */
class AppUtil
{
    public function getWeekIdByTime($time)
    {
        // 获取星期几
        $n = date("w", $time);
        if ($n == 0) {
            $time -= 7 * 24 * 60 * 60;
        } else {
            $time -= ($n - 1) * 24 * 60 * 60;
        }
        $weekId = strtotime(date('Y-m-d', $time));//周一的零点作为weekId
        return $weekId;
    }
}