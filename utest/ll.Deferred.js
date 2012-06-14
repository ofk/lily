var dfr = ll.Deferred;
var cnt = function (arr, n) {
	var c = 0;
	ll.each(arr, function (v) { v === n && ++c; });
	return c;
};

utest('ll.Deferred.call', [
	function (test) {
		var p = [];
		var d = new dfr;
		d.then(function () { p.push(1); });
		test([ p, [] ]);
		d.call();
		test([ p, [1] ]);
	},
	function (test) {
		var p = [];
		var d = new dfr;
		d.then(function () { p.push(1); })
		 .then(function () { p.push(2); })
		 .then(function () { p.push(3); })
		 .then(function () { p.push(4); })
		 .then(function () { p.push(5); });
		test([ p, [] ]);
		d.call();
		test([ p, [1,2,3,4,5] ]);
	},
	function (test) {
		var p = [];
		var d = new dfr;
		var d2 = d.then(function () { p.push(1); });
		test([ p, [] ]);
		d.call();
		test([ p, [1] ]);
		d2.then(function () { p.push(2); });
		test([ p, [1, 2] ]);
		d.call();
		test([ p, [1, 2, 1, 2] ]);
	},
	function (test) {
		var p = [];
		var d = new dfr;
		d.then(function (_) { p.push(1); return 2; })
		 .then(function (v) { p.push(v); return v + 1; })
		 .then(function (v) { p.push(v); return v + 1; })
		 .then(function (v) { p.push(v); return v + 1; })
		 .then(function (v) { p.push(v); return v + 1; });
		test([ p, [] ]);
		d.call();
		test([ p, [1,2,3,4,5] ]);
	},
	function (test) {
		var p = [];
		var d = new dfr;
		var d2 = d.then(function () { p.push(1); return 2; });
		test([ p, [] ]);
		d.call();
		test([ p, [1] ]);
		d2.then(function (v) { p.push(v); });
		test([ p, [1, 2] ]);
		d.call();
		test([ p, [1, 2, 1, 2] ]);
	},
	function (test) {
		var p = [];
		var d = new dfr;
		d.then(1).then(function (v) { p.push(v); });
		test([ p, [] ]);
		d.call();
		test([ p, [1] ]);
	},
	function (test) {
		var p = [];
		var d1 = new dfr, d2 = new dfr;
		d1.then(d2).then(function () { p.push(1); });
		test([ p, [] ]);
		d1.call();
		test([ p, [] ]);
		d2.call();
		test([ p, [1] ]);
	},
	function (test) {
		var p = [];
		var d1 = new dfr, d2 = new dfr;
		d1.then(d2).then(function () { p.push(1); });
		test([ p, [] ]);
		d2.call();
		test([ p, [] ]);
		d1.call();
		test([ p, [1] ]);
	}
]);

utest('ll.Deferred.then', [
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); });
		test([ p, [] ]);
		test([ p, [1] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); })
		   .then(function () { p.push(2); })
		   .then(function () { p.push(3); })
		   .then(function () { p.push(4); })
		   .then(function () { p.push(5); });
		test([ p, [] ]);
		test([ p, [1,2,3,4,5] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); return dfr.then(function () { p.push(2); }); })
		   .then(function () { p.push(3); });
		test([ p, [] ]);
		test([ p, [1,2,3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); return dfr.then(function () { p.push(2); }); })
		   .then(function () { p.push(3); return dfr.then(function () { p.push(4); }); })
		   .then(function () { p.push(5); });
		test([ p, [] ]);
		test([ p, [1,2,3,4,5] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.then(function () { p.push(1); }))
		   .then(function () { p.push(2); });
		test([ p, [] ]);
		test([ p, [1,2] ], 1000);
	},
	function (test) {
		dfr.then(function (_) { return dfr.then(function () { return 1; }); })
		   .then(function (v) { test([ v, 1 ]); });
	},
	function (test) {
		dfr.then(function () {
			return dfr.then(function () {
				return dfr.then(function () {
					return dfr.then(function () {
						return dfr.then(function () { return 1; });
					});
				});
			});
		}).then(function (v) { test([ v, 1 ]); });
	},
	function (test) {
		dfr.then(function (_) { return 1; })
		   .then(function (v) { test([ v, 1 ]); });
	},
	function (test) {
		dfr.then(function (_) { return 1; })
		   .then(function (v) { test([v, 1]); return 2; })
		   .then(function (v) { test([v, 2]); return 3; })
		   .then(function (v) { test([v, 3]); return 4; })
		   .then(function (v) { test([v, 4]); return 5; })
		   .then(function (v) { test([v, 5]); });
	},
	function (test) {
		dfr.then(dfr.then(function () { return 1; }))
		   .then(function (v) { test([ v, 1 ]); });
	},
	function (test) {
		dfr.then(dfr.then(function () { return 1; }))
		   .then(dfr.then(function () { return 2; }))
		   .then(function (v) { test([v, 2]); });
	}
]);

