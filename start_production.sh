#!/bin/sh

forever stop /home/godong/clip_web/server/bin/www
forever start /home/godong/clip_web/server/bin/www

cd batch
forever stop /home/godong/clip_web/batch/batch.js mode=development
forever start /home/godong/clip_web/batch/batch.js mode=development