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
var json2csv = require('json2csv');
var fs = require('fs');

var songsWithFeatures;
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

//Return all songs from the track_links list
let getSongs = track_links => {
  promises = []
  for(let i = 0; i < track_links.length ; i++){
    promises.push(
      new Promise( resolve => {
        accessSpotifyAPI(track_links[i])
        .then(body => {resolve(body.items)})
    }))
  }
  return Promise.all(promises)
}


let getSongInformation = async songs => {
  promises = []
  for(let i = 0; i < songs.length ; i++){
    for(let k = 0; k < songs[i].length ; k++){
      promises.push(
        new Promise( resolve => {
          resolve(    
            songinfo = {
              id: songs[i][k].track.id ,
              name: songs[i][k].track.name,
              artist: songs[i][k].track.artists[0].name,
              popularity: songs[i][k].track.popularity
          })
        })
      )
    }
  }
  return await Promise.all(promises) 
}

// let getSongFeatures = songInfoList => {
//   promises = []
//   // console.log(songInfoList[0])
//   url = "https://api.spotify.com/v1/audio-features?ids=52AWJPKuELTY9TjwHzXuhl" //+ songInfoList[0].id
//   console.log(url)
//   return accessSpotifyAPI(url).then(body => {
//     console.log(body)
//     return body
//   })
  // for(let i = 0; i < songInfoList.length ; i = i + 100){
  //   promises.push(
  //     new Promise(resolve => {
  //       url = "https://api.spotify.com/v1/audio-features?ids" + songInfoList[i].id
  //       // Create url with 100 IDs
  //       for(let k = i + 1; k < i + 100 && k < songInfoList.length; k++) {
  //         console.log(k)
  //         // url = url + "%2C" + songInfoList[k].id
  //       }
  //       accessSpotifyAPI(url)
  //       .then(body => {
  //         // console.log(body)
  //         resolve()
  //       })
  //     })
  //   )
  // }
  // return Promise.all(promises) 
// }

let getLinks = body => {
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
    resolve(track_links)
  })
}

let test = async songInfoList =>  {
  promises = []
  for (let i = 0; i < songInfoList.length ; i = i + 100){
    promises.push(
      new Promise(resolve => {
        url = "https://api.spotify.com/v1/audio-features?ids=" + songInfoList[i].id

        // Create url with 100 IDs
        for(let k = i + 1; k < i + 100 && k < songInfoList.length; k++) {
          url = url + "%2C" + songInfoList[k].id
        }
        accessSpotifyAPI(url)
        .then(body => {resolve(body)})
      })
    )
  }
  return await Promise.all(promises) 
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
  return getLinks(body)
})
.then(track_links => {
  return getSongs(track_links)
})
.then(songs => {
  return getSongInformation(songs)
})
.then(songInfoList => {
  console.log(songInfoList.length)
  songsWithFeatures = songInfoList;
  promises = []
  //Fetch 100 track features with one call

  // async function printFiles () {
  //   const files = await getFilePaths()
  
  //   for await (const file of fs.readFile(file, 'utf8')) {
  //     console.log(contents)
  //   }
  // }

  // async function printFiles () {
  //   const files = await getFilePaths();
  
  //   await Promise.all(files.map(async (file) => {
  //     const contents = await fs.readFile(file, 'utf8')
  //     console.log(contents)
  //   }));
  // }

  // for (let i = 0; i < songInfoList.length ; i = i + 100){
  //   promises.push(
  //     new Promise(resolve => {
  //       url = "https://api.spotify.com/v1/audio-features?ids=" + songInfoList[i].id

  //       // Create url with 100 IDs
  //       for(let k = i + 1; k < i + 100 && k < songInfoList.length; k++) {
  //         url = url + "%2C" + songInfoList[k].id
  //       }
  //       accessSpotifyAPI(url)
  //       .then(body => {resolve(body)})
  //     })
  //   )
  // }
  // return await Promise.all(promises) 
  return test(songInfoList)
})
.then(songFeaturesList => {


  featuresArray = []
  // console.log(songFeaturesList[3]["audio_features"][5].danceability)
  // console.log(songFeaturesList[9]["audio_features"][65].danceability)
  // console.log(songFeaturesList[17]["audio_features"][5].danceability)
  // console.log(songFeaturesList[6]["audio_features"][82].danceability)
  // console.log(songFeaturesList[1]["audio_features"][5].danceability)
  // console.log(songFeaturesList[0]["audio_features"][0].danceability)
  
  //Extract every features object 
  // console.log(songFeaturesList[8])
  nbIter = 0
  toDrop = []
  for (let i = 0; i < songFeaturesList.length; i++) {
    if(songFeaturesList[i] != null){
      Object.keys(songFeaturesList[i]).forEach(key => {
        // console.log(songFeaturesList[i][key].length)

        for(let k = 0; k < songFeaturesList[i][key].length; k++) {
          nbIter++
          //Delete unnecessary features
          if(songFeaturesList[i][key][k] == null) {
            toDrop.push(nbIter)
            continue
          }
          // console.log(songFeaturesList[7][key][40])
          delete songFeaturesList[i][key][k].type
          delete songFeaturesList[i][key][k].id
          delete songFeaturesList[i][key][k].uri
          delete songFeaturesList[i][key][k].track_href
          delete songFeaturesList[i][key][k].analysis_url
          featuresArray.push(songFeaturesList[i][key][k])
        } //end for 
      }) //end for each
    }
  } //end for

  //Drop entries where features were not retrieved
  for(index in toDrop){
    songsWithFeatures.splice(index, 1) 
  }

  //Merge two name and features
  for(let i = 0; i < songsWithFeatures.length; i++){
    if(featuresArray[i] == null) {continue}
    featuresArray[i]["name"] = songsWithFeatures[i]["name"]
    featuresArray[i]["artist"] = songsWithFeatures[i]["artist"]
    featuresArray[i]["popularity"] = songsWithFeatures[i]["popularity"]
  }

  console.log(songsWithFeatures.length, featuresArray.length)

  var json = JSON.stringify(featuresArray);
  fs.writeFile('trainingsample.json', json, 'utf8', () => console.log("Done"));

  return featuresArray
  
}).then(featuresArray => {

  myFields = ['danceability', 'energy', 'key',
  "loudness","mode","speechiness",
  "acousticness","instrumentalness","liveness",
  "valence","tempo","duration_ms","time_signature"]

  json2csv.parse({data: featuresArray[0], fields:myFields}, function(err, csv) {
    if (err) console.log(err);
    fs.writeFile('test.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
  }); //end json2csv
})
// .then(songFeatures => {console.log("Done",songFeatures)})
.catch(error => console.log(error))






//         https://api.spotify.com/v1/playlists/37i9dQZF1DWZxM58TRkuqg/tracks




// Get the new releases of Belgium
//https://api.spotify.com/v1/browse/new-releases?country=BE&limit=50

//Get the new releases of Belgium
//https://api.spotify.com/v1/browse/new-releases?country=NL&limit=50

//Get the new releases of Belgium
//https://api.spotify.com/v1/browse/new-releases?country=FR&limit=50