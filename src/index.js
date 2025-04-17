const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
var cors = require("cors");
var path = require("path");
const app = express();

var http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 5000;

var clientGlob = null;
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

getAudio = async (videoURL, res) => {
  console.log(videoURL);

  const {title, author} = await ytdl.getInfo(videoURL).then((info) => {
    console.log("title:", info.videoDetails.title);
    console.log("rating:", info.player_response.videoDetails.averageRating);
    console.log("uploaded by:", info.videoDetails.author.name);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '');
    const author = info.videoDetails.author.name.replace(/[^a-zA-Z0-9]/g, '');
    return {title, author};
  });

  var stream = ytdl(videoURL, {
    quality: "highestaudio",
    filter: "audioonly",
  })
    .on("progress", (chunkSize, downloadedChunk, totalChunk) => {
      // console.log(downloadedChunk);
      // clientGlob.emit("progressEventSocket", [
      //   (downloadedChunk * 100) / totalChunk,
      // ]);
      // clientGlob.emit("downloadCompletedServer", [downloadedChunk]);
      if (downloadedChunk == totalChunk) {
        console.log("Downloaded");
      }
    })
    .pipe(fs.createWriteStream(`${title}.mp3`), res);
};


app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors());

//root handler that sends the parameters to getAudio function
app.post("/", (req, res) => {
  getAudio(req.body.url, res);
});

//socket.io connection
// io.on("connection", (client) => {
//   clientGlob = client;
//   console.log("User connected");
// });

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});