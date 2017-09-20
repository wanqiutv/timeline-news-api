/**
 * Created by bzhang on 19/09/2017.
 */
import mongoose from 'mongoose';
import videoManager from '../mongodb/videoManager';
videoManager.save({name: "xxx"}).then(function (ret) {
// eslint-disable-next-line no-console
    console.log(ret);
    mongoose.disconnect();
}).catch(function (ret) {
// eslint-disable-next-line no-console
    console.log(ret);
    mongoose.disconnect();
});
