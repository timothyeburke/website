
var tweetBaseUrl = 'http://search.twitter.com/search.json';
var tweetQueryUrl = '?q=%40etsy&result_type=recent&rpp=5&include_entities=1';
var tweetCallback = '&callback=processTweetData';

//http://search.twitter.com/search.json?q=%40etsy&result_type=recent&rpp=5&include_entities=1&callback=processTweetData

var bitlyBaseUrl = 'https://api-ssl.bitly.com/v3/expand?login=belcorriko&apiKey=R_2d3462107b36046167aac5a7cf1429da&callback=processBitlyData&hash=';


//https://openapi.etsy.com/v2/public/listings/71017860/images.js?api_key=s29jzluzm8pb2bhinpxjve80&callback=processImageData

var etsyUrl = 'https://openapi.etsy.com/v2/public/listings/99999999.js?api_key=s29jzluzm8pb2bhinpxjve80&callback=processEtsyData';

var waitingForBitlyData = [];
var waitingForEtsyData = [];
var waitingForImageData = [];
var readyToShow = [];

$(document).ready(function () {
	// Recurring calls to keep the page running
	setInterval(function () {
		if (readyToShow.length < 5) {
			injectScript(tweetBaseUrl + tweetQueryUrl + tweetCallback, 'tweetScript');
		}
		if(waitingForBitlyData.length > 0) {
			getBitlyData();
		}
		if(waitingForEtsyData.length > 0) {
			getEtsyData();
		}
		if(waitingForImageData.length > 0) {
			getImageData(waitingForImageData.shift());
		}
	}, 500);
	setInterval(function () {
		if (readyToShow.length > 0) {
			showItem(readyToShow.shift());
		}
	}, 10000);

	// Initial page load
	setTimeout(function () { 
		if (readyToShow.length > 0) {
			showItem(readyToShow.shift());
		}
	}, 4000);
});

function getBitlyData() {
	// Inject a script to call bitly API to process URL string
	$.each(waitingForBitlyData, function (key, value) {
		if(value.bitlyInProcess == undefined) {
			value.bitlyInProcess = true;
			value.bitlyProcessStartTime = new Date();
			injectScript(bitlyBaseUrl + value.entities["urls"][0].expanded_url.replace("http://etsy.me/",""), 'bitlyScript');
		}
	});
}

function processBitlyData(data) {
	// Remove the injected script
	removeScript('bitlyScript');

	// If there was an error, RUN AWAY!
	if (data.error != undefined) {
		return;
	}

	// Fetch some values from the data stream gotten back from Bitly
	var hash = data.data["expand"][0].hash;
	var long_url = data.data["expand"][0].long_url;
	
	// Try and find the item in the waitingForBitly queue
	var item = null;
	$.each(waitingForBitlyData, function (key, value) {
		if (value.entities["urls"][0].expanded_url.replace("http://etsy.me/","") == hash) {
			item = value;
			return;
		}
	});

	// FOUND IT! YAAAAAAAAAY!
	if (item != null) {
		// Set some values at the root of the item and then check if it is a listing
		item.hash = hash;
		item.long_url = long_url;
		// If it is a listing, push it into the next queue
		if (item.long_url.indexOf("listing") != -1) {
			waitingForEtsyData.push(item);
		}

		// Find the index the current item has within the waitingForBitly queue
		var index = -1;
		for(var i = 0; i < waitingForBitlyData.length; i++) {
			if(waitingForBitlyData[i].hash == hash) {
				index = i;
			}
		}

		// When found, remove it from the array because we have passed it on to the wiatingForEtsy queue
		if (index != -1) {
			waitingForBitlyData = waitingForBitlyData.splice(index, 1);
		}

	}
}

function getEtsyData() {
	// Inject a script to call Etsy API to process listing data
	$.each(waitingForEtsyData, function (key, value) {
		if(value.etsyInProcess == undefined) {
			value.etsyInProcess = true;
			value.etsyProcessStartTime = new Date();
			var listingId = value.long_url.match(/[0-9]+/);
			value.listingId = listingId;
			injectScript(etsyUrl.replace('99999999', listingId), 'etsyScript')
		}
	});
}

