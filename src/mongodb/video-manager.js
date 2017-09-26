import mongoose from 'mongoose';
import {config} from '../config/configuration';
mongoose.connect(config.mongodb, {useMongoClient: true, promiseLibrary: global.Promise});
mongoose.Promise = global.Promise;
var videoSchema = mongoose.Schema({name: String, rawUrl: String, localUrl: String, hlsUrl: String});
let Video = mongoose.model("Video", videoSchema);
export default {
    save: async function (video) {
        let model = new Video(video);
        return await model.save();
    },
    streams: async function () {
        let query = Video.find({hlsUrl: {$ne: null}});
        return await query.exec();
    },
    sources: async function () {
        let query = Video.find({rawUrl: {$ne: null}, localUrl: {$eq: null}});
        return await query.exec();
    },
    delete: async function (name) {
        return await Video.remove({name: name});
    },
    findOne: async function (name) {
       let query = Video.findOne({name : name});
       return await query.exec();
    }
}

