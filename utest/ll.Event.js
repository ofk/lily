var evt1 = new ll.Event,
    evt2 = new ll.Event;
utest('ll.Event', [
	function () {
		var sum = 0;
		evt1.attach('test1', function () { sum += 1; });
		evt1.attach('test1', function () { sum += 2; });
		evt1.attach('test1', function () { sum += 3; });
		evt1.attach('test1', function () { sum += 4; });
		evt1.ontest1();
        var old_sum = sum;
		evt1.ontest1();
		return [[ old_sum, 10 ], [ sum, 20 ]];
	},
	function () {
		return [ !!evt1.ontest1, !evt2.ontest1 ];
	},
	function () {
		function f() { sum += 5; }
		var sum = 0;
		evt1.attach('test2', function () { sum += 1; });
		evt1.attach('test2', function () { sum += 2; });
		evt1.attach('test2', f);
		evt1.attach('test2', function () { sum += 3; });
		evt1.attach('test2', function () { sum += 4; });
		evt1.detach('test2', f);
		evt1.ontest2();
		return [[ sum, 10 ]];
	},
	function () {
		var sum = 0;
		evt1.attach('test3', function (a, b) { sum += (9 * a) + b; });
		evt1.attach('test3', function (a, b) { sum += (8 - a) * b; });
		evt1.call('test3', 1, 2);
		var old_sum = sum;
		evt1.ontest3(3, 4);
		return [[ old_sum, 25 ], [ sum, 76 ]];
	},
	function () {
		var sum = 0;
		var f = ll.Event.createHandle();
		f.attach(function () { sum += 1; });
		f.attach(function () { sum += 2; });
		f.attach(function () { sum += 3; });
		f.attach(function () { sum += 4; });
		f();
		return [[ sum, 10 ]];
	},
	function () {
		var sum = 0;
		evt1.ontest4 = ll.Event.createHandle();
		evt1.attach('test4', function () { sum += 1; });
		evt1.attach('test4', function () { sum += 2; });
		evt1.attach('test4', function () { sum += 3; });
		evt1.attach('test4', function () { sum += 4; });
		evt1.ontest4();
		return [[ sum, 10 ]];
	},
	function () {
		var f = ll.Event.createFilter();
		f.attach(function (v) { return v + 1; });
		f.attach(function (v) { return v + 2; });
		f.attach(function (v) { return v + 3; });
		f.attach(function (v) { return v + 4; });
		return [[ f(0), 10 ], [ f(10), 20 ]];
	},
	function () {
		evt1.ontest5 = ll.Event.createFilter();
		evt1.attach('test5', function (v) { return v + 1; });
		evt1.attach('test5', function (v) { return v + 2; });
		evt1.attach('test5', function (v) { return v + 3; });
		evt1.attach('test5', function (v) { return v + 4; });
		return [[ evt1.ontest5(0), 10 ], [ evt1.ontest5(10), 20 ]];
	}
]);