function processEtsyData(data) {
	// Remove the injected script
	removeScript('etsyScript');

	// If there was an error, RUN AWAY!
	if (data.error != undefined || data.results[0] == undefined) {
		return;
	}

	var listingId = data.results[0]['listing_id'].toString();
	var title = data.results[0]['title'] == undefined ? "" : data.results[0]['title'].toString();
	var price = data.results[0]['price'].toString();
	var currency = data.results[0]['currency_code'].toString();
	var description = data.results[0]['description'].toString();

	// Try and find the item in the waitingForEtsy queue
	var item = null;
	$.each(waitingForBitlyData, function (key, value) {
		if (value.listingId == listingId) {
			item = value;
			return;
		}
	});

	// FOUND IT! YAAAAAAAAAY!
	if (item != null) {
		// Set some values at the root of the item and then check if it is a listing
		item.title = title;
		item.price = price;
		item.currency = currency;
		item.description = description;

		// Push it into the next queue
		waitingForImageData.push(item);

		// Find the index the current item has within the waitingForEtsy queue
		var index = -1;
		for(var i = 0; i < waitingForEtsyData.length; i++) {
			if(waitingForEtsyData[i].listingId == listingId) {
				index = i;
			}
		}

		// When found, remove it from the array because we have passed it on to the wiatingForEtsy queue
		if (index != -1) {
			waitingForEtsyData = waitingForEtsyData.splice(index, 1);
		}

	}

}

function getImageData(item) {
	readyToShow.push(item);

	// Inject a script to call Etsy API to process image data

}

function processImageData(data) {
	// Remove the injected script
	removeScript('imageScript');

	// If there was an error, RUN AWAY!
	if (data.error != undefined) {
		return;
	}
}

function showItem(item) {
	// Make the div to contain the item
	var newRow = "<div class='row_entry'>Tweet: " + item.text.replace(item.entities["urls"][0].url,"<a href='" + item.entities["urls"][0].url + "' target='_blank'>" + item.entities["urls"][0].url + "</a>");

	// Add the long URL of the item
	newRow += "<br>URL: <a href='" + item.long_url + "' target='_blank'>" + item.long_url + "</a>";

	newRow += "<br>Title: " + item.title;
	newRow += "<br>Price: " + item.price + item.currency;

	// Add the queue size, time since fetched
	//newRow += "<br>Queue size: " + readyToShow.length.toString();
	//newRow += "<br>Time since Fetched: " + calculateItemTimeDifference(item) + "<br>";
	
	// Add the closing of the div
	newRow += " <br><br></div>";

	// Place the new div at the top of the show area
	$("#tweets").prepend(newRow);

	// These divs start off hidden.  Show it
	$(".row_entry").each(function () {
		$(this).show(250);
	});

	// Remove any extra so we only show a max of three at a time
	$(".row_entry:gt(3)").each(function () {
		$(this).hide(250, function () {
			$(this).remove();
		});
	});

	$("#loading").hide(10, function () {
		$(this).remove();
	});
}

function processTweetData (data) {
	// Remove the script that called this function
	removeScript('tweetScript');

	// If there was an error, RUN AWAY!
	if (data.error != undefined) {
		removeScript('tweetScript');
		return;
	}

	// Save off the place to pick up new items
	tweetQueryUrl = data.refresh_url;

	// Only keep up to five responses (could get a flood)
	var max = 5;

	// Iterate over the list
	$.each(data.results, function (key, value) {
		// If we've already stored away three, stop.
		if (max <= 0) {
			removeScript('tweetScript');
			return;
		}

		// If the tweet contains a "etsy.me" URL, keep it and decrement the counter
		if (value.entities["urls"][0] != undefined) {
			if (value.entities["urls"][0].expanded_url.indexOf("etsy.me") != -1) {
				// Add the time we fetched this item
				value.fetched = new Date();

				// Push into the next queue for processing
				waitingForBitlyData.push(value);

				// Decrement the counter
				max--;
			}
		} 	
	});
}

function calculateItemTimeDifference(item) {
	var fetchedSecs = new Date(item.fetched).getTime();
	var nowDate = new Date();
	var nowSecs = nowDate.getTime();
	return (nowSecs - fetchedSecs) / 1000;
}

function injectScript(Url, key) {
	var headID = document.getElementById("scripts");
	var newScript = document.createElement('script');
	newScript.id = key;
	newScript.type = 'text/javascript';
	newScript.src = Url;
	headID.appendChild(newScript);
}

function removeScript(key) {
	var script;
	while (script = document.getElementById(key)) {
	    script.parentNode.removeChild(script);
	    for (var prop in script) {
	      	delete script[prop];
	    }
	}
}