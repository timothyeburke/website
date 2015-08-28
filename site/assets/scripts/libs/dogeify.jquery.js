// Adapted from 
// https://github.com/bxyoung89/dogeify
// Because Brody is awesome.

(function($) {

    $.fn.dogeify = function(options) {

        //Yo' defaults
        var defaults = {  
            enterOn: 'click', //timer, konami-code, click, myOwn
            delayTime: 5000, //time before raptor attacks on timer mode
			words: [
				"wow",
				"such agile",
				"much code",
				"plz more",
				"much cool",
				"such amazing",
				"so developer",
				"way best",
				"many doge"
			],
			colors: [
				"#FFB347",
				"#FF6961",
				"#DEA5A4",
				"#CFCFC4",
				"#AEC6CF",
				"#966FD6",
				"#779ECB",
				"#C23B22",
				"#836953",
				"#03C03C",
				"#77DD77",
				"#B19CD9",
				"#CB99C9",
				"#F49AC2",
				"#00ffff"				
			],
			dogeLength : 1000 * 20, //such time
			dogeSayingLength: 2500 //much speed
            };  
			
			// doge url http://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/plainDoge-700x525.jpg
        
        //Extend those options
        var options = $.extend(defaults, options); 
		
		var soTimeout = undefined;
	
		var manyTimeouts = [];
		var dogeId = 0;
		
		function start(){
			if(soTimeout !== undefined){
				window.clearTimeout(soTimeout);
			}
			
			soTimeout = window.setTimeout(stahp, options.dogeLength);
			
			//such math
			var totalDogeisms = Math.floor(options.dogeLength / (options.dogeSayingLength/2));
			//so iteration
			for(var x = 0; x < totalDogeisms; x++){
					manyTimeouts[x] = window.setTimeout( function(){makeDoge(dogeId++);}, x * (options.dogeSayingLength/2));		
			}		
			
		}
		
		function makeDoge(id){
			var word = options.words[Math.abs(id % options.colors.length)];
			var color = options.colors[Math.floor(Math.random() * options.colors.length)];
			var x = Math.max(0, Math.floor($("body").width() * Math.random()) - 100);
			var y = Math.max(0, Math.floor($("body").height() * Math.random()) - 100);
			$("body").append("<div id='doge-"+id+"' class='wow'></div>");
			$("#doge-"+id).css("color", color)
				.css("font-family", "'Comic Sans MS', cursive, sans-serif")
				.css("font-size", "30px")
				.css("position", "absolute")
				.css("top", y)
				.css("left", x)
				.css("z-index", "100000")
				.text(word)
				.fadeIn(options.dogeSayingLength, function(){
					$("#doge-"+id).fadeOut(options.dogeSayingLength, function(){
						$("#doge-"+id).remove();
					});
				});
			
		}
		
		function stahp(){
			window.clearTimeout(soTimeout);
			for(var x = 0; x< manyTimeouts.length; x++){
				window.clearTimeout(manyTimeouts[x]);
			}
			$(".wow").remove();
			
		}
		
		if(options.enterOn === "myOwn"){
			return start;
		}
	
	
        return this.each(function() {

			var _this = $(this);
			

			
			
			//Determine Entrance
			if(options.enterOn == 'timer') {
				setTimeout(start, options.delayTime);
			} else if(options.enterOn == 'click') {
				_this.bind('click', function(e) {
					e.preventDefault();
					start();
				})
			} else if(options.enterOn == 'konami-code'){
			    var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
			    $(window).bind("keydown.raptorz", function(e){
			        kkeys.push( e.keyCode );
			        if ( kkeys.toString().indexOf( konami ) >= 0 ) {
			        	init();
			        	$(window).unbind('keydown.raptorz');
			        }
			    }, true);
	
			}
			else if(options.enterOn == 'foxxy'){
			    var foxkeys = [], foxxy = "70,79,88,88,89";
			    $(window).bind("keydown.raptorz", function(e){
			        foxkeys.push( e.keyCode );
			        if ( foxkeys.toString().indexOf( foxxy ) >= 0 ) {
			        	init();
			        	$(window).unbind('keydown.raptorz');
			        }
			    }, true);
	
			}
			
        });//each call
    }//orbit plugin call
})(jQuery);
