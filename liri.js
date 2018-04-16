var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require('fs');

require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = process.argv;

var appName = userInput[2];
var searchTerm = process.argv.slice(3).join('+');

function commands() {
    if (userInput[2] === "my-tweets") {
        twitterThis();
    }

    else if (userInput[2] === "spotify-this-song") {
        spotifyThis();
    }

    else if (userInput[2] === "movie-this") {
        movieThis();
    }

    else if (userInput[2] === "do-what-it-says") {
        doThis();
    };

};

commands();

// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
function twitterThis() {

    var params = { screen_name: 'swordnthestone' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            tweets.forEach(function (tweet) {
                console.log("~~~~~~~~~~Your Tweets~~~~~~~~~~");
                console.log(tweet.created_at);
                console.log(tweet.text);
            })
        }
    });

}


function spotifyThis() {

    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songs = data.tracks.items[0];

        console.log("~~~~~~~~~~Spotify Results~~~~~~~~~~");
        console.log(songs.artists[0].name);
        console.log(songs.name);
        console.log(songs.preview_url);
        console.log(songs.album.name);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });
}

function movieThis() {

    request("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("~~~~~~~~~~Movie Info~~~~~~~~~~");
            console.log("~~~~Movie Title~~~~");
            console.log(JSON.parse(body).Title);
            console.log("~~~~Movie Year~~~~");
            console.log(JSON.parse(body).Year);
            console.log("~~~~Imdb Rating~~~~");
            console.log(JSON.parse(body).imdbRating);
            console.log("~~~~Country where it was produced~~~~");
            console.log(JSON.parse(body).Country);
            console.log("~~~~Language~~~~");
            console.log(JSON.parse(body).Language);
            console.log("~~~~Movie Plot~~~~");
            console.log(JSON.parse(body).Plot);
            console.log("~~~~Actors in the Movie~~~~");
            console.log(JSON.parse(body).Actors);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

        } else{
            console.log('Mr. Nobody')
        }

    });

}

function doThis(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        if(dataArr[0] === "spotify-this-song"){
            appName = dataArr[0];
            searchTerm = dataArr[1];
            spotifyThis();
        }
      
      });
}