import mongoose from 'mongoose';
import {config} from '../config/configuration';
mongoose.connect(config.mongodb, {useMongoClient: true, promiseLibrary: global.Promise});
mongoose.Promise = global.Promise;
var videoSchema = mongoose.Schema({name: String, rawUrl: String, localUrl: String, hlsUrl: String});
let Video = mongoose.model("Video", videoSchema);
export default {
    save: function (video) {
        let model = new Video(video);
        return model.save();
    },
    streams: function () {
        let query = Video.find({hlsUrl: {$ne: null}});
        return query.exec();
    },
    sources: function () {
        let query = Video.find({rawUrl: {$ne: null}, localUrl: {$eq: null}});
        return query.exec();
    }
}

