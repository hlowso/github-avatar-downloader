var request = require('request');
var fs = require('fs');
require('dotenv').config();

var owner_repo = process.argv.slice(2);
if(owner_repo.length !== 2) throw "ERROR: you haven't passed the arguments correctly!";

var dir = './avatar/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${process.env.TOKEN}`
    }
  };

  request(options, function(err, res, body) {
  	if(err) throw err;
    var arr = JSON.parse(body);
    cb(arr);
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

getRepoContributors(owner_repo[0], owner_repo[1], function(result) {
  result.forEach(function(element) {
  	downloadImageByURL(element.avatar_url, `${element.login}.png`);
  });
});