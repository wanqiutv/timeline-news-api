/**
 * Created by bzhang on 19/09/2017.
 */
import mongoose from 'mongoose';
import videoManager from '../mongodb/video-manager';
import chai from 'chai';
async function test(){
    let video = await videoManager.save({name: "test"});
    chai.expect(video).to.have.property("_id");
    await videoManager.delete(video.name);
    video = await videoManager.findOne("test");
    chai.expect(video).to.equal(null);
}
test().finally(function () {
   mongoose.disconnect();
});
