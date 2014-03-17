var CrimeStats = (function() {
	var map;         // the map object
	var rawData;     // raw fetched data (XML)
	var pointsData;  // Holds loaded points
	var heatmap;     // The heatmap overlay
	var heatmapData; // The current data in the heatmap overlay
	var typesData;   // Crime counts by type
	var typesKeys;   // Crime types
	var plot1;       // Crime Types histogram
	var plot2;       // Crimes on Days of Week hisogram

	function getData(_10k) {
		var file = _10k ? "sfCrimeData10k.kml" : "sfCrimeData3k.kml";
		$.ajax({
			url: file,
			dataType: "xml",
			error: function(jqXHR, textStatus, errorThrown) {
				alert("ERROR:" + textStatus);
			},
			success: processData
		});
	}

	function getSelectedPoints() {
		var selectedTypes = getSelectedTypes();
		var selectedShifts = getSelectedShifts();
		var selectedPoints = [];
		for (var i = 0; i < pointsData.length; i++) {
			if ($.inArray(pointsData[i].type, selectedTypes) != -1 && $.inArray(pointsData[i].shift, selectedShifts) != -1) {
				selectedPoints.push(pointsData[i]);
			}
		}
		return selectedPoints;
	}

	function getSelectedShifts() {
		var list = [];
		var $shifts = $('#shifts').find(".inner");
		$shifts.find(':checkbox').each(function() {
			if (this.checked) {
				var val = $(this).val();
				if (val == "first") {
					list.push(1);
				} else if (val == "second") {
					list.push(2);
				} else if (val == "third") {
					list.push(3);
				} else {}
			}
		});
		return list;
	}

	function getSelectedTypes() {
		var list = [];
		var $types = $('#types').find(".inner");
		$types.find(':checkbox').each(function() {
			if (this.checked) {
				list.push($(this).val());
			}
		});
		return list;
	}

	function initialize() {
		setupMap();
		getData(true);
	}

	function processData(data, textStatus, jqXHR) {
		rawData = data;
		pointsData = [];
		heatmapData = [];
		typesData = {};
		$(rawData).find("Placemark").each(function() {
			var spot = XML2jsobj(this);
			var latlon = spot.Point.coordinates.split(",");
			spot.Point.lon = parseFloat(latlon[0]);
			spot.Point.lat = parseFloat(latlon[1]);
			spot.date = new Date(Date.parse(spot["gx:TimeStamp"].when));
			pointsData.push(spot);
			spot.type = spot.ExtendedData.Data[0];
			spot.url = spot.ExtendedData.Data[1];
			if (typesData[spot.type] == undefined) {
				typesData[spot.type] = 1;
			} else {
				typesData[spot.type] += 1;
			}
			if (spot.date.getHours() >= 7 && spot.date.getHours() < 15) {
				spot.shift = 1;
			} else if (spot.date.getHours() >= 15 && spot.date.getHours() < 23) {
				spot.shift = 2;
			} else {
				spot.shift = 3;
			}
		});
		updateOptions();
		updateHistogramsThenMap();
	}

	function setupMap() {
		var mapOptions = {
			center: new google.maps.LatLng(37.735155, -122.443657),
			zoom: 12,
			//disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
		// sfCrime = new google.maps.KmlLayer('http://www.timburke.co/r/sfCrimeData3k.kml');
		// sfCrime.setMap(map);
	}

	function updateHeatMap(selectedPoints) {
		heatmapData = [];
		for (var i = 0; i < selectedPoints.length; i++) {
			heatmapData.push(new google.maps.LatLng(selectedPoints[i].Point.lat, selectedPoints[i].Point.lon));
		}
		if (heatmap != undefined) {
			heatmap.setMap(null);
		}
		heatmap = new google.maps.visualization.HeatmapLayer({
			data: heatmapData,
			radius: 15,
			opacity: .8
		});
		heatmap.setMap(map);
	}

	function updateHistograms(selectedPoints) {
		var days = [0, 0, 0, 0, 0, 0, 0];
		var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		typesData = {};
		for (var i = 0; i < selectedPoints.length; i++) {
			days[selectedPoints[i].date.getDay()] += 1;
			if (typesData[selectedPoints[i].type] == undefined) {
				typesData[selectedPoints[i].type] = 1;
			} else {
				typesData[selectedPoints[i].type] += 1;
			}
		}
		typesKeys = [];
		for (var key in typesData) {
			typesKeys.push(key.toString());
		}
		typesKeys = typesKeys.sort().reverse();
		var counts = [];
		for (var i = 0; i < typesKeys.length; i++) {
			counts.push(typesData[typesKeys[i]]);
		}
		plot1 = $.jqplot('chart1', [counts], {
			seriesDefaults: {
				renderer: $.jqplot.BarRenderer,
				pointLabels: {
					show: true,
					location: 'e',
					edgeTolerance: -5
				},
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
		plot2 = $.jqplot('chart2', [days], {
			seriesDefaults: {
				renderer: $.jqplot.BarRenderer,
				rendererOptions: {
					fillToZero: true
				}
			},
			axes: {
				xaxis: {
					renderer: $.jqplot.CategoryAxisRenderer,
					ticks: dayOfWeek
				},
				yaxis: {
					pad: 1.05,
					tickOptions: {
						formatString: '%d'
					}
				}
			}
		});
		plot1.redraw();
		plot2.redraw();
	}

	function updateHistogramsThenMap() {
		var selectedPoints = getSelectedPoints();
		if (selectedPoints.length == 0) {
			$("#warning").html("No points to graph or map.");
		} else {
			$("#warning").html("");
		}
		updateHistograms(selectedPoints);
		updateHeatMap(selectedPoints);
	}

	function updateOptions() {
		typesKeys = [];
		for (var key in typesData) {
			typesKeys.push(key.toString());
		}
		typesKeys = typesKeys.sort();
		var $types = $('#types').find(".inner").first();
		$types.append("Crime Type:<br />");
		for (var i = 0; i < typesKeys.length; i++) {
			var checkbox = "<label><input type='checkbox' name='group' value='" + typesKeys[i] + "' />";
			checkbox += typesKeys[i] + "</label><br />";
			if (i == 6) {
				$types = $('#types').find(".inner").last();
			}
			$types.append(checkbox);
		}
		var $config = $("#configuration");
		$config.find(':checkbox').each(function() {
			$(this).prop('checked', true);
		});
		$config.on('change', ':checkbox', function() {
			updateHistogramsThenMap();
		});
	}
})();