utest('ll.Deferred.when', [
	function (test) {
		var p = [];
		dfr.when([
		      function () { p.push(1); },
		      function () { p.push(2); }
		    ])
		   .then(function () { p.push(3); });
		test([ p, [] ]);
		setTimeout(function () {
			test([ cnt(p, 1), 1 ]);
			test([ cnt(p, 2), 1 ]);
			test([ cnt(p, 3), 1 ]);
			test([ p.join(','), '=~', /^(?:[12],){2}3$/ ]);
		}, 1000);
	},
	function (test) {
		var p = [];
		dfr.when({
		      a: function () { p.push(1); },
		      b: function () { p.push(2); }
		    })
		   .then(function () { p.push(3); });
		test([ p, [] ]);
		setTimeout(function () {
			test([ cnt(p, 1), 1 ]);
			test([ cnt(p, 2), 1 ]);
			test([ cnt(p, 3), 1 ]);
			test([ p.join(','), '=~', /^(?:[12],){2}3$/ ]);
		}, 1000);
	},
	function (test) {
		var p = [];
		dfr.when([
		     function () { p.push(11); },
		     function () { p.push(12); },
		     function () { p.push(13); },
		     function () { p.push(14); },
		     function () { p.push(15); }
		   ])
		   .when({
		     a: function () { p.push(21); },
		     b: function () { p.push(22); },
		     c: function () { p.push(23); },
		     d: function () { p.push(24); },
		     e: function () { p.push(25); }
		   })
		   .then(function () { p.push(3); });
		test([ p, [] ]);
		setTimeout(function () {
			test([ cnt(p, 11), 1 ]);
			test([ cnt(p, 12), 1 ]);
			test([ cnt(p, 13), 1 ]);
			test([ cnt(p, 14), 1 ]);
			test([ cnt(p, 15), 1 ]);
			test([ cnt(p, 21), 1 ]);
			test([ cnt(p, 22), 1 ]);
			test([ cnt(p, 23), 1 ]);
			test([ cnt(p, 24), 1 ]);
			test([ cnt(p, 25), 1 ]);
			test([ cnt(p, 3), 1 ]);
			test([ p.join(','), '=~', /^(?:1[1-5],){5}(?:2[1-5],){5}3$/ ]);
		}, 1000);
	},
	function (test) {
		dfr.when([function () { return 1; }])
		   .then(function (v) { test([v, [1]]); });
	},
	function (test) {
		dfr.when([function () { return 1; },
		          function () { return 2; },
		          function () { return 3; },
		          function () { return 4; },
		          function () { return 5; }])
		   .then(function (v) { test([v, [1,2,3,4,5]]); });
	},
	function (test) {
		dfr.when({
		      a: function (_) { return 1; },
		      b: function (_) { return 2; },
		      c: function (_) { return 3; },
		      d: function (_) { return 4; },
		      e: function (_) { return 5; }
		    })
		   .then(function (v) { test([v, {a:1,b:2,c:3,d:4,e:5}]); });
	},
	function (test) {
		dfr.when([dfr.then(function () { return 1; })])
		   .then(function (v) { test([v, [1]]); });
	},
	function (test) {
		dfr.when([dfr.then(function () { return 1; }),
		          dfr.then(function () { return 2; }),
		          dfr.then(function () { return 3; }),
		          dfr.then(function () { return 4; }),
		          dfr.then(function () { return 5; })])
		   .then(function (v) { test([v, [1,2,3,4,5]]); });
	},
	function (test) {
		dfr.when({
		     a: dfr.then(function () { return 1; }),
		     b: dfr.then(function () { return 2; }),
		     c: dfr.then(function () { return 3; }),
		     d: dfr.then(function () { return 4; }),
		     e: dfr.then(function () { return 5; })
		   })
		   .then(function (v) { test([v, {a:1,b:2,c:3,d:4,e:5}]); });
	}
]);

