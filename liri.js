var keys = require("./keys.js");
var Twitter = require("twitter");

var client = new Twitter(keys.twitter);

function getTweets(){
	client.get("statuses/user_timeline", function(error, tweets, response){
		tweets.forEach(function(tweet){
			console.log(tweet.text + " " + tweet.created_at + " By " + tweet.user.screen_name);
		});
	});
}

function liriWatcher(command){
	switch(command){
		case "my_tweets":
			getTweets();
			break;
		default:
			console.log("Sorry I didn't understand that. Please try again.");
	}
}

liriWatcher(process.argv[2]);