import restify from 'restify';
import { youtubeDownloader } from './youtube-downloader.js';
function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
youtubeDownloader();

server.listen(8089, function () {
// eslint-disable-next-line no-console
  console.log('%s listening at %s', server.name, server.url);
});