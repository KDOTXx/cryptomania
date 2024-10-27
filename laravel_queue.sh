#!/bin/bash
php /var/www/html/artisan queue:work --sleep=0.01 &
laravel-echo-server start &
queue:work crash --queue=crash_tick --timeout=0 --sleep=0.01 &
queue:work crash --queue=crash_finish --tries=3 --sleep=0.01 &
game:chain all
