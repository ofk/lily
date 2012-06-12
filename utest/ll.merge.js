utest('ll.merge', [
	function () {
		return [[ ll.merge(null), {} ]];
	},
	function () {
		return [[ ll.merge({}), {} ]];
	},
	function () {
		return [[ ll.merge({}, {}), {} ]];
	},
	function () {
		return [[ ll.merge({ a:1, b:2 }, {}), { a:1, b:2 } ]];
	},
	function () {
		return [[ ll.merge({ a:1 }, { b:2 }), { a:1, b:2 } ]];
	},
	function () {
		return [[ ll.merge({}, { a:1, b:2 }), { a:1, b:2 } ]];
	},
	function () {
		return [[ ll.merge({ a:1, b:2 }, { a:3, b:4 }), { a:3, b:4 } ]];
	},
	function () {
		return [[ ll.merge({ a:1, b:2 }, { b:4 }), { a:1, b:4 } ]];
	},
	function () {
		return [[ ll.merge({}, {}, {}, {}), {} ]];
	},
	function () {
		return [[ ll.merge({ a:1, b:2, c:3, d:4 }, {}, {}, {}), { a:1, b:2, c:3, d:4 } ]];
	},
	function () {
		return [[ ll.merge({ a:1, b:2, c:3, d:4 },
		                   { a:5, b:6, c:7, d:8 },
		                   { a:9, b:10, c:11, d:12 },
		                   { a:13, b:14, c:15, d:16 }), { a:13, b:14, c:15, d:16 } ]];
	},
	function () {
		return [[ ll.merge({}, {}, {}, { a:1, b:2, c:3, d:4 }), { a:1, b:2, c:3, d:4 } ]];
	},
	function () {
		return [[ ll.merge({ a:1 }, { b:2 }, { c:3 }, { d:4 }), { a:1, b:2, c:3, d:4 } ]];
	},
	function () {
		var a = { a:1 }, b = { b:2 }, c = { c:3, a:4 };
		return [[ ll.merge(a, b, c), { a:4,b:2,c:3 } ],
		        [ a, { a:4,b:2,c:3 } ],
		        [ b, { b:2 } ],
		        [ c, { c:3, a:4 } ]];
	}
]);
