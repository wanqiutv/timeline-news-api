import schedule from 'node-schedule';
import ytdl from 'ytdl-core';
import {config} from './config/configuration.js';
import fs from 'fs';
import videoManager from './mongodb/video-manager';
import winston from 'winston';
import mkdirp from 'mkdirp-promise';

export function localDir(name){
    let dirPath = `${config.videos}/${name}`;
    return dirPath;
}
export async function download(completeCallback) {
    let sources = await videoManager.sources();
    let count = 0;
    let total = sources.length;
    winston.log('info',`start ${total} download tasks`);
    sources.forEach(async function (source) {
        let dirPath = localDir(source.name);
        await mkdirp(dirPath);
        let localUrl = `${dirPath}/${source.name}.mp4`;
        let downloadStream = ytdl(source.rawUrl, {
            filter: function (format) {
                return format.container === 'mp4';
            }
        });
        let localFileStream = fs.createWriteStream(localUrl);
        downloadStream.pipe(localFileStream);
        downloadStream.on('error', function (error) {
            winston.log('error',error);
            winston.log('error','download stream error. close the local file stream');
            localFileStream.close();
        });
        localFileStream.on('error', function (error) {
            winston.log('error',error);
            winston.log('error','local file stream error. close the download file stream');
            downloadStream.close();
        })
        localFileStream.on('finish',function () {
            source.localUrl = localUrl;
            count++;
            winston.log('info',`complete ${count}/${total}. ${localUrl}`);
            videoManager.save(source);
            if(count == total){
                winston.log('info',`complete the all ${total} tasks`);
                if(completeCallback instanceof  Function){
                    completeCallback();
                }
            }
        });
    });
}

export var scheduleYoutubeDownloadingJob = function () {
    return schedule.scheduleJob('45  * * * *', () => {
        download();
    });
}





