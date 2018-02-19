var request = require('request');
var fs = require('fs');
var secrets = require('./secrets.js');


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
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
  	  console.log(`Downloading image to ${filePath}...`);
  	})
  	.pipe(fs.createWriteStream(`./${filePath}`))
    .on('finish', function() {
      console.log('Download complete.');
    });
}

getRepoContributors("jquery", "jquery", function(result) {
  result.forEach(function(element) {
  	downloadImageByURL(element.avatar_url, `avatar/${element.login}.png`);
  });
});