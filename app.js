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

var trainingSongInfo_global;
var testingSongInfo_global;
var client_id = 'd171b87bddde4f62b14525463e1bb3f1'; // Your client id
var client_secret = '956fbe6cddef4cfa80bfcd2d0f879712'; // Your secret

var testingSample;
var testingValues = ""

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

//Return all songs from the track_links list containing URLs
let getSongsFromURL = track_links => {
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
//Return all songs from album IDs
let getSongsFromAlbumID = album_ids => {
  promises = []
  for(let i = 0; i < album_ids.length ; i++){
    promises.push(
      new Promise( resolve => {
        url = "https://api.spotify.com/v1/albums/" + album_ids[i] + "/tracks"
        accessSpotifyAPI(url)
        .then(body => {resolve(body.items)})
    }))
  }
  return Promise.all(promises)
}

//Get song information like name, artist and popularity
let getSongInformationFromTrack = async songs => {
  for(let i = 0; i < songs.length ; i++){
    for(let k = 0; k < songs[i].length ; k++){
      console.log(songs[i][k])
      if(songs[i][k] == null){continue}
      promises.push(
        new Promise( resolve => {
          resolve(    
            songinfo = {
              id: songs[i][k].track.id,
              name: songs[i][k].track.name,
              artist: songs[i][k].track.artists[0].name,
              popularity: songs[i][k].track.popularity
          })
        })
      )
    }
  }
  return await Promise.all(promises) //Returns a list of song Objects 
}

let getSongInformation = async songs => {
  for(let i = 0; i < songs.length ; i++){
    for(let k = 0; k < songs[i].length ; k++){
      if(songs[i][k] == null){continue}
      promises.push(
        new Promise( resolve => {
          resolve(    
            songinfo = {
              id: songs[i][k].id,
              name: songs[i][k].name,
              artist: songs[i][k].artists[0].name,
              popularity: songs[i][k].popularity
          })
        })
      )
    }
  }
  return await Promise.all(promises) //Returns a list of song Objects 
}

let getTrackIDFromAlbum = async songs => {
  promises = []
  for(let i = 0; i < songs.length ; i++){
    for(let k = 0; k < songs[i].length ; k++){
      promises.push(
        new Promise( resolve => {
          resolve(songs[i][k].id)
        })
      )
    }
  }
  return await Promise.all(promises) //Returns a list of song Objects 
}


//Get all the playlist links from the body of the response
let getLinks = body => {
  return new Promise((resolve, reject) => {
    var tracks = [];
    var playlist_links = []
    var track_features = [];
    var maxtracks = 10000;
    var nbtracks_curr = 0;

    playlists = body.playlists.items;
    nextPlaylists = body.playlists.next; //Limit of 50, not currently used

    // Iterate over all playlists (limit 50)
    for (let i = 0; i < playlists.length; i++) {
      
      owner = playlists[i].owner.display_name;
      //Only take Spotify playlists
      if(owner == "Spotify"){ 
        playlist_links.push(playlists[i].tracks.href);
        nbtracks = playlists[i].tracks.total;
        nbtracks_curr += nbtracks;
      }
    }
    console.log("Number of songs:", nbtracks_curr);    
    resolve(playlist_links)
  })
}

//Get song features from their IDs
let getSongFeaturesFromID = async songInfoList =>  {
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
  

/****************************************************************************************

Extract 50 playlists from Spotify as owner and extract the song features and information
to be used as a training sample

********************************************************************************************/

let getTrainingSample = (myUrl) => {
  
  //Request authorization from Spotify
  rp(authOptions)
  .then(body => {
    // use the access token to access the Spotify Web API
    accessToken = body.access_token;
    //Extract 50 Spotify playlists
    url = myUrl;
    return accessSpotifyAPI(url)
  })
  .then(body => {
    return getLinks(body)
  })
  .then(playlist_links => {
    return getSongsFromURL(playlist_links)
  })
  .then(songs => {
    return getSongInformationFromTrack(songs)
  })
  .then(songInfoList => {
    //Store in global variable
    trainingSongInfo_global = songInfoList;
    return getSongFeaturesFromID(songInfoList)
  })
  .then(songFeaturesList => {
    
    featuresArray = []
    nbIter = 0
    toDrop = []
    
    //Extract every features object 
    for (let i = 0; i < songFeaturesList.length; i++) {
      if(songFeaturesList[i] != null){
        //Iterate over the keys of each object
        Object.keys(songFeaturesList[i]).forEach(key => {
          for(let k = 0; k < songFeaturesList[i][key].length; k++) {
            nbIter++
            //Check if not null and remember index to drop
            if(songFeaturesList[i][key][k] == null) {
              toDrop.push(nbIter)
              continue
            }
            //Delete unnecessary features
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
      trainingSongInfo_global.splice(index, 1) 
    }
    
    //Merge two name and features
    for(let i = 0; i < trainingSongInfo_global.length; i++){
      if(featuresArray[i] == null) {continue}
      featuresArray[i]["name"] = trainingSongInfo_global[i]["name"]
      featuresArray[i]["artist"] = trainingSongInfo_global[i]["artist"]
      featuresArray[i]["popularity"] = trainingSongInfo_global[i]["popularity"]
    }

    
    //Write to JSON file
    // var json = JSON.stringify(featuresArray);
    // fs.writeFile('trainingsample.json', json, 'utf8', () => console.log("Done"));
    
    return featuresArray
    
  })
  .catch(error => console.log(error))
}
      
      
      
      
/**************************************************************************************** 

Extract New Releases from Spotify as owner and extract the song features and information
to be used as a test sample

********************************************************************************************/
let getNewReleases = myUrl => {
  //Request authorization from Spotify
  rp(authOptions)
  .then(body => {
    // use the access token to access the Spotify Web API
    accessToken = body.access_token;
    //Extract 50 Spotify playlists
    url = myUrl
    return accessSpotifyAPI(url)
  })
  .then(body => {
    var new_albums = body.albums.items
    var album_ids = []
    for(let i = 0; i <  new_albums.length; i++){
      album_ids.push(new_albums[i].id)
    }
    return getSongsFromAlbumID(album_ids)
  })
  .then(tracks_from_albums => {
    return getSongInformation(tracks_from_albums)
  }).then(songInformation => {
    testingSongInfo_global = songInformation
    return getSongFeaturesFromID(songInformation)
  }).then(songFeaturesList => {

    featuresArray = []
    nbIter = 0
    toDrop = []
    
    //Extract every features object 
    for (let i = 0; i < songFeaturesList.length; i++) {
      if(songFeaturesList[i] != null){
        //Iterate over the keys of each object
        Object.keys(songFeaturesList[i]).forEach(key => {
          for(let k = 0; k < songFeaturesList[i][key].length; k++) {
            nbIter++
            //Check if not null and remember index to drop
            if(songFeaturesList[i][key][k] == null) {
              toDrop.push(nbIter)
              continue
            }
            //Delete unnecessary features
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
      testingSongInfo_global.splice(index, 1) 
    }
    //Merge name and features
    for(let i = 0; i < testingSongInfo_global.length; i++){
      if(featuresArray[i] == null) {continue}


      if(testingSongInfo_global[i]["name"] != undefined) {
        featuresArray[i]["name"] = testingSongInfo_global[i]["name"]
        featuresArray[i]["artist"] = testingSongInfo_global[i]["artist"]
        featuresArray[i]["popularity"] = null
      }
      else{ //Somehow the format is different from one track to another
        featuresArray[i]["name"] = testingSongInfo_global[i][0]["name"]
        featuresArray[i]["artist"] = testingSongInfo_global[i][0]["artist"]
        featuresArray[i]["popularity"] = null
      }
    }


    keys = ["danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo", "duration_ms", "time_signature", "name", "artist", "popularity"]
    for (let i = 0; i < featuresArray.length; i++) {
      testingValues += '['
      for (let k = 0; k < keys.length; k++){
        if(typeof featuresArray[i][keys[k]] == "string"){
          if(keys[k] != "popularity") {
            testingValues +=  featuresArray[i][keys[k]] + ','
          }else{
            testingValues +=  featuresArray[i][keys[k]]
          }
        }        
        else if(typeof featuresArray[i][keys[k]] == "number"){
          if(keys[k] != "popularity") {
            testingValues +=  featuresArray[i][keys[k]].toString() + ','
          }else{
            testingValues +=  featuresArray[i][keys[k]].toString()
          }
        }        
        else if(typeof featuresArray[i][keys[k]] == "object"){
          if(keys[k] != "popularity") {
            testingValues +=  JSON.stringify(featuresArray[i][keys[k]]) + ','
          }else{
            testingValues +=  JSON.stringify(featuresArray[i][keys[k]])
          }
        }
      }

      if(i != featuresArray.length-1) {
        testingValues += '],'
      }else{
        testingValues += ']'
      }      
    }
    console.log(testingValues)

      
  })
  //   //Write to JSON file
  //   var json = JSON.stringify(featuresArray);
  //   fs.writeFile('testsample2.json', json, 'utf8', () => console.log("Done"));
  // })
  .catch(e => console.log(e))
}

// url = 'https://api.spotify.com/v1/search?q=Spotify&type=playlist&offset=0&limit=50'
// getTrainingSample(url) 


url ="https://api.spotify.com/v1/browse/new-releases?country=BE&limit=50"
getNewReleases(url)