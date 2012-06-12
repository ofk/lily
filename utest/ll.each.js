utest('ll.each', [
	function () {
		var v = 0, k = 0, a = [1,2,3,4,5];
		ll.each(a, function (n, i) { v += n * this; k += i; }, 2);
		return [[ v, 30 ], [ k, 10 ]];
	},
	function () {
		var v = 0, k = 0, a = [1,2,3,4,5];
		ll.each(a, function (n, i) { if (n > 3) return false; v += n * this; k += i; }, 2);
		return [[ v, 12 ], [ k, 3 ]];
	},
	function () {
		var v = 0, k = 0, a = [1,2,3,4,5];
		delete a[1];
		ll.each(a, function (n, i) { v += n * this; k += i; }, 2);
		return [[ v, 26 ], [ k, 9 ]];
	},
	function () {
		var v = 0, k = '', o = {a:1,b:2,c:3,d:4,e:5};
		ll.each(o, function (n, i) { v += n * this; k += i; }, 2);
		return [[ v, 30 ], [ k, 'abcde' ]];
	},
	function () {
		var v = 0, k = '', o = {a:1,b:2,c:3,d:4,e:5};
		ll.each(o, function (n, i) { if (n > 3) return false; v += n * this; k += i; }, 2);
		return [[ v, 12 ], [ k, 'abc' ]];
	},
	function () {
		var v = 0, k = '', o = {a:1,b:2,c:3,d:4,e:5};
		delete o.b;
		ll.each(o, function (n, i) { v += n * this; k += i; }, 2);
		return [[ v, 26 ], [ k, 'acde' ]];
	}
]);
