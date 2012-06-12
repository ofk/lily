utest("ll", [
	[ utest.type(ll), "function" ],

	raises(function () { ll(); }),
	function () { ll({}); return true; },
	function () { new ll({}); return true; },
	function () { var Test = ll({}); new Test; return true; }
]);

utest("ll(Animal, Human, Singer)", function () {
	var Animal = ll({
		init: function (name) { this.name = name; },
		walk: function () { return 'teku teku'; },
		sing: function () { return 'la la la'; }
	});
	var Human = ll(Animal, {
		speak: function () { return 'hello'; }	 
	});
	var Singer = ll(Human, {
		speak: function () { return 'hello!!'; },
		sing: function () { var str = []; for (var i = 0; i < 3; ++i) str.push(this.parent('sing')()); return str.join(' '); }
	});
	var ofk = new Human('k');
	var lily = new Singer('yuri');
	return [
		ofk instanceof Animal,
		ofk instanceof Human,
		!(ofk instanceof Singer),
		[ ofk.name, 'k' ],
		[ ofk.walk(), 'teku teku' ],
		[ ofk.sing(), 'la la la' ],
		[ ofk.speak(), 'hello' ],
		lily instanceof Animal,
		lily instanceof Human,
		lily instanceof Singer,
		[ lily.name, 'yuri' ],
		[ lily.walk(), 'teku teku' ],
		[ lily.sing(), 'la la la la la la la la la' ],
		[ lily.speak(), 'hello!!']
	];
});

