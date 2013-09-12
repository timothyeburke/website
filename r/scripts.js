var map;         // the map object
var rawData;     // raw fetched data (XML)
var pointsData;  // Holds loaded points
var heatmap;     // The heatmap overlay
var heatmapData; // The current data in the heatmap overlay
var typesData;   // Crime counts by type
var typesKeys;   // Crime types
var plot1;       // Crime Types histogram
var plot2;       // Crimes on Days of Week hisogram

// fetch the kml data file
function getData(_10k) {
    // If true, get the 10k file, else get the 3k
    var file = _10k ? "sfCrimeData10k.kml" : "sfCrimeData3k.kml";

    // Fetch the selected file and on success, process it
    $.ajax({
        url: file,
        dataType: "xml",
        error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR:" + textStatus);
        },
        success: processData
    });
}

// method to compute the selected data points
function getSelectedPoints() {
    // Fetch the list of selected types and shifts
    var selectedTypes = getSelectedTypes();
    var selectedShifts = getSelectedShifts();

    // Create the container to hold the points
    var selectedPoints = [];

    // Iterate over the collectio of points
    for(var i = 0; i < pointsData.length; i++) {
        // If the point is one of the selected types...
        if($.inArray(pointsData[i].type, selectedTypes) != -1
            // and if the point is in the selected shift(s)...
            && $.inArray(pointsData[i].shift, selectedShifts) != -1) {
            // ...add it to the heatmap
            selectedPoints.push(pointsData[i]);
        }
    }

    // return the list of selected points
    return selectedPoints;
}

// method to get the currently selected shifts as a list
function getSelectedShifts() {
    // new list!
    var list = [];

    // get a handle on the shifts inner div
    var $shifts = $('#shifts').find(".inner");

    // Find the checkboxes, for each...
    $shifts.find(':checkbox').each(function () {
        // ... if checked ...
        if(this.checked) {
            // Get the checkbox value and push the apropriate
            // shift number into the list.
            var val = $(this).val();
            if(val == "first") {
                list.push(1);
            } else if (val == "second") {
                list.push(2);
            } else if (val == "third") {
                list.push(3);
            } else {
                // do nothing.
            }  
        }
    });

    // Return the list of selected shifts
    return list;
}

// method to get the currently selected types as a list
function getSelectedTypes() {
    // New list!
    var list = [];

    // Get a handle on the types inner div
    var $types = $('#types').find(".inner");

    // Find the checkboxes, for each...
    $types.find(':checkbox').each(function () {
        // ... if checked ... 
        if(this.checked) {
            // ... add to list.
            list.push($(this).val());
        }
    });

    // return the list of selected crime types
    return list;
}

// Called on load, used like $(document).ready()
function initialize() {
    // Load and setup the map
    setupMap();

    // Load the map points data
    // parameter: load 10k data?
    getData(true);
}

// method to process the loaded data file
function processData (data, textStatus, jqXHR) {
    // Initialize some of the global scope variables
    rawData = data;
    pointsData = [];
    heatmapData = [];
    typesData = {};
    
    // For each placemark element in the fetched KML (XML) file...
    $(rawData).find("Placemark").each(function () {
        // Get a handle on the item as a native JavaScript object.
        // XML2jsobj borrowed from @craigbuckler.  Detailed attribution
        // in xml2jsobj.js
        var spot = XML2jsobj(this);

        // Fetch the lat/long as a string, and split...
        var latlon = spot.Point.coordinates.split(",");
        // ... into float objects for the spot
        spot.Point.lon = parseFloat(latlon[0]);
        spot.Point.lat = parseFloat(latlon[1]);
        
        // Parse the date string and put into a JS date object
        spot.date = new Date(Date.parse(spot["gx:TimeStamp"].when));
        
        // Push the spot into the points
        pointsData.push(spot);

        // While we are here, grab the type and url and point back to themselves
        spot.type = spot.ExtendedData.Data[0];
        spot.url = spot.ExtendedData.Data[1];

        // And update the types list
        if(typesData[spot.type] == undefined) {
            typesData[spot.type] = 1;
        } else {
            typesData[spot.type] += 1;
        }

        // Calculate the shift
        if(spot.date.getHours() >= 7 && spot.date.getHours() < 15) {
            spot.shift = 1;
        } else if (spot.date.getHours() >= 15 && spot.date.getHours() < 23) {
            spot.shift = 2;
        } else {
            spot.shift = 3;
        }
        
        // This generates a map to the spot data!
        // alert(spot.type); // TYPE!
        // alert(spot.url); // URL
        // alert(spot.Point.coordinates);
        // alert(spot.Point.lat);
        // alert(spot.Point.lon);
        // alert(spot.description);
        // alert(spot.name);
        // alert(spot.date);
        // alert(spot.shift);
    });

    // Create the options list
    updateOptions();

    // Update the hisograms and then the map
    updateHistogramsThenMap();
}

