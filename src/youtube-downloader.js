import schedule from 'node-schedule';
import ytdl from 'ytdl-core';
import {config} from './config/configuration.js';
import fs from 'fs';
function download() {
    ytdl('https://www.youtube.com/watch?v=CT-j2HAhvn0', {
        filter: function (format) {
            return format.container === 'mp4';
        }
    }).pipe(fs.createWriteStream(config.videos + '/test.mp4'));
}
export var youtubeDownloader = function () {
    return schedule.scheduleJob('45  * * * *', function () {
        download();
    });
}


