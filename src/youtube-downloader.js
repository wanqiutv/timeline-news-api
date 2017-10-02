import schedule from 'node-schedule';
import {config} from './config/configuration.js';
import videoManager from './mongodb/video-manager';
import winston from 'winston';
import mkdirp from 'mkdirp-promise';
import childProcess from 'child_process';
import util from 'util';
import {streamify} from './streamify';

export function localDir(name) {
    let dirPath = `${config.videos}/${name}`;
    return dirPath;
}
export async function downloadThenStream(callback) {
    download(function (source) {
        streamify(source.name, 'playlist', 'out', callback);
    })
}

export async function download(completeCallback) {
    let sources = await videoManager.sources();
    let count = 0;
    let total = sources.length;
    winston.log('info', `start ${total} download tasks`);
    sources.forEach(async function (source) {
        let dirPath = localDir(source.name);
        await mkdirp(dirPath);
        winston.info('info', dirPath);
        var exec = childProcess.exec;
        let download = `youtube-dl ${source.rawUrl} -f mp4 -o ${source.name}.mp4`;

        exec(download, {cwd: `${dirPath}`}, function (error, stdout, stderr) {
            winston.log('error', util.inspect(error ? error : "success"));
            if (!error && completeCallback instanceof Function) {
                completeCallback(source);
                count++;
                winston.info('info', `complete the ${count} task`);
                source.localUrl = `${dirPath}/${source.name}.mp4`;
                videoManager.save(source);
            } else {
                winston.info('info', `failed the ${count} task`);
            }
            winston.info('error', util.inspect(stdout));
            winston.info('error', util.inspect(stderr));
        });
    });
}

export var scheduleYoutubeDownloadingJob = function () {
    let cronExpression = '*/4 * * *';
    if (config.state == 'develop') {
        cronExpression = '*/5 * * * *';
    }
    return schedule.scheduleJob(cronExpression, () => {
        downloadThenStream();
    });
}