// Initialize the map
function setupMap() {
    var mapOptions = {
        center: new google.maps.LatLng(37.735155,-122.443657),
        zoom: 12,
        //disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    // sfCrime = new google.maps.KmlLayer('http://www.timburke.co/r/sfCrimeData3k.kml');
    // sfCrime.setMap(map);
}

// method to update the heat map
function updateHeatMap(selectedPoints) {
    // Empty the heatmap data
    heatmapData = [];

    // For each point, add the lat/long as a point to the heatmap
    // data to be visualized on the map
    for(var i = 0; i < selectedPoints.length; i++) {
        heatmapData.push(new google.maps.LatLng(selectedPoints[i].Point.lat, selectedPoints[i].Point.lon));
    }

    // if the heatmap is not undefined...
    if(heatmap != undefined) {
        // ... clear it
        heatmap.setMap(null);
    }

    // initialize the heatmap with the added data
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 15,
        opacity: .8
    });

    // And add to the map
    heatmap.setMap(map);
}

// method to update the histograms
function updateHistograms(selectedPoints) {
    // Create a count list for the days of the week, and for
    // day of week labels
    var days = [0, 0, 0, 0, 0, 0, 0];
    var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Clear the types data
    typesData = {};

    // Recalculate the types data based on the currently selected points
    // and while we're here, keep count of the day of week for each point
    // for the day of week histogram
    for(var i = 0; i < selectedPoints.length; i++) {
        days[selectedPoints[i].date.getDay()] += 1;
        if(typesData[selectedPoints[i].type] == undefined) {
            typesData[selectedPoints[i].type] = 1;
        } else {
            typesData[selectedPoints[i].type] += 1;
        }
    }

    // New list for the types keys 
    typesKeys = [];

    // Grab the keys based on the selected types data
    for(var key in typesData) {
        typesKeys.push(key.toString());
    }

    // Sort the keys
    typesKeys = typesKeys.sort().reverse();


    // Get the count of each type of selected point
    var counts = [];
    for (var i = 0; i < typesKeys.length; i++) {
        counts.push(typesData[typesKeys[i]]);
    }
    
    // Make a histogram of the counts data.
    // Used jqplot library 
    // http://www.jqplot.com/
    plot1 = $.jqplot('chart1', [counts], {
        seriesDefaults: {
            renderer:$.jqplot.BarRenderer,
            pointLabels: { show: true, location: 'e', edgeTolerance: -5 },
            shadowAngle: 135,
            rendererOptions: {
                barDirection: 'horizontal'
            }
        },
        axes: {
            yaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: typesKeys
            }
        }
    });
    
    // Make a histogram of the number of selected points
    // by day of week
    plot2 = $.jqplot('chart2', [days], {
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {fillToZero: true}
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: dayOfWeek
            },
            yaxis: {
                pad: 1.05,
                tickOptions: {formatString: '%d'}
            }
        }
    });

    // Redraw the plots to clear any old versions of the charts
    plot1.redraw();
    plot2.redraw();
}

// method to update the histograms and heatmap
function updateHistogramsThenMap() {
    // Get the collection of points based on the options selected
    var selectedPoints = getSelectedPoints();

    // If there are no points in the collection, alert the user.
    if(selectedPoints.length == 0) {
        $("#warning").html("No points to graph or map.");
    } else {
        $("#warning").html("");
    }

    // Update the histograms
    updateHistograms(selectedPoints);

    // Update the heatmap
    updateHeatMap(selectedPoints);
}

// Method to render options in the configuration div.
function updateOptions() {
    // New list for the types keys
    typesKeys = [];

    // Grab the keys from the types data
    for(var key in typesData) {
        typesKeys.push(key.toString());
    }

    // Sort the keys!
    typesKeys = typesKeys.sort();

    // Get a handle on the configuration types div
    var $types = $('#types').find(".inner").first();

    // Append the header text
    $types.append("Crime Type:<br />");

    // For each type key...
    for (var i = 0; i < typesKeys.length; i++) {
        // Make a new checkbox for it...
        var checkbox = "<label><input type='checkbox' name='group' value='" + typesKeys[i] + "' />";
        checkbox += typesKeys[i] + "</label><br />";

        // This splits the list into two separate columns to save
        // vertical space on the page
        if(i == 6) {
            $types = $('#types').find(".inner").last();
        }

        // ... and append it to the checkbox div
        $types.append(checkbox);
    }

    // Get a handle on the configuration div
    var $config = $("#configuration");

    // For every checkbox in the configuration div, default it
    // to checked
    $config.find(':checkbox').each(function () {
        $(this).prop('checked',true);
    });

    // add listener to configuration div, listening on checkbox
    // to update the heatmap display and hisograms.  This creates 
    // a single event listener on the types div, that change events 
    // on :checkbox objects will bubble up to.  This can save memory
    // over attaching event handlers to each individual item that
    // triggers the event.  This improves performance, especially
    // when there are a lot of elements that trigger events, or
    // when the same event on an object can trigger multiple events
    $config.on('change', ':checkbox', function () {
        updateHistogramsThenMap();
    });
}
