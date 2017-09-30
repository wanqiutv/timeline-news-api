/* eslint-disable no-console */
import util from  'util';
import {config} from './config/configuration';
import childProcess from 'child_process';
import winston from 'winston';

export function streamify(name, playlist, out, callback) {
    var exec = childProcess.exec;
    let transform = `ffmpeg -i ${name}.mp4 -map 0   -codec:v libx264 -codec:a aac   -f ssegment -segment_list ${playlist}.m3u8   -segment_list_flags +live -segment_time 10   ${out}%03d.ts`
    exec(transform, {cwd: `${config.videos}/${name}`}, function (error, stdout, stderr) {
        winston.log('error',util.inspect(error ? error : "success"));
        if(!error && callback instanceof Function){
           callback();
        }
        winston.info('error',util.inspect(stdout));
        winston.info('error',util.inspect(stderr));
    });
}


