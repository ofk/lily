utest('ll.type', [
	function () {
		return [[ ll.type(void 0), 'undefined' ]];
	},
	function () {
		return [[ ll.type(true), 'boolean' ],
		        [ ll.type(false), 'boolean' ],
		        [ ll.type(new Boolean), 'boolean' ]];
	},
	function () {
		return [[ ll.type(1), 'number' ],
		        [ ll.type(0), 'number' ],
		        [ ll.type(98765432109876543210), 'number' ],
		        [ ll.type(0.000000000000000001), 'number' ],
		        [ ll.type(1/0), 'number' ],
		        [ ll.type(parseInt('3210')), 'number' ],
		        [ ll.type(parseInt('abc')), 'number' ],
		        [ ll.type(parseFloat('0.123')), 'number' ],
		        [ ll.type(parseFloat('zyx')), 'number' ],
		        [ ll.type(new Number), 'number' ]];
	},
	function () {
		return [[ ll.type('abc'), 'string' ],
		        [ ll.type(''), 'string' ],
		        [ ll.type(new String), 'string' ]];
	},
	function () {
		return [[ ll.type(/./img), 'regexp' ],
		        [ ll.type(new RegExp('.', 'img')), 'regexp' ]];
	},
	function () {
		return [[ ll.type([]), 'array' ],
		        [ ll.type([ 1, 2, 3 ]), 'array' ],
		        [ ll.type(new Array), 'array' ],
		        [ ll.type(new Array(10)), 'array' ]];
	},
	function () {
		return [[ ll.type(function (a) { return a; }), 'function' ],
		        [ ll.type(new Function('b', 'return b')), 'function' ]];
	},
	function () {
		return [[ ll.type(Boolean), 'function' ],
		        [ ll.type(Number), 'function' ],
		        [ ll.type(String), 'function' ],
		        [ ll.type(RegExp), 'function' ],
		        [ ll.type(Array), 'function' ],
		        [ ll.type(Function), 'function' ],
		        [ ll.type(Date), 'function' ],
		        [ ll.type(Object), 'function' ]];
	},
	function () {
		return [[ ll.type(new Date), 'date' ]];
	},
	function () {
		return [[ ll.type(null), 'null' ]];
	},
	function () {
		return [[ ll.type(window), 'window' ]];
	},
	function () {
		return [[ ll.type(document.documentElement), 'node' ],
		        [ ll.type(document.getElementsByTagName('*')[0]), 'node' ]];
	},
	function () {
		return [[ ll.type(document.getElementsByTagName('*')), 'array' ],
		        [ ll.type(document.documentElement.childNodes), 'array' ],
		        [ ll.type(document.getElementsByTagName('notfound')), 'array' ]];
	},
	function () {
		return [[ (function () { return ll.type(arguments); }()), 'array' ],
		        [ (function () { return ll.type(arguments); }(1, 2, 3)), 'array' ]];
	},
	function () {
		return [[ ll.type({}), 'object' ],
		        [ ll.type({ length: 100 }), 'object' ],
		        [ ll.type(new Object), 'object' ]];
	},
	function () {
		var F = function () {};
		return [[ ll.type(new F), 'object' ]];
	}
]);
