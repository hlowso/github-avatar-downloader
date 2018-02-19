var request = require('request');
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

getRepoContributors("jquery", "jquery", function(result) {
  result.forEach(function(element) {
  	console.log(element.login, element.avatar_url);
  });
});