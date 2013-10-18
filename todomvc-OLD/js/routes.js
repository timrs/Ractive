/*global window, todoList */
/*jslint white: true */

(function ( window, todoList ) {

	'use strict';

	var whitelist, route;

	// Set up routing
	whitelist = [ 'all', 'active', 'completed' ];

	route = function () {
		var route = window.location.hash.replace( /^#\//, '' );

		if ( whitelist.indexOf( route ) !== -1 ) {
			todoList.set( 'currentFilter', route );
		} else {
			todoList.set( 'currentFilter', 'all' );
		}
	};

	// whenever the route changes, update the filter
	window.addEventListener( 'hashchange', route );

	// whenever the filter changes, update the route
	todoList.observe( 'currentFilter', function ( filter ) {
		console.log( filter );
		window.location.hash = '/' + filter;
	});

	// initialise
	route();

}( window, todoList ));