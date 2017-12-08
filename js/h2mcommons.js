var spinner;
var spinner_target;
	function initLoadingSpinner()
	{
		var opts = {
            lines: 10, // The number of lines to draw
            length: 7, // The length of each line
            width: 4, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#000', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 25, // Top position relative to parent in px
            left: 25 // Left position relative to parent in px
        };
		
		spinner_target = document.getElementsByClassName('loading_spinner')[0];
		spinner = new Spinner(opts).spin(spinner_target);
		
	}

	function stopSpinning()
	{
		spinner.stop();
	}
		
	function startSpinning()
	{
		spinner.spin(spinner_target);
	}


