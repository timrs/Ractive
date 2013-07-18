(function () {

	var promises = {}, info;

	promises = {
		template: reqwest( 'template.html' ),
		css: reqwest({ url: 'styles.css', type: 'text' }),
		javascript: reqwest({ url: 'javascript.js', type: 'text' }),
		libs: reqwest({ url: 'libs.js', type: 'js' }),
		readme: reqwest( 'readme.html' )
	};


	domready( function () {
		var checkin, remaining;

		info = new Ractive({
			el: 'info',
			template: '#infoTemplate',
			data: {
				selected: 'readme'
			}
		});

		promises.template.then( function ( template ) {
			var scr, libs;

			window.template = template;
			window.example = document.getElementById( 'example' );

			libs = document.createElement( 'script' );
			libs.src = 'libs.js';

			libs.onload = libs.onerror = function () {
				console.log( promises.libs );

				scr = document.createElement( 'script' );
				scr.src = 'javascript.js';

				document.body.appendChild( scr );


				info.nodes.template.innerText = template.replace( /\t/g, '  ' );
				hljs.highlightBlock( info.nodes.template );
			};

			document.body.appendChild( libs );
		});

		promises.readme.then( function ( readme ) {
			info.nodes.readme.innerHTML = readme;
			hljs.tabReplace = '  ';
			hljs.initHighlighting();
		});

		promises.javascript.then( function ( req ) {
			info.nodes.javascript.innerText = req.responseText.replace( /\t/g, '  ' );
			hljs.highlightBlock( info.nodes.javascript );
		});

		promises.css.then( function ( req ) {
			info.nodes.css.innerText = req.responseText.replace( /\t/g, '  ' );
			hljs.highlightBlock( info.nodes.css );
		});
	});
}());