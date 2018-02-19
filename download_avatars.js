var request = require('request');
var fs = require('fs');
require('dotenv').config();

if(!fs.existsSync('./.env')) throw ".env file missing...";
if(!('TOKEN' in process.env)) throw "TOKEN missing from .env...";

// This handles input errors.
var owner_repo = process.argv.slice(2);
if(owner_repo.length !== 2) throw "ERROR: you haven't passed the arguments correctly!";

// This ensures that the directory will be there if it
// isn't already.
var dir = './avatar/';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${process.env.TOKEN}`
    }
  };

  request(options, function(err, res, body) {
    var arr = JSON.parse(body);
    // This handles the faulty owner or repo error
    if(arr.message === "Not Found") {
      console.log("No such owner or repo...");      
    }
    else cb(arr);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  	.on('error', function(err){
  	  throw err;
  	})
  	.on('response', function(response){
  	  console.log(`Downloading image to ${dir}${filePath}...`);
  	})
  	.pipe(fs.createWriteStream(`${dir}${filePath}`));
}

console.log('Welcome to the GitHub Avatar Downloader!');
getRepoContributors(owner_repo[0], owner_repo[1], function(result) {
  result.forEach(function(element) {
  	downloadImageByURL(element.avatar_url, `${element.login}.png`);
  });
});