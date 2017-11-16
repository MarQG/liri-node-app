var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");


var twtClient = new Twitter(keys.twitter);
var sptSearch = new Spotify(keys.spotify);


function appendLog(str){
	fs.appendFile("log.txt", "LIRI Log: " + str + "\r\n", function(err){
		if(err){
			console.log("Error occured: " + err);
		}
	})
}

function getTweets(){
	twtClient.get("statuses/user_timeline", function(error, tweets, response){
		tweets.forEach(function(tweet){
			appendLog(tweet.text + " " + tweet.created_at + " By " + tweet.user.screen_name);
			console.log(tweet.text + " " + tweet.created_at + " By " + tweet.user.screen_name);
		});
	});
}

function findMovie(movie){
	var OMDBUrl = "http://www.omdbapi.com/?apikey=" + keys.omdb.api_key;
	if(movie === undefined){
		OMDBUrl += "&t=Mr+Nobody&type=movie";
	} else {
		OMDBUrl += "&t=" + movie + "&type=movie";
	}
	request(OMDBUrl, function(error, response, body){
		if(error){
			return console.log("Error occured: " + err);
		}
		if(response.statusCode === 200){
			var foundMovie = JSON.parse(body);
			appendLog("Title: " + foundMovie.Title);
			appendLog("Year: " + foundMovie.Year);
			appendLog("IMDB Rating: " + foundMovie.Ratings[0].Value);
			if(foundMovie.Ratings.length > 1){
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
			if(foundMovie.Ratings.length > 1){
				console.log("Rotten Tomatoes: " + foundMovie.Ratings[1].Value);
			} else {
				console.log("Rotten Tomatoes: ");
			}
			console.log("Country: " + foundMovie.Country);
			console.log("Plot: " + foundMovie.Plot);
			console.log("Actors: " + foundMovie.Actors);
		} else {
			console.log("Error code: " + response.statusCode);
		}
	});
}

function findSong(song){
	if(song === undefined){
		song = "The Sign Ace of Base";
	} 
	sptSearch.search({ type: 'track', query: song, limit: 1}, function(err, data){
		if(err){
			return console.log("Error occured: " + err);
		}
		appendLog(data.tracks.items[0].album.artists[0].name);
		appendLog(data.tracks.items[0].album.name);
		appendLog(data.tracks.items[0].name);	
		appendLog(data.tracks.items[0].preview_url);
		console.log(data.tracks.items[0].album.artists[0].name);
		console.log(data.tracks.items[0].album.name);
		console.log(data.tracks.items[0].name);	
		console.log(data.tracks.items[0].preview_url);	
	});
}

function loadFile(){
	fs.readFile("./random.txt", 'utf8', function(err, data){
		if(err){
			return console.log("Error occured: " + err);
		}
		var fileread = data.split(",");
		var command = fileread[0];
		var argument = fileread[1];
		liriWatcher(command, argument);
	});
}

function liriWatcher(command, argument){
	appendLog(command + " " + argument);
	switch(command){
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
			console.log("Sorry I didn't understand that. Please try again.");
	}
}

liriWatcher(process.argv[2], process.argv[3]);