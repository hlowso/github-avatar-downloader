var request = require('request');
var fs = require('fs');
require('dotenv').config();

if(!fs.existsSync('./.env')) throw new Error(".env file missing...");
if(!('TOKEN' in process.env)) throw new Error("TOKEN missing from .env...");

// This handles input errors.
var owner_repo = process.argv.slice(2);
if(owner_repo.length !== 2) throw new Error("you haven't passed the arguments correctly!");

var headers = {
  'User-Agent': 'request',
  'Authorization': `token ${process.env.TOKEN}`
};

function getRepoContributors(repoOwner, repoName, cb, bigResolve) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: headers
  };

  request(options, function(err, res, body) {
    var arr = JSON.parse(body);
    // This handles the faulty owner or repo error
    if(arr.message === "Not Found") {
      console.log("No such owner or repo...");      
    }
    // And this is for bac credentials
    else if(arr.message === "Bad credentials") {
      console.log("You are not authorized to access the data. Check your GitHub token");
    }
    else cb(arr, bigResolve);
  });
}


function getRecommendation(result, bigResolve) {

  var urls = [];
  var p = new Promise((resolve, reject) => {
    result.forEach(function(element, i) {
      urls.push(`https://api.github.com/users/${element.login}/starred`);
      if(i === result.length - 1) {
        resolve();
      }
    });
  });

  p.then(function() {

    var recommendations = {};
    var counter = 0;
    for(var j = 0; j < urls.length; j ++) {
      options = {
        url: urls[j],
        headers: headers
      };
      
      p2 = new Promise((resolve, reject) => {
        request(options, function(err, res, body) {
          arr = JSON.parse(body);
          for(var k = 0; k < arr.length; k ++) {
            e = arr[k];
            let key = `${e.owner.login} / ${e.name}`;
            if(recommendations[key] === undefined) {
              recommendations[key] = 1;
            }
            else {
              recommendations[key] ++;
            }
          }
          resolve();        
        });
      });
      p2.then(function(value) {
        if(counter === urls.length - 1) {
          bigResolve(recommendations);
        }
        else {
          counter ++;
        }
      });
    }
  
  }); 
}

var p = new Promise((resolve, reject) => {
  getRepoContributors(owner_repo[0], owner_repo[1], getRecommendation, resolve);
});
p.then(function(value) {
  var arr = [];
  for(var key in value) {
    arr.push({ pair: key, count:value[key]});
  }
  arr.sort(function(a, b) {
    return a.count - b.count;
  });
  for(var i = 1; i <= 5; i ++) {
    var index = arr.length - i;
    console.log('[', arr[index].count, ' stars ]', arr[index].pair);
  }
});


// console.log(recs);

// var arr = [];

// for(var key in obj) {
//   arr.push({ pair: key, count: obj[key]});
// }



// console.log(arr);




