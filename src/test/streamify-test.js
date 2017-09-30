import {streamify} from '../streamify';
import {localDir} from '../youtube-downloader';
import fs from 'fs';
import chai from 'chai';
import {download} from '../youtube-downloader'
import videoManager from '../mongodb/video-manager';
import mongoose from 'mongoose';
import rimraf from 'rimraf';

let playlist = 'playlist';
let name = 'test';
async function test() {
    let video = {name: "test", rawUrl: "https://www.youtube.com/watch?v=ZCTPzUEwsJs"};
    await videoManager.save(video);
    download(async function () {
        let video = await videoManager.findOne('test');
        chai.expect(video).to.have.property('localUrl');
        await videoManager.delete("test");
        await mongoose.disconnect();
        streamify(name,playlist,'out',function () {
            let dirPath = localDir(name);
            let path = `${dirPath}/${playlist}.m3u8`;
            chai.expect(fs.existsSync(path)).to.equal(true);
            rimraf.sync(localDir(video.name));
        });
    })
    let promise = new Promise(function (resolve,reject) {
        resolve(video);
        reject(video);
    });
    return promise;
}
test().catch(function (video) {
    mongoose.disconnect();
    rimraf.sync(localDir(video.name));
    videoManager.delete("test");
});


