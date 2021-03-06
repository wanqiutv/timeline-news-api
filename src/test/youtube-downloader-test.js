import {download} from '../youtube-downloader'
import videoManager from '../mongodb/video-manager';
import {localDir} from '../youtube-downloader';
import mongoose from 'mongoose';
import rimraf from 'rimraf';
import chai from 'chai';
async function test() {
    let video = {name: "test", rawUrl: "https://www.youtube.com/watch?v=ZCTPzUEwsJs"};
    await videoManager.save(video);
    download(async function () {
        let video = await videoManager.findOne('test');
        chai.expect(video).to.have.property('localUrl');
        await videoManager.delete("test");
        await mongoose.disconnect();
        rimraf.sync(localDir(video.name));
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
});