utest('ll.Deferred.wait', [
	function (test) {
		var p = [];
		dfr.wait(2)
		   .then(function (ms) { p.push(1); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		test([ p, [] ]);
		test([ p, [] ], 1000);
		test([ p, [1] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); })
		   .wait(2)
		   .then(function (ms) { p.push(2); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		test([ p, [] ]);
		test([ p, [1] ], 1000);
		test([ p, [1,2] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); return dfr.wait(2); })
		   .then(function (ms) { p.push(2); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		test([ p, [] ]);
		test([ p, [1] ], 1000);
		test([ p, [1,2] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); return dfr.then(function () { p.push(2); }); })
		   .wait(2)
		   .then(function (ms) { p.push(3); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		test([ p, [] ]);
		test([ p, [1,2] ], 1000);
		test([ p, [1,2,3] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); return dfr.then(function () { p.push(2); }).wait(2); })
		   .then(function (ms) { p.push(3); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		test([ p, [] ]);
		test([ p, [1,2] ], 1000);
		test([ p, [1,2,3] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(function () {
			p.push(1);
			return dfr.then(function () { p.push(2); })
			          .wait(2)
			          .then(function (ms) { p.push(3); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		});
		test([ p, [] ]);
		test([ p, [1,2] ], 1000);
		test([ p, [1,2,3] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(function () {
		     p.push(1);
		     return dfr.then(function () { p.push(2); })
		               .wait(2)
		               .then(function (ms) { p.push(3); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		   })
		   .then(function () { p.push(4); });
		test([ p, [] ]);
		test([ p, [1,2] ], 1000);
		test([ p, [1,2,3,4] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(function () {
		     p.push(1);
		     return dfr.then(function () { p.push(2); })
		               .wait(2)
		               .then(function (ms) { p.push(3); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		   })
		   .wait(2)
		   .then(function () { p.push(4); });
		test([ p, [] ]);
		test([ p, [1,2] ], 1000);
		test([ p, [1,2,3] ], 3000);
		test([ p, [1,2,3,4] ], 5000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.wait(2))
		   .then(function () { p.push(1); });
		test([ p, [] ]);
		test([ p, [] ], 1000);
		test([ p, [1] ], 3000);
	},
	function (test) {
		var p = [];
		var d = dfr.wait(2);
		setTimeout(function () {
			dfr.then(d)
			   .then(function () { p.push(1); });
		}, 0);
		test([ p, [] ]);
		test([ p, [] ], 1000);
		test([ p, [1] ], 3000);
	},
	function (test) {
		var p = [];
		var d = dfr.wait(2);
		setTimeout(function () {
			dfr.then(d)
			   .then(function () { p.push(1); });
		}, 1000);
		test([ p, [] ]);
		test([ p, [] ], 1000);
		test([ p, [1] ], 4000);
	},
	function (test) {
		var p = [];
		var d = dfr.wait(2);
		setTimeout(function () {
			dfr.then(d)
			   .then(function () { p.push(1); });
		}, 3000);
		test([ p, [] ]);
		test([ p, [] ], 1000);
		test([ p, [1] ], 5000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.then(function () { p.push(1); }))
		   .wait(2)
		   .then(function (ms) { p.push(2); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		test([ p, [] ]);
		test([ p, [1] ], 1000);
		test([ p, [1,2] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.then(function () { p.push(1); }).wait(2))
		   .then(function (ms) { p.push(2); test([ms, '>=', 1900]); test([ms, '<=', 2100]); });
		test([ p, [] ]);
		test([ p, [1] ], 1000);
		test([ p, [1,2] ], 5000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.then(function () { p.push(1); })
		            .wait(2)
		            .then(function (ms) { p.push(2); test([ms, '>=', 1900]); test([ms, '<=', 2100]); }))
		   .then(function () { p.push(3); });
		test([ p, [] ]);
		test([ p, [1] ], 1000);
		test([ p, [1,2,3] ], 3000);
	},
	function (test) {
		var p = [];
		dfr.when([
		     dfr.then(function () { p.push(1); }).wait(4).then(function () { p.push(3); }),
		     dfr.wait(2).then(function () { p.push(2); }).wait(4).then(function () { p.push(4); })
		   ])
		   .wait(1)
		   .then(function () { p.push(5); });
		test([ p, [] ]);
		test([ p, [1] ], 1000);
		test([ p, [1,2] ], 3000);
		test([ p, [1,2,3] ], 5000);
		test([ p, [1,2,3,4] ], 7000);
		test([ p, [1,2,3,4,5] ], 9000);
	}
]);

utest('ll.Deferred.lose', [
	function (test) {
		var p = [];
		dfr.then(function (_) { p.push(1); return 10; })
		   .lose(function (e) { p.push(2); e && p.push(-1); })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1,3,10] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function (_) { p.push(1); throw new Error; return 10; })
		   .lose(function (e) { p.push(2); e && p.push(-1); })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1,2,-1,3,null] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); throw new Error; return 10; })
		   .lose(function (e) { p.push(2); e && p.push(-1); throw new Error; })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1,2,-1] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); throw new Error; return 10; })
		   .lose(function (e) { p.push(2); e && p.push(-1); throw new Error; })
		   .lose(function (e) { p.push(3); e && p.push(-1); throw new Error; })
		   .lose(function (e) { p.push(4); e && p.push(-1); })
		   .then(function (v) { p.push(5); p.push(v||null); });
		test([ p, [1,2,-1,3,-1,4,-1,5,null] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); throw new Error; return 10; })
		   .lose(function (e) { p.push(2); e && p.push(-1); throw new Error; })
		   .lose(function (e) { p.push(3); e && p.push(-1); })
		   .lose(function (e) { p.push(4); e && p.push(-1); })
		   .then(function (v) { p.push(5); p.push(v||null); });
		test([ p, [1,2,-1,3,-1,5,null] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); return 10; })
		   .lose(function (e) { p.push(2); e && p.push(-1); })
		   .lose(function (e) { p.push(3); e && p.push(-1); })
		   .lose(function (e) { p.push(4); e && p.push(-1); })
		   .then(function (v) { p.push(5); p.push(v||null); });
		test([ p, [1,5,10] ], 1000);
	},
	function (test) {
		var p = [];
		var d = new dfr;
		d.lose(function (e) { p.push(1); })
		 .then(function (v) { p.push(2); });
		d.call();
		test([ p, [2] ], 1000);
	},
	function (test) {
		var p = [];
		var d = new dfr;
		d.lose(function (e) { p.push(1); })
		 .lose(function (e) { p.push(2); })
		 .then(function (v) { p.push(3); });
		d.call();
		test([ p, [3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () { p.push(1); throw new Error; return 10; })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.then(function () { p.push(1); return 10; }))
		   .lose(function (e) { p.push(2); p.push(e?'E':''); })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1,3,10] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.then(function () { p.push(1); throw new Error; return 10; }))
		   .lose(function (e) { p.push(2); e && p.push(-1); })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1,2,-1,3,null] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () {})
		   .then(dfr.then(function () { p.push(1); return 10; }))
		   .lose(function (e) { p.push(2); p.push(e?'E':''); })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1,3,10] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(function () {})
		   .then(dfr.then(function () { p.push(1); throw new Error; return 10; }))
		   .lose(function (e) { p.push(2); e && p.push(-1); })
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1,2,-1,3,null] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.then(dfr.then(function () { p.push(1); throw new Error; return 10; }))
		   .then(function (v) { p.push(3); p.push(v||null); });
		test([ p, [1] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.when([function () { p.push(1); throw new Error; },
		          function () { p.push(2); throw new Error; }])
		   .lose(function (e) { p.push(3); })
		   .then(function () { p.push(4); });
		setTimeout(function () {
			test([ cnt(p, 1), 1 ]);
			test([ cnt(p, 2), 1 ]);
			test([ cnt(p, 3), 2 ]);
			test([ cnt(p, 4), 1 ]);
			test([ p.join(','), '=~', /^(?:[12],3,){2}4$/ ]);
		}, 1000);
	}
]);

utest('ll.Deferred.each', [
	function (test) {
		var p = [];
		dfr.each([ 1, 23, 456, 7890 ], function (v) { p.push(v||null); })
		   .then(function () { p.push(2); });
		test([ p, [1,23,456,7890,2] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 23, 456, 7890 ], function (v) { p.push(v||null); })
		   .lose(function () { p.push(2); })
		   .then(function () { p.push(3); });
		test([ p, [1,23,456,7890,3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 23, 456, 7890 ], function (v) { p.push(v||null); })
		   .each([ 1, 23, 456, 7890 ], function (v) { p.push(v*2); })
		   .each([ 1, 23, 456, 7890 ], function (v) { p.push(v*3); });
		test([ p, [1,23,456,7890,1*2,23*2,456*2,7890*2,1*3,23*3,456*3,7890*3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 23, 456, 7890 ], function (v) { p.push(v||null); }, { start: 2, end: 1 })
		   .lose(function () { p.push(2); })
		   .then(function () { p.push(3); });
		test([ p, [456,23,3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1 ],
				 function (v, i) { p.push(v||null); return false; })
		   .lose(function () { p.push(2); })
		   .then(function () { p.push(3); });
		test([ p, [1,2,3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1 ],
				 function (v, i) {
					 p.push(v||null);
					 if (i === 24) return false;
					 return void 0;
				 })
		   .lose(function () { p.push(2); })
		   .then(function () { p.push(3); });
		test([ p, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1 ],
				 function (v, i) { p.push(v||null); return false; })
		   .then(function () { p.push(3); });
		test([ p, [1,3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1,
		           1, 1, 1, 1, 1 ],
				 function (v, i) {
					 p.push(v||null);
					 if (i === 24) return false;
					 return void 0;
				 })
		   .then(function () { p.push(3); });
		test([ p, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3] ], 1000);
	}
]);

utest('ll.Deferred.loop', [
	function (test) {
		var p = [];
		dfr.loop(4, function (v) { p.push(v==null?null:v); })
		   .then(function () { p.push(-1); });
		test([ p, [0,1,2,3,-1] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.loop(4, function (v) { p.push(v==null?null:v); })
		   .lose(function () { p.push(-2); })
		   .then(function () { p.push(-1); });
		test([ p, [0,1,2,3,-1] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.loop(4, function (v) { p.push(v); })
		   .loop(4, function (v) { p.push(v*2); })
		   .loop(4, function (v) { p.push(v*3); });
		test([ p, [0,1,2,3,0*2,1*2,2*2,3*2,0*3,1*3,2*3,3*3] ], 1000);
	},
	function (test) {
		var p = [];
		dfr.each([ 1, 23, 456, 7890 ], function (v) { p.push(v||null); })
		   .then(function () { p.push(2); });
		test([ p, [1,23,456,7890,2] ], 1000);
	}
]);
