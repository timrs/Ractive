define([
	'parse/Tokenizer/getMustache/_getMustache',
	'parse/Tokenizer/getComment/getComment',
	'parse/Tokenizer/getTag/_getTag',
	'parse/Tokenizer/getText/_getText',

	'parse/Tokenizer/getExpression/_getExpression',
	
	'parse/Tokenizer/utils/allowWhitespace',
	'parse/Tokenizer/utils/getStringMatch'
], function (
	getMustache,
	getComment,
	getTag,
	getText,

	getExpression,
	
	allowWhitespace,
	getStringMatch
) {
	
	'use strict';

	var Tokenizer;

	Tokenizer = function ( str, options ) {
		var token;

		this.str = str;
		this.pos = 0;
		this.delimiters = options.delimiters;
		this.tripleDelimiters = options.tripleDelimiters;

		this.tokens = [];

		while ( this.pos < this.str.length ) {
			token = this.getToken();

			if ( token === null && this.remaining() ) {
				this.fail();
			}

			this.tokens.push( token );
		}
	};

	Tokenizer.prototype = {
		getToken: function () {
			var token = this.getMustache() ||
			            this.getComment() ||
			            this.getTag() ||
			            this.getText();

			return token;
		},

		getMustache: getMustache,
		getComment: getComment,
		getTag: getTag,
		getText: getText,

		getExpression: getExpression,

		// utils
		allowWhitespace: allowWhitespace,
		getStringMatch: getStringMatch,

		remaining: function () {
			return this.str.substring( this.pos );
		},

		fail: function () {
			var last20, next20;

			last20 = this.str.substr( 0, this.pos ).substr( -20 );
			if ( last20.length === 20 ) {
				last20 = '...' + last20;
			}

			next20 = this.remaining().substr( 0, 20 );
			if ( next20.length === 20 ) {
				next20 = next20 + '...';
			}

			throw new Error( 'Could not parse template: ' + ( last20 ? last20 + '<- ' : '' ) + 'failed at character ' + this.pos + ' ->' + next20 );
		},

		expected: function ( thing ) {
			var remaining = this.remaining().substr( 0, 40 );
			if ( remaining.length === 40 ) {
				remaining += '...';
			}
			throw new Error( 'Tokenizer failed: unexpected string "' + remaining + '" (expected ' + thing + ')' );
		}
	};

	return Tokenizer;

});