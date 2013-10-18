/*global window, Ractive */
/*jslint white: true */

var todoList = (function( window, Ractive ) {
	'use strict';

	var items, todoList, ENTER_KEY = 13;

	// our model - a normal array
	if ( window.localStorage ) {
		items = JSON.parse( window.localStorage.getItem( 'ractive-todos' ) ) || [];
	} else {
		items = [];
	}

	// create our app view
	todoList = new Ractive({
		el: 'todoapp',
		template: '#main',

		data: {
			items: items,
			filter: function ( item, currentFilter ) {
				var filter = this.get( currentFilter );
				
				if ( !filter ) {
					return true;
				}

				return filter( item );
			},

			completed: function ( item ) {
				return item.completed;
			},
			active: function ( item ) {
				return !item.completed;
			}
		},

		// We can also define 'transitions', which are applied to elements on render
		// and teardown
		transitions: {
			// When the edit <input> renders, select its contents
			select: function ( el, complete ) {
				setTimeout( function () {
					el.select();
					complete();
				}, 0 );
			}
		}
	});

	// Proxy event handlers
	todoList.on({
		remove: function ( event, index ) {
			items.splice( index, 1 );
		},
		new_todo: function ( event ) {
			items.push({
				description: event.node.value,
				completed: false
			});

			event.node.value = '';
		},
		edit: function ( event ) {
			this.set( event.keypath + '.editing', true );
		},
		submit: function ( event ) {
			this.set( event.keypath + '.editing', false );
		},
		clear_completed: function () {
			var i = items.length;

			while ( i-- ) {
				if ( items[i].completed ) {
					items.splice( i, 1 );
				}
			}
		},
		toggle_all: function ( event ) {
			var i = items.length, completed = event.node.checked;

			while ( i-- ) {
				this.set( 'items[' + i + '].completed', completed );
			}
		}
	});

	todoList.observe( 'items', function ( items ) {
		// persist to localStorage
		if ( window.localStorage ) {
			localStorage.setItem( 'ractive-todos', JSON.stringify( items ) );
		}
	});

	return todoList;

})( window, Ractive );