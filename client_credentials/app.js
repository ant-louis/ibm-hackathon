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


var rp = require('request-promise'); // "Request" library

var client_id = 'd171b87bddde4f62b14525463e1bb3f1'; // Your client id
var client_secret = '956fbe6cddef4cfa80bfcd2d0f879712'; // Your secret
var accessToken;
// Application requests authorization
var authOptions = {
  method: 'POST',
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};


let accessSpotifyAPI = url => {
      var options = {
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        json: true
      };
      return rp(options)
}


// let getSongs = track_links => {
//   return new Promise((resolve, reject) => {
//     songs = []
    
//     for(let i = 0; i < track_links.length ; i++){
//       body = accessSpotifyAPI(track_links[0])
//       songs.push(body.items)

//     }


//   })
// }

// let getSongInformation = track_links => {
//   return new Promise((resolve, reject) => {
//     var song_ids = [];
//     var song_names = [];
//     var song_popularity = [];
//     var song_artists = [];

//     tracks = track_links[0]
//       song_ids[i] = tracks[i].track.id;
//       song_names[i] = tracks[i].track.name;
//       song_popularity[i] = tracks[i].track.popularity;
//       song_artists[i] = tracks[i].track.artists[0].name;
//     }
//   })
// }

let getTrackLinks = body => {
  return new Promise((resolve, reject) => {
    var tracks = [];
    var track_links = []
    var track_features = [];
    var maxtracks = 10000;
    var nbtracks_curr = 0;
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
    console.log(nbtracks_curr);
    console.log(track_links)
    
    resolve(track_links)
  })
}
  
  
  //Request authorization from Spotify
rp(authOptions)
.then(body => {
    // use the access token to access the Spotify Web API
    accessToken = body.access_token;
    url = 'https://api.spotify.com/v1/search?q=Spotify&type=playlist&offset=0&limit=50';
    return accessSpotifyAPI(url)
})
.then(body => {
  return getTrackLinks(body)
// })
// .then(track_links => {
//   return getSongs(track_links)
})
.catch(error => console.log(error))






//         https://api.spotify.com/v1/playlists/37i9dQZF1DWZxM58TRkuqg/tracks




// Get the new releases of Belgium
//https://api.spotify.com/v1/browse/new-releases?country=BE&limit=50

//Get the new releases of Belgium
//https://api.spotify.com/v1/browse/new-releases?country=NL&limit=50

//Get the new releases of Belgium
//https://api.spotify.com/v1/browse/new-releases?country=FR&limit=50