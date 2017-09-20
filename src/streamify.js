/* eslint-disable no-console */
import util from  'util';
import {config} from './config/configuration';
import childProcess from 'child_process';

export function streamify(source, playlist, out) {
    var exec = childProcess.exec;
    let transform = `ffmpeg -i ${source}.mp4 -map 0    -codec:v libx264 -codec:a aac   -f ssegment -segment_list ${playlist}.m3u8   -segment_list_flags +live -segment_time 10   ${out}%03d.ts`
    exec(transform, {cwd: config.videos}, function (error, stdout, stderr) {
        console.error(util.inspect(error ? error : "success"));
        console.error(util.inspect(stdout));
        console.error(util.inspect(stderr));
    });
}


