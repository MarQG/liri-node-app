var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");


var twtClient = new Twitter(keys.twitter);
var sptSearch = new Spotify(keys.spotify);


function appendLog(str) {
    fs.appendFile("log.txt", "LIRI Log: " + str + "\r\n", function (err) {
        if (err) {
            return console.log("Error occured: " + err);
        }
    });
}

function getTweets() {
    twtClient.get("statuses/user_timeline", function (error, tweets, response) {
        tweets.forEach(function (tweet) {
            appendLog(tweet.text + " " + tweet.created_at + " By " + tweet.user.screen_name);
            console.log(tweet.text + " " + tweet.created_at + " By " + tweet.user.screen_name);
        });
    });
}

function findMovie(movie) {
    var OMDBUrl = "http://www.omdbapi.com/?apikey=" + keys.omdb.api_key;
    if (movie === undefined || movie === "") {
        OMDBUrl += "&t=Mr+Nobody&type=movie";
    } else {
        OMDBUrl += "&t=" + movie + "&type=movie";
    }
    request(OMDBUrl, function (error, response, body) {
        if (error) {
            return console.log("Error occured: " + err);
        }
        if (response.statusCode === 200) {
            var foundMovie = JSON.parse(body);
            if(foundMovie.Response === "True"){
                appendLog("Title: " + foundMovie.Title);
                appendLog("Year: " + foundMovie.Year);
                appendLog("IMDB Rating: " + foundMovie.Ratings[0].Value);
                if (foundMovie.Ratings.length > 1) {
                    appendLog("Rotten Tomatoes: " + foundMovie.Ratings[1].Value);
                } else {
                    appendLog("Rotten Tomatoes: ");
                }
                appendLog("Country: " + foundMovie.Country);
                appendLog("Plot: " + foundMovie.Plot);
                appendLog("Actors: " + foundMovie.Actors);

                console.log("Title: " + foundMovie.Title);
                console.log("Year: " + foundMovie.Year);
                console.log("IMDB Rating: " + foundMovie.Ratings[0].Value);
                if (foundMovie.Ratings.length > 1) {
                    console.log("Rotten Tomatoes: " + foundMovie.Ratings[1].Value);
                } else {
                    console.log("Rotten Tomatoes: ");
                }
                console.log("Country: " + foundMovie.Country);
                console.log("Plot: " + foundMovie.Plot);
                console.log("Actors: " + foundMovie.Actors);
            } else {
                appendLog("Sorry I couldn't find a movie named: " + movie);
            console.log("Sorry I couldn't find a movie named: " + movie);
            }
            
        } else {
            console.log("Error code: " + response.statusCode);
        }
    });
}

function findSong(song) {
    if (song === undefined || song === "") {
        song = "The Sign Ace of Base";
    }
    sptSearch.search({
        type: 'track',
        query: song,
        limit: 5
    }, function (err, data) {

        if (err) {
            return console.log("Error occured: " + err);
        }
        if(data.tracks.items.length > 0){
            data.tracks.items.forEach(function(item){

                appendLog("Song Name: " + item.name);
                appendLog("Artist: " + item.album.artists[0].name);
                appendLog("Album: " + item.album.name);
                appendLog("Preview URL: " + item.preview_url);
                appendLog("======================\n");

                console.log("Song Name: " + item.name);
                console.log("Artist: " + item.album.artists[0].name);
                console.log("Album: " + item.album.name);
                console.log("Preview URL: " + item.preview_url);
                console.log("======================\n");
            });
        } else {
            appendLog("Sorry I couldn't find a song named: " + song);
            console.log("Sorry I couldn't find a song named: " + song);
        }
    });
}

function loadFile() {
    fs.readFile("./random.txt", 'utf8', function (err, data) {
        if (err) {
            return console.log("Error occured: " + err);
        }
        var fileread = data.split(",");
        var command = fileread[0];
        var argument = fileread[1];
        liriWatcher(command, argument);
    });
}

function processArg(arg){
    var results = [];
    arg.slice(3).forEach(function(item){
        results.push(item);
    });
    return results.join(" ");
}

function liriWatcher(command) {
    var argument = processArg(process.argv);
    appendLog(command + " " + argument);
    switch (command) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            findSong(argument);
            break;
        case "movie-this":
            findMovie(argument);
            break;
        case "do-what-it-says":
            loadFile();
            break;
        default:
            console.log(
                "Sorry I didn't understand that.\n"+
                "Please try one of the following commands: \n" +
                "To get your tweets: my-tweets \n"+
                "To get a song use: spotify-this-song <song_name> \n"+
                "To get a movie use: movie-this <movie_name> \n"+
                "I can read commands from files with: do-what-it-says \n"
                );
    }
}

liriWatcher(process.argv[2]);
