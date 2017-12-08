require.config({
    baseUrl: 'js',
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        //jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min'
		jquery: 'jquery-latest'
		/*jqueryui: 'jquery-ui.min'
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.5/angular.min',
		angulartranslate: 'bower-angular-translate-2.5.2/angular-translate',
		angulartranslateloader: 'angular-translate-loader-static-files/angular-translate-loader-static-files',
		h2mheader : 'h2m_header',
		bootstrap : 'bootstrap.min',
		bootstrapdropdown : 'bootstrap-dropdown',
		raphael : 'raphael.2.1.0.min',
		justgage : 'justgage.1.0.1.min'*/
    }
});