/*
	jQuery Touch Scrolling Plugin

	Author: 	Tim Burke (tburke@ringtaildesign.com)
	Company: 	Ringtail Design (http://www.ringtaildesign.com)
*/
(function( $ ) {

	// touchScroll function added to jQuery fn namespace:
	// Initializes scrolling for both X and Y axes.
	$.fn.touchScroll = function (options) {
		this.touchScrollX(options);
		this.touchScrollY(options);
		return this;
	}

	// touchScrollY function added to jQuery fn namespace:
	// Initializes scrolling for just the Y axis.
	$.fn.touchScrollY = function(options) {
		var oldY = newY = easeY = easeTimeoutY = renderTimeoutY = 0;
		var settings = $.extend({
			'refresh': 15,
			'easing' : .92 
		}, options);

		// Save away a pointer to the jQuery this object
		// for access by functions in the methods array
		var $this = this;

		// Set any overflow for the container to hidden
		$this.css('overflow', 'hidden');

		// Log an event listener for touchstart events
		this.on('touchstart.touchScrollY', function (e) {
			// STOP the event from propogating up the DOM
			// e.preventDefault();

			// Reset events and scrolling along this axis
			// Clear any timeouts set for rendering
			clearInterval(easeTimeoutY);
			clearInterval(renderTimeoutY);
			// Reset acceleration to zero for next scrolling event
			easeY = 0;


			// Store away the position of the touch
			oldY = newY = e.originalEvent.touches[0].pageY;

			// Set a rendering timeout to only re-render the page
			// by manipulating the DOM every 15ms (60hz).
			renderTimeoutY = setInterval(function() {
				// Render changes live as user's finger is on the screen

				// Calculate the difference in distance between last
				// render and this one
				var diff = newY - oldY;

				// Get the current scroll position
				var curr = $this.scrollTop();

				// Scroll the container by the difference
				$this.scrollTop(curr - diff);	

				// For next render, set starting position
				oldY = newY;

				// Save the acceleration using a basic easing function
				easeY = (easeY + diff) / 2;
			}, settings.refresh);
		});

		// Log an event listener for touch move events
		this.on('touchmove.touchScrollY', function (e) {
			// STOP the event from propogating up the DOM
			e.preventDefault();

			// Log away the new scrolling position
			newY = e.originalEvent.touches[0].pageY;
		});

		// Log an event listener for touch end events
		this.on('touchend.touchScrollY', function (e) {
			// If scroll has sufficient motion...
			if(Math.round(easeY) != 0) {
				// Continue scrolling via the easeOut method
				easeTimeoutY = setInterval(function () {
					// Continue rendering changes after user has stopped
					// touching the screen based on the speed they were
					// scrolling (inertial scrolling).  Very similar to 
					// render<axis> function above.

					// Calculate a new distance based on previous scroll
					// position and the easing acceleration
					newY = oldY + easeY;

					// Calculate teh difference in distance between last 
					// render and this one
					var diff = newY - oldY;

					// Get the current scroll position
					var curr = $this.scrollTop();

					// Scroll the container by the difference
					$this.scrollTop(curr - diff);

					// Reduce the easing acceleration by an arbitrary multiple
					easeY = easeY * settings.easing;

					// Once the easing function gets within rounding distance 
					// of zero, stop scrolling and reset
					if(Math.round(easeY) == 0) {
						// Clear any timeouts set for rendering
						clearInterval(easeTimeoutY);
						clearInterval(renderTimeoutY);

						// Reset acceleration to zero for next scrolling event
						easeY = 0;
					}
				}, settings.refresh);
			} else {
				// Otherwise stop scrolling now
				oldY = newY = e.originalEvent.changedTouches[0].pageY;
				// Clear any timeouts set for rendering
				clearInterval(easeTimeoutY);
				clearInterval(renderTimeoutY);

				// Reset acceleration to zero for next scrolling event
				easeY = 0;
			}
		});

		return this;
	};

	$.fn.touchScrollX = function(options) {
		var oldX = newX = easeX = easeTimeoutX = renderTimeoutX = 0;
		var settings = $.extend({
			'refresh': 15,
			'easing' : .92 
		}, options);


		// Save away a pointer to the jQuery this object
		// for access by functions in the methods array
		var $this = this;

		// Set any overflow for the container to hidden
		$this.css('overflow', 'hidden');

		// Log $(an event listener for touchstart events
		this.on('touchstart.touchScrollX', function (e) {
			console.log("touchstart");
			// STOP the event from propogating up the DOM
			// e.preventDefault();

			// Reset events and scrolling along this axis
			// Clear any timeouts set for rendering
			clearInterval(easeTimeoutX);
			clearInterval(renderTimeoutX);
			// Reset acceleration to zero for next scrolling event
			easeX = 0;

			// Store away the position of the touch
			oldX = newX = e.originalEvent.touches[0].pageX;

			// Set a rendering timeout to only re-render the page
			// by manipulating the DOM every set time in ms
			renderTimeoutX = setInterval(function() {
				// Render changes live as user's finger is on the screen

				// Calculate the difference in distance between last
				// render and this one
				var diff = newX - oldX;

				// Get the current scroll position
				var curr = $this.scrollLeft();

				// Scroll the container by the difference
				$this.scrollLeft(curr - diff);	

				// For next render, set starting position
				oldX = newX;

				// Save the acceleration using a basic easing function
				easeX = (easeX + diff) / 2;
			}, settings.refresh);
		});

		// Log an event listener for touch move events
		this.on('touchmove.touchScrollX', function (e) {
			// STOP the event from propogating up the DOM
			e.preventDefault();

			// Log away the new scrolling position
			newX = e.originalEvent.touches[0].pageX;
		});

		// Log an event listener for touch end events
		this.on('touchend.touchScrollX', function (e) {
			console.log("touchend");
			e.preventDefault();

			// If scroll has sufficient motion...
			if(Math.round(easeX) != 0) {
				// Continue scrolling via the easeOut method
				easeTimeoutX = setInterval(function () {
					// Continue rendering changes after user has stopped
					// touching the screen based on the speed they were
					// scrolling (inertial scrolling).  Very similar to 
					// render<axis> function above.

					// Calculate a new distance based on previous scroll
					// position and the easing acceleration
					newX = oldX + easeX;

					// Calculate teh difference in distance between last 
					// render and this one
					var diff = newX - oldX;

					// Get the current scroll position
					var curr = $this.scrollLeft();

					// Scroll the container by the difference
					$this.scrollLeft(curr - diff);


					// Reduce the easing acceleration by an arbitrary multiple
					easeX = easeX * settings.easing;

					// Once the easing function gets within rounding distance 
					// of zero, stop scrolling and reset
					if(Math.round(easeX) == 0) {
						// Clear any timeouts set for rendering
						clearInterval(easeTimeoutX);
						clearInterval(renderTimeoutX);

						// Reset acceleration to zero for next scrolling event
						easeX = 0;
					}
				}, settings.refresh);
			} else {
				// Otherwise stop scrolling now
				oldX = newX = e.originalEvent.changedTouches[0].pageX;
				// Clear any timeouts set for rendering
				clearInterval(easeTimeoutX);
				clearInterval(renderTimeoutX);

				// Reset acceleration to zero for next scrolling event
				easeX = 0;
			}
		});

		this.on('touchcancel.touchScrollX', function () {
			console.log("touchcancel");
		});

		return this;
	};
})( jQuery );