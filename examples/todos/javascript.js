var items, todoList, filters;

// our model is a normal array - Ractive will intercept calls to mutator methods
// like push and splice, so we don't need to inherit from a custom class or anything
if ( window.localStorage ) {
	items = JSON.parse( window.localStorage.getItem( 'ractive-todos' ) ) || [];
} else {
	items = [];
}

// set up some filters
filters = {
	completed: function ( item ) { return item.completed; },
	active: function ( item ) { return !item.completed; },
	all: function () { return true; }
};

// create our app view
todoList = new Ractive({
	el: example,
	template: template,

	data: {
		items: items,
		filter: function ( item, currentFilter ) {
			return filters[ currentFilter ]( item );
		},
		currentFilter: 'all'
	},

	// We can define 'transitions', which are applied to elements on intro
	// or outro. This is normally used for animation, but we can use it for
	// other purposes, such as autoselecting an input's contents
	transitions: {
		select: function ( node, complete ) {
			setTimeout( function () {
				node.select();
				complete();
			}, 0 );
		}
	}
});

// Various user mouse and keyboard actions, defined in the template, will
// fire 'proxy events' that trigger behaviours and state changes
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
	},
	set_filter: function ( event, filter ) {
		this.set( 'currentFilter', filter );
	}
});

// When the model changes, recalculate the number of active and
// completed todos, and persist to localStorage if possible
todoList.observe( 'items', function ( items ) {
	this.set({
		numActive: items.filter( filters.active ).length,
		numCompleted: items.filter( filters.completed ).length
	});

	// persist to localStorage
	if ( window.localStorage ) {
		localStorage.setItem( 'ractive-todos', JSON.stringify( items ) );
	}
});