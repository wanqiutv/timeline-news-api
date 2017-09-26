/* eslint-disable no-console */
import restify from 'restify';
import { scheduleYoutubeDownloadingJob } from './youtube-downloader';
import mongoose from 'mongoose';
import videoManager from './mongodb/video-manager';
import winston from 'winston';

winston.add(winston.transports.File, { filename: 'timeline-news-api.log' });

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



var server = restify.createServer();

server.use(restify.plugins.jsonBodyParser());

server.get('/hello/:name', respond);



server.post('/youtube/videos',function(req,res,next){
    let body = req.body;
    videoManager.save(body).then(function(video){
        res.send(video);
        next();
    });
});

scheduleYoutubeDownloadingJob();

server.listen(8089, function () {
  console.log('%s listening at %s', server.name, server.url);
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