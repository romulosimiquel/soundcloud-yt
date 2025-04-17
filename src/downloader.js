const fs = require("fs");
const ytdl = require("@distube/ytdl-core");

var clientGlob = null;
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

getAudio = async (videoURL, res) => {
  const {title, author} = await ytdl.getInfo(videoURL).then((info) => {
    // console.log("title:", info.videoDetails.title);
    // console.log("rating:", info.player_response.videoDetails.averageRating);
    // console.log("uploaded by:", info.videoDetails.author.name);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '');
    const author = info.videoDetails.author.name.replace(/[^a-zA-Z0-9]/g, '');
    return {title, author};
  });

  var stream = ytdl(videoURL, {
    quality: "highestaudio",
    filter: "audioonly",
  })
    .on("progress", (chunkSize, downloadedChunk, totalChunk) => {
      console.log(downloadedChunk);
      clientGlob.emit("progressEventSocket", [
        (downloadedChunk * 100) / totalChunk,
      ]);
      if (downloadedChunk == totalChunk) {
        console.log("Downloaded");
        clientGlob.emit('download-complete', {
          filename: `${title}.mp3`,
          filesize: totalChunk
        });
      }
    })
    .pipe(fs.createWriteStream(`${title}.mp3`), res);
};

// io.on("connection", (client) => {
//   clientGlob = client;
//   console.log("User connected aqui");
// });

module.exports = { getAudio }
