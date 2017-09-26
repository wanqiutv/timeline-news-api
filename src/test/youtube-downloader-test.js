import {download} from '../youtube-downloader'
import videoManager from '../mongodb/video-manager';
import mongoose from 'mongoose';
import chai from 'chai';
async function test() {
    await videoManager.save({name: "test", rawUrl: "https://www.youtube.com/watch?v=ZCTPzUEwsJs"});
    download(async function () {
        let video = await videoManager.findOne('test');
        chai.expect(video).to.have.property('localUrl');
        await videoManager.delete("test");
        await mongoose.disconnect();
    })
}
test().catch(function () {
   mongoose.disconnect();
});
