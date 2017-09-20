/* eslint-disable no-console */
import restify from 'restify';
import { youtubeDownloader } from './youtube-downloader';
import mongoose from 'mongoose';
import videoManager from './mongodb/videoManager';

process.once('SIGUSR2', function() {
    shutdown('SIGUSR2');
});

process.on('SIGINT', function() {
    shutdown('SIGINT');
});

process.on('SIGTERM', function() {
    shutdown('SIGINT');
});

process.on('exit', function() {
    shutdown('exit');
});

function shutdown(status) {
    console.log(status);
    mongoose.disconnect();
    process.exit();
}

function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
}

var server = restify.createServer();

// server.use(restify.plugins.bodyParser());
server.use(restify.plugins.jsonBodyParser());
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.post('/youtube/videos',function(req,res,next){
    let body = req.body;
    videoManager.save(body).then(function(video){
        res.send(video);
        next();
    });
});

youtubeDownloader();

server.listen(8089, function () {
  console.log('%s listening at %s', server.name, server.url);
});