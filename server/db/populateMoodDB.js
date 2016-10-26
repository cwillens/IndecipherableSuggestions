var mongoose = require('mongoose');
var request = require('request');
var db = require('./dbConfig');
var SavedPlaylistController = require('./controller/savedPlaylist');

var playlistUris = {
  '1KuPMhQ4z7oIq3zdQEZP0V': 'Soak Up The Sun', /* beachy vibes */
  '2gtr2Tf686zXqjQNiYNPQW': 'Autumn Leaves', /* rainy day fall vibes */
  '5eSMIpsnkXJhXEPyRQCTSc': 'Life Sucks', /* bad day vibes */
  '16BpjqQV1Ey0HeDueNDSYz': 'Afternoon Acoustic', /* self-explanatory */
  '7jyyxDxMmtNs1UeLEOpJcE': 'Songs for Sunsets',
  '6uTuhSs7qiEPfCI3QDHXsL': 'Mood Booster' /* happy songs */
};

for (var plist in playlistUris) {
  var options = {
    method: 'GET', 
    url: 'https://api.spotify.com/v1/users/spotify/playlists/' + plist + '/tracks', 
    headers: {
      /* will have to change the access token when it expires */
      'Authorization': 'Bearer BQDH0FcanWZkVX3ucRbEv8hXbwgNsGC3HHVXirGgzUe7fUzbVDb-7BuAUf3BhPSdsfZoubltqMDNKB0G2_B83Eo5ig6T0Al8tgvN0Upv4XWhD3EWgXFAJ04jYnspVSXdHNRkVECIs75TlMyxplNUObLL9H5HHu2phfu3Y9ApcSJiV6e3WvXY0tZBsh_F6I_8GTMzchHZul52I4oR2Sl_5I0EYg2kqedM79vIrI-kw_D2wbtEQEhuG50'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      console.log(error);
    } else if (!error && response.statusCode == 200) {

      var info = JSON.parse(body);
      var uris = [];

      for (var i = 0; i < info.items.length; i++ ) {
        uris.push(info.items[i].track.uri);
      }
      var uri = info.href.split('/')[info.href.split('/').length - 2];
      // console.log(uri, ' ', playlistUris[uri], ' ', uris);

      SavedPlaylistController.insertOne({
        playlist_name:  playlistUris[uri],
        playlist_id: uri,
        uri_array: JSON.stringify(uris)}, function(err, entry) {
        console.log('saved to database ', entry);
        }
      );
    }
  });    
}