utest("ll(Class1, Class2, Class3, Class4, Class5)", function () {
	// Class1
	var Class1 = ll({
		init: function (a) { this.a = a; },
		prop: function () { return [ this.a || 0, this.b || 0, this.c || 0, this.d || 0, this.e || 0 ]; },
		lv1____: function (a) { return [ a, 1 ]; },
		lv1___5: function (a) { return [ a, 1.0005 ]; },
		lv1__4_: function (a) { return [ a, 1.004 ]; },
		lv1__45: function (a) { return [ a, 1.0045 ]; },
		lv1_3__: function (a) { return [ a, 1.03 ]; },
		lv1_3_5: function (a) { return [ a, 1.0305 ]; },
		lv1_34_: function (a) { return [ a, 1.034 ]; },
		lv1_345: function (a) { return [ a, 1.0345 ]; },
		lv12___: function (a) { return [ a, 1.2 ]; },
		lv12__5: function (a) { return [ a, 1.2005 ]; },
		lv12_4_: function (a) { return [ a, 1.204 ]; },
		lv12_45: function (a) { return [ a, 1.2045 ]; },
		lv123__: function (a) { return [ a, 1.23 ]; },
		lv123_5: function (a) { return [ a, 1.2305 ]; },
		lv1234_: function (a) { return [ a, 1.234 ]; },
		lv12345: function (a) { return [ a, 1.2345 ]; }
	});
	// Class2
	var Class2 = ll(Class1, {
		init: function (a, b) { this.parent('init')(a); this.b = b; },
		lv_2___: function (a) { return [ a, 2 ]; },
		lv_2__5: function (a) { return [ a, 2.005 ]; },
		lv_2_4_: function (a) { return [ a, 2.04 ]; },
		lv_2_45: function (a) { return [ a, 2.045 ]; },
		lv_23__: function (a) { return [ a, 2.3 ]; },
		lv_23_5: function (a) { return [ a, 2.305 ]; },
		lv_234_: function (a) { return [ a, 2.34 ]; },
		lv_2345: function (a) { return [ a, 2.345 ]; },
		lv12___: function (a) { return this.parent("lv12___")(a).concat(2); },
		lv12__5: function (a) { return this.parent("lv12__5")(a).concat(2.005); },
		lv12_4_: function (a) { return this.parent("lv12_4_")(a).concat(2.04); },
		lv12_45: function (a) { return this.parent("lv12_45")(a).concat(2.045); },
		lv123__: function (a) { return this.parent("lv123__")(a).concat(2.3); },
		lv123_5: function (a) { return this.parent("lv123_5")(a).concat(2.305); },
		lv1234_: function (a) { return this.parent("lv1234_")(a).concat(2.34); },
		lv12345: function (a) { return this.parent("lv12345")(a).concat(2.345); }
	});
	// Class3
	var Class3 = ll(Class2, {
		init: function (a, b, c) { this.parent("init")(a, b); this.c = c; },
		lv__3__: function (a) { return [ a, 3 ]; },
		lv__3_5: function (a) { return [ a, 3.05 ]; },
		lv__34_: function (a) { return [ a, 3.4 ]; },
		lv__345: function (a) { return [ a, 3.45 ]; },
		lv_23__: function (a) { return this.parent("lv_23__")(a).concat(3); },
		lv_23_5: function (a) { return this.parent("lv_23_5")(a).concat(3.05); },
		lv_234_: function (a) { return this.parent("lv_234_")(a).concat(3.4); },
		lv_2345: function (a) { return this.parent("lv_2345")(a).concat(3.45); },
		lv1_3__: function (a) { return this.parent("lv1_3__")(a).concat(3); },
		lv1_3_5: function (a) { return this.parent("lv1_3_5")(a).concat(3.05); },
		lv1_34_: function (a) { return this.parent("lv1_34_")(a).concat(3.4); },
		lv1_345: function (a) { return this.parent("lv1_345")(a).concat(3.45); },
		lv123__: function (a) { return this.parent("lv123__")(a).concat(3); },
		lv123_5: function (a) { return this.parent("lv123_5")(a).concat(3.05); },
		lv1234_: function (a) { return this.parent("lv1234_")(a).concat(3.4); },
		lv12345: function (a) { return this.parent("lv12345")(a).concat(3.45); }
	});
	// Class4
	var Class4 = ll(Class3, {
		init: function (a, b, c, d) { this.parent("init")(a, b, c); this.d = d; },
		lv___4_: function (a) { return [ a, 4 ]; },
		lv___45: function (a) { return [ a, 4.5 ]; },
		lv__34_: function (a) { return this.parent("lv__34_")(a).concat(4); },
		lv__345: function (a) { return this.parent("lv__345")(a).concat(4.5); },
		lv_2_4_: function (a) { return this.parent("lv_2_4_")(a).concat(4); },
		lv_2_45: function (a) { return this.parent("lv_2_45")(a).concat(4.5); },
		lv_234_: function (a) { return this.parent("lv_234_")(a).concat(4); },
		lv_2345: function (a) { return this.parent("lv_2345")(a).concat(4.5); },
		lv1__4_: function (a) { return this.parent("lv1__4_")(a).concat(4); },
		lv1__45: function (a) { return this.parent("lv1__45")(a).concat(4.5); },
		lv1_34_: function (a) { return this.parent("lv1_34_")(a).concat(4); },
		lv1_345: function (a) { return this.parent("lv1_345")(a).concat(4.5); },
		lv12_4_: function (a) { return this.parent("lv12_4_")(a).concat(4); },
		lv12_45: function (a) { return this.parent("lv12_45")(a).concat(4.5); },
		lv1234_: function (a) { return this.parent("lv1234_")(a).concat(4); },
		lv12345: function (a) { return this.parent("lv12345")(a).concat(4.5); }
	});
	// Class5
	var Class5 = ll(Class4, {
		init: function (a, b, c, d, e) { this.parent("init")(a, b, c, d); this.e = e; },
		lv____5: function (a) { return [ a, 5 ]; },
		lv___45: function (a) { return this.parent("lv___45")(a).concat(5); },
		lv__3_5: function (a) { return this.parent("lv__3_5")(a).concat(5); },
		lv__345: function (a) { return this.parent("lv__345")(a).concat(5); },
		lv_2__5: function (a) { return this.parent("lv_2__5")(a).concat(5); },
		lv_2_45: function (a) { return this.parent("lv_2_45")(a).concat(5); },
		lv_23_5: function (a) { return this.parent("lv_23_5")(a).concat(5); },
		lv_2345: function (a) { return this.parent("lv_2345")(a).concat(5); },
		lv1___5: function (a) { return this.parent("lv1___5")(a).concat(5); },
		lv1__45: function (a) { return this.parent("lv1__45")(a).concat(5); },
		lv1_3_5: function (a) { return this.parent("lv1_3_5")(a).concat(5); },
		lv1_345: function (a) { return this.parent("lv1_345")(a).concat(5); },
		lv12__5: function (a) { return this.parent("lv12__5")(a).concat(5); },
		lv12_45: function (a) { return this.parent("lv12_45")(a).concat(5); },
		lv123_5: function (a) { return this.parent("lv123_5")(a).concat(5); },
		lv12345: function (a) { return this.parent("lv12345")(a).concat(5); }
	});

	var obj = [
		new Class1(1, 2, 3, 4, 5),
		new Class2(1, 2, 3, 4, 5),
		new Class3(1, 2, 3, 4, 5),
		new Class4(1, 2, 3, 4, 5),
		new Class5(1, 2, 3, 4, 5)
	];
	var res = {}, i = 0;
	function method_test(obj_num, method_name, val_arr) {
		var msg = "Class" + obj_num + "#" + method_name + "() @ " + (i + 1);
		if (!val_arr) {
			res[msg] = raises(function () { obj[obj_num - 1][method_name](0); });
		}
		else {
			res[msg] = function () {
				return [[ obj[obj_num - 1][method_name](0), val_arr ]];
			};
		}
	}
	for (var i = 0; i < 3; ++i) {
		// Class1
		method_test(1, "prop", [ 1, 0, 0, 0, 0 ]);
		method_test(1, "lv____5");
		method_test(1, "lv___4_");
		method_test(1, "lv___45");
		method_test(1, "lv__3__");
		method_test(1, "lv__3_5");
		method_test(1, "lv__34_");
		method_test(1, "lv__345");
		method_test(1, "lv_2___");
		method_test(1, "lv_2__5");
		method_test(1, "lv_2_4_");
		method_test(1, "lv_2_45");
		method_test(1, "lv_23__");
		method_test(1, "lv_23_5");
		method_test(1, "lv_234_");
		method_test(1, "lv_2345");
		method_test(1, "lv1____", [ 0, 1 ]);
		method_test(1, "lv1___5", [ 0, 1.0005 ]);
		method_test(1, "lv1__4_", [ 0, 1.004 ]);
		method_test(1, "lv1__45", [ 0, 1.0045 ]);
		method_test(1, "lv1_3__", [ 0, 1.03 ]);
		method_test(1, "lv1_3_5", [ 0, 1.0305 ]);
		method_test(1, "lv1_34_", [ 0, 1.034 ]);
		method_test(1, "lv1_345", [ 0, 1.0345 ]);
		method_test(1, "lv12___", [ 0, 1.2 ]);
		method_test(1, "lv12__5", [ 0, 1.2005 ]);
		method_test(1, "lv12_4_", [ 0, 1.204 ]);
		method_test(1, "lv12_45", [ 0, 1.2045 ]);
		method_test(1, "lv123__", [ 0, 1.23 ]);
		method_test(1, "lv123_5", [ 0, 1.2305 ]);
		method_test(1, "lv1234_", [ 0, 1.234 ]);
		method_test(1, "lv12345", [ 0, 1.2345 ]);
		// Class2
		method_test(2, "prop", [ 1, 2, 0, 0, 0 ]);
		method_test(2, "lv____5");
		method_test(2, "lv___4_");
		method_test(2, "lv___45");
		method_test(2, "lv__3__");
		method_test(2, "lv__3_5");
		method_test(2, "lv__34_");
		method_test(2, "lv__345");
		method_test(2, "lv_2___", [ 0, 2]);
		method_test(2, "lv_2__5", [ 0, 2.005 ]);
		method_test(2, "lv_2_4_", [ 0, 2.04 ]);
		method_test(2, "lv_2_45", [ 0, 2.045 ]);
		method_test(2, "lv_23__", [ 0, 2.3 ]);
		method_test(2, "lv_23_5", [ 0, 2.305 ]);
		method_test(2, "lv_234_", [ 0, 2.34 ]);
		method_test(2, "lv_2345", [ 0, 2.345 ]);
		method_test(2, "lv1____", [ 0, 1 ]);
		method_test(2, "lv1___5", [ 0, 1.0005 ]);
		method_test(2, "lv1__4_", [ 0, 1.004 ]);
		method_test(2, "lv1__45", [ 0, 1.0045 ]);
		method_test(2, "lv1_3__", [ 0, 1.03 ]);
		method_test(2, "lv1_3_5", [ 0, 1.0305 ]);
		method_test(2, "lv1_34_", [ 0, 1.034 ]);
		method_test(2, "lv1_345", [ 0, 1.0345 ]);
		method_test(2, "lv12___", [ 0, 1.2, 2 ]);
		method_test(2, "lv12__5", [ 0, 1.2005, 2.005 ]);
		method_test(2, "lv12_4_", [ 0, 1.204, 2.04 ]);
		method_test(2, "lv12_45", [ 0, 1.2045, 2.045 ]);
		method_test(2, "lv123__", [ 0, 1.23, 2.3 ]);
		method_test(2, "lv123_5", [ 0, 1.2305, 2.305 ]);
		method_test(2, "lv1234_", [ 0, 1.234, 2.34 ]);
		method_test(2, "lv12345", [ 0, 1.2345, 2.345 ]);
		// Class3
		method_test(3, "prop", [ 1, 2, 3, 0, 0 ]);
		method_test(3, "lv____5");
		method_test(3, "lv___4_");
		method_test(3, "lv___45");
		method_test(3, "lv__3__", [ 0, 3 ]);
		method_test(3, "lv__3_5", [ 0, 3.05 ]);
		method_test(3, "lv__34_", [ 0, 3.4 ]);
		method_test(3, "lv__345", [ 0, 3.45 ]);
		method_test(3, "lv_2___", [ 0, 2]);
		method_test(3, "lv_2__5", [ 0, 2.005 ]);
		method_test(3, "lv_2_4_", [ 0, 2.04 ]);
		method_test(3, "lv_2_45", [ 0, 2.045 ]);
		method_test(3, "lv_23__", [ 0, 2.3, 3 ]);
		method_test(3, "lv_23_5", [ 0, 2.305, 3.05 ]);
		method_test(3, "lv_234_", [ 0, 2.34, 3.4 ]);
		method_test(3, "lv_2345", [ 0, 2.345, 3.45 ]);
		method_test(3, "lv1____", [ 0, 1 ]);
		method_test(3, "lv1___5", [ 0, 1.0005 ]);
		method_test(3, "lv1__4_", [ 0, 1.004 ]);
		method_test(3, "lv1__45", [ 0, 1.0045 ]);
		method_test(3, "lv1_3__", [ 0, 1.03, 3 ]);
		method_test(3, "lv1_3_5", [ 0, 1.0305, 3.05 ]);
		method_test(3, "lv1_34_", [ 0, 1.034, 3.4 ]);
		method_test(3, "lv1_345", [ 0, 1.0345, 3.45 ]);
		method_test(3, "lv12___", [ 0, 1.2, 2 ]);
		method_test(3, "lv12__5", [ 0, 1.2005, 2.005 ]);
		method_test(3, "lv12_4_", [ 0, 1.204, 2.04 ]);
		method_test(3, "lv12_45", [ 0, 1.2045, 2.045 ]);
		method_test(3, "lv123__", [ 0, 1.23, 2.3, 3 ]);
		method_test(3, "lv123_5", [ 0, 1.2305, 2.305, 3.05 ]);
		method_test(3, "lv1234_", [ 0, 1.234, 2.34, 3.4 ]);
		method_test(3, "lv12345", [ 0, 1.2345, 2.345, 3.45 ]);
		// Class4
		method_test(4, "prop", [ 1, 2, 3, 4, 0 ]);
		method_test(4, "lv____5");
		method_test(4, "lv___4_", [ 0, 4 ]);
		method_test(4, "lv___45", [ 0, 4.5 ]);
		method_test(4, "lv__3__", [ 0, 3 ]);
		method_test(4, "lv__3_5", [ 0, 3.05 ]);
		method_test(4, "lv__34_", [ 0, 3.4, 4 ]);
		method_test(4, "lv__345", [ 0, 3.45, 4.5 ]);
		method_test(4, "lv_2___", [ 0, 2]);
		method_test(4, "lv_2__5", [ 0, 2.005 ]);
		method_test(4, "lv_2_4_", [ 0, 2.04, 4 ]);
		method_test(4, "lv_2_45", [ 0, 2.045, 4.5 ]);
		method_test(4, "lv_23__", [ 0, 2.3, 3 ]);
		method_test(4, "lv_23_5", [ 0, 2.305, 3.05 ]);
		method_test(4, "lv_234_", [ 0, 2.34, 3.4, 4 ]);
		method_test(4, "lv_2345", [ 0, 2.345, 3.45, 4.5 ]);
		method_test(4, "lv1____", [ 0, 1 ]);
		method_test(4, "lv1___5", [ 0, 1.0005 ]);
		method_test(4, "lv1__4_", [ 0, 1.004, 4 ]);
		method_test(4, "lv1__45", [ 0, 1.0045, 4.5 ]);
		method_test(4, "lv1_3__", [ 0, 1.03, 3 ]);
		method_test(4, "lv1_3_5", [ 0, 1.0305, 3.05 ]);
		method_test(4, "lv1_34_", [ 0, 1.034, 3.4, 4 ]);
		method_test(4, "lv1_345", [ 0, 1.0345, 3.45, 4.5 ]);
		method_test(4, "lv12___", [ 0, 1.2, 2 ]);
		method_test(4, "lv12__5", [ 0, 1.2005, 2.005 ]);
		method_test(4, "lv12_4_", [ 0, 1.204, 2.04, 4 ]);
		method_test(4, "lv12_45", [ 0, 1.2045, 2.045, 4.5 ]);
		method_test(4, "lv123__", [ 0, 1.23, 2.3, 3 ]);
		method_test(4, "lv123_5", [ 0, 1.2305, 2.305, 3.05 ]);
		method_test(4, "lv1234_", [ 0, 1.234, 2.34, 3.4, 4 ]);
		method_test(4, "lv12345", [ 0, 1.2345, 2.345, 3.45, 4.5 ]);
		// Class5
		method_test(5, "prop", [ 1, 2, 3, 4, 5 ]);
		method_test(5, "lv____5", [ 0, 5 ]);
		method_test(5, "lv___4_", [ 0, 4 ]);
		method_test(5, "lv___45", [ 0, 4.5, 5 ]);
		method_test(5, "lv__3__", [ 0, 3 ]);
		method_test(5, "lv__3_5", [ 0, 3.05, 5 ]);
		method_test(5, "lv__34_", [ 0, 3.4, 4 ]);
		method_test(5, "lv__345", [ 0, 3.45, 4.5, 5 ]);
		method_test(5, "lv_2___", [ 0, 2]);
		method_test(5, "lv_2__5", [ 0, 2.005, 5 ]);
		method_test(5, "lv_2_4_", [ 0, 2.04, 4 ]);
		method_test(5, "lv_2_45", [ 0, 2.045, 4.5, 5 ]);
		method_test(5, "lv_23__", [ 0, 2.3, 3 ]);
		method_test(5, "lv_23_5", [ 0, 2.305, 3.05, 5 ]);
		method_test(5, "lv_234_", [ 0, 2.34, 3.4, 4 ]);
		method_test(5, "lv_2345", [ 0, 2.345, 3.45, 4.5, 5 ]);
		method_test(5, "lv1____", [ 0, 1 ]);
		method_test(5, "lv1___5", [ 0, 1.0005, 5 ]);
		method_test(5, "lv1__4_", [ 0, 1.004, 4 ]);
		method_test(5, "lv1__45", [ 0, 1.0045, 4.5, 5 ]);
		method_test(5, "lv1_3__", [ 0, 1.03, 3 ]);
		method_test(5, "lv1_3_5", [ 0, 1.0305, 3.05, 5 ]);
		method_test(5, "lv1_34_", [ 0, 1.034, 3.4, 4 ]);
		method_test(5, "lv1_345", [ 0, 1.0345, 3.45, 4.5, 5 ]);
		method_test(5, "lv12___", [ 0, 1.2, 2 ]);
		method_test(5, "lv12__5", [ 0, 1.2005, 2.005, 5 ]);
		method_test(5, "lv12_4_", [ 0, 1.204, 2.04, 4 ]);
		method_test(5, "lv12_45", [ 0, 1.2045, 2.045, 4.5, 5 ]);
		method_test(5, "lv123__", [ 0, 1.23, 2.3, 3 ]);
		method_test(5, "lv123_5", [ 0, 1.2305, 2.305, 3.05, 5 ]);
		method_test(5, "lv1234_", [ 0, 1.234, 2.34, 3.4, 4 ]);
		method_test(5, "lv12345", [ 0, 1.2345, 2.345, 3.45, 4.5, 5 ]);
	}
	return res;
});
