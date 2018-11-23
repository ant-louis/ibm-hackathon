/**Copyright 2012-2016 Spotify AB

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var request = require('request'); // "Request" library

var client_id = 'd171b87bddde4f62b14525463e1bb3f1'; // Your client id
var client_secret = '956fbe6cddef4cfa80bfcd2d0f879712'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};


request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {

      url: 'https://api.spotify.com/v1/search?q=Spotify&type=playlist&offset=0&limit=50',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    var next;
    var tracks = [];
    var track_links = []
    var track_features = [];
    var maxtracks = 10000;
    var nbtracks_curr = 0;
    //while(nbtrack_curr < maxtracks)

    request.get(options, function(error, response, body) {
        playlists = body.playlists.items;
        nextPlaylists = body.playlists.next; //Limit of 50
        // Iterate over all playlists (limit 50)
      for (let i = 0; i < playlists.length; i++) {
        
        owner = playlists[i].owner.display_name;
        //Only take Spotify playlists
        if(owner == "Spotify"){ 
          track_links.push(playlists[i].tracks.href);
          nbtracks = playlists[i].tracks.total;
          nbtracks_curr += nbtracks;
        }
      }
      console.log(track_links)
      console.log(nbtracks_curr);
    })
  }
});