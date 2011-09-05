// utest.js - ユニットテスト用JavaScript
//
// @example
//  utest('test1', {
//    right1: function ()  { return true; },
//    right2: function ()  { return [true,[true],[1,1],[2,'==','2'],{expr:true}]; },
//    right3: function ()  { return {a:true,b:[true],c:[1,1],d:[2,'==','2'],e:{expr:true}}; },
//    right4: function (f) { f(true);f([true]);f([1,1]);f([2,'==','2']);f({expr:true}); },
//    right5: function (f) { f(true);return true; },
//    delay:  function (f) { f(true, 100); setTimeout(function(){f(true)}, 100); },
//    wrong1: function ()  { return false; },
//    wrong2: function ()  { return [[false],[true]]; },
//    wrong3: function (f) { f(true); return false; },
//    error1: function ()  { ng(); },
//    error2: function ()  { throw new Error; }
//  });
//  utest('test2', [ fun, 'named', fun, fun ]);

var utest = (function () {

// utestの実行
function utest() {
	if (!utest.enable) return null;
	// 配列に変換
	var args = Array.prototype.slice.call(arguments),
	    type_args_0 = utest.type(args[0]);
	// args[0]: 名前の省略の修正
	if (type_args_0 === 'array'
	 || type_args_0 === 'object'
	 || type_args_0 === 'function') {
		args.unshift(null);
	}
	return new utest.Test(args[0], args[1], args[2], args[3]);
}

// utestが実行可能かどうか
utest.enable = true;

// utestが呼ばれた回数
utest.count = 0;

// テスト自体の個数
utest.total = 0;

// -----------------------------------------------------------------------------

// オブジェクトの型の判定
// @param {mixed} obj
// @return {String}
utest.type = function type(obj) {
	var t = typeof obj;
	return utest_type_values[t] || (t = utest_type_values[utest_type_detector.call(obj)]) ? t :
	       !obj           ? 'null' :
	       obj.setTimeout ? 'window' :
	       obj.nodeType   ? 'node' :
	       'length' in obj && typeof (t = obj.length) === 'number' && (!t || t - 1 in obj) ? 'array' : 'object';
};
// convert to value from type result
var utest_type_values = {
	'undefined':         1,
	'boolean':           1,
	'number':            1,
	'string':            1,
	'[object Boolean]':  'boolean',
	'[object Number]':   'number',
	'[object String]':   'string',
	'[object RegExp]':   'regexp',
	'[object Array]':    'array',
	'[object Function]': 'function',
	'[object Date]':     'date'
},
// type detect function
utest_type_detector = Object.prototype.toString;

// オブジェクトのダンプ
// @param {mixed} obj
// @param {String} [indent]
// @return {String}
utest.dump = function dump(obj, indent) {
	indent = indent || dump.indent || '  ';

	var rv = utest.type(obj),
	    arr = [],
	    maxLength = dump.maxLength || 16;

	switch (rv) {
		case 'boolean':
		case 'number':
		case 'regexp':
		case 'date':
		case 'function':
			rv = '' + obj;
			break;
		case 'string':
			rv = "'" + obj.replace(/\\/g, '\\\\')
			              .replace(/'/g, "\\'")
			              .replace(/\r/g, '\\r')
			              .replace(/\n/g, '\\n') + "'";
			break;
		case 'node':
			rv = obj.nodeType === 9 ? 'document'
			                        : '<' + (obj.tagName ? obj.tagName.toLowerCase() : 'text') + '>';
			break;
		case 'array':
		case 'object':
			var b_open, b_close;
			if (rv === 'array') {
				b_open = '['; b_close = ']';
				var isSome = false;
				for (var i = 0, iz = obj.length; i < iz; ++i) {
					if (!isSome && obj.hasOwnProperty(i)) {
						isSome = true;
					}
					arr[i] = dump(obj[i], indent);
				}
				if (!isSome) {
					arr = [];
				}
			}
			else {
				b_open = '{'; b_close = '}';
				if (utest.type(obj.toString) === 'function' && obj.toString !== Object.prototype.toString) {
					return obj.toString();
				}
				var reg_key = /^[a-z_$][a-z0-9_$]*$/i, q = -1;
				for (var i in obj) {
					arr[++q] = (reg_key.test(i) ? i : dump(i, indent)) + ': '
					                                + dump(obj[i], indent);
				}
			}
			if (arr.length) {
				rv = b_open + ' ' + arr.join(', ') + ' ' + b_close;
				if (rv.length > maxLength) {
					rv = b_open + ('\n' + arr.join(',\n')).replace(/\n/g, '\n' + indent) + '\n' + b_close;
				}
			}
			else {
				rv = b_open + b_close;
			}
			break;
	}

	return rv;
};

// -----------------------------------------------------------------------------

// prepend
// @param {Node} node
// @param {Node|String} elem
// @return {Node}
utest.prepend = function prepend(node, elem) {
	return node.firstChild ? node.insertBefore(elem.nodeType ? elem : utest.text(elem), node.firstChild)
	                       : utest.append(node, elem);
};

// append
// @param {Node} node
// @param {Node|String} elem
// @return {Node}
utest.append = function append(node, elem) {
	return node.appendChild(elem.nodeType ? elem : utest.text(elem));
};

// createTextNode
// @param {String} text
// @return {Node}
utest.text = function text(text) {
	return document.createTextNode(text);
};

// createElement
// @param {String} tag
// @param {Object} [attr]
// @param {String} [text]
// @return {Node}
utest.$N = function $N(tag, attr, text) {
	var elem = document.createElement(tag);
	if (attr) {
		for (var i in attr) {
			elem[i] = attr[i];
		}
	}
	if (text) {
		elem.appendChild(utest.text(text));
	}
	return elem;
};

// setStyle
// @param {String} styles
utest.setStyle = function setStyle(styles) {
	if (document.createStyleSheet) {
		document.createStyleSheet("javascript:'" + styles + "'");
	}
	else {
		utest.append(
			document.documentElement.firstChild,
			utest.$N('link', { rel: 'stylesheet', href: 'data:text/css,' + escape(styles) })
		);
	}
};

// addEvent
// @param {Node} node
// @param {String} type
// @param {Function} func
// @return {Function}
utest.addEvent = function addEvent(node, type, func) {
	function proxy(evt) {
		evt = evt || window.event;
		if (func(evt, evt.target || evt.srcElement) === false) {
			evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
			evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = false);
		}
	};
	node.addEventListener ? node.addEventListener(type, proxy, false)
	                      : node.attachEvent('on' + type, proxy);
	return proxy;
};

// removeEvent
// @param {Node} node
// @param {String} type
// @param {Function} proxy
utest.removeEvent = function removeEvent(node, type, proxy) {
	node.removeEventListener ? node.removeEventListener(type, proxy, false)
	                         : node.detachEvent('on' + type, proxy);
};

// -----------------------------------------------------------------------------

utest.Test = function Test() {
	utest.Test.init && utest.Test.init.apply(utest.Test, arguments);
	this.init && this.init.apply(this, arguments);
};

utest.Test.init = function init() {
	// 呼び出しは一度
	utest.Test.init = null;
	// スタイルの設定
	utest.setStyle([
		'body, h1, h2, p { margin: 0; padding: 0; }',
		'body { padding: 10px; }',
		'h1 { background: #069; font-size: 120%; color: #fff; padding: 2px 5px; }',
		'h2 { background: #eee; font-size: 85%; padding: 2px 5px; }',
		'h2 .stand { color: yellow; }',
		'h2 .right { color: green; }',
		'h2 .wrong { color: red; }',
		'p { margin: 5px 0 10px; }',
		'p span { display: inline-block; padding: 2px; color: #fff; font-size: 85%; }',
		'p span.stand { background: yellow; color: #000; }',
		'p span.right { background: green; }',
		'p span.wrong { background: red; font-size: 100%; }'
	].join(''));
	// ノードの生成
	utest.Test._root = utest.prepend(
		document.body,
		utest.$N('div', { id: 'utest' })
	);
	utest.append(
		utest.Test._root,
		utest.$N('h1', {}, document.title)
	);
	// イベントの設定
	utest.addEvent(utest.Test._root, 'click', function (evt, elem) {
		elem.title && alert(elem.title);
	});
};

utest.Test.prototype = {
	// コンストラクター
	// @param {String} name
	// @param {mixed} tests
	// @param {Number} [delay]
	// @param {Number} [timeout]
	init: function init(name, tests, delay, timeout) {
		// ノーの生成
		var div = utest.append(
			utest.Test._root,
			utest.$N('div', { className: 'utests', id: 'utests' + (++utest.count) })
		);
		// プロパティの設定
		var type_tests_function = utest.type(tests) === 'function';
		this.count = utest.count;
		this.count_stand = 0;
		this.count_right = 0;
		this.count_wrong = 0;
		this.count_total = 0;
		this.name = name = name || (type_tests_function && tests.name)
		                        || 'Test ' + this.count;
		this.delay = +delay;
		this.timeout = +timeout || (this.delay || 1) * 10;
		// コンテナーの設定
		this.header = utest.append(div, utest.$N('h2', {}, name));
		this.result = utest.append(div, utest.$N('p'));
		// テストの実行
		if (type_tests_function) {
			var that = this;
			this.setup(tests(function setup(tests, comp) {
				that.setup(tests, comp);
			}));
		}
		else {
			this.setup(tests);
		}
	},
	// テストの設定と実行。
	// @param {Array|Object} tests
	// @param {Function} [comp]
	setup: function (tests, comp) {
		if (!tests) {
			return;
		}

		// オブジェクトの正規化
		var type_tests = utest.type(tests);
		if (type_tests === 'array') {}
		else if (type_tests === 'object') {
			var arr = [], q = -1;
			for (var i in tests) {
				arr[++q] = i;
				arr[++q] = tests[i];
			}
			tests = arr;
		}
		else {
			return;
		}

		// テストの実行
		var that = this;
		function run(test, i, tests, comp) {
			switch (utest.type(test)) {
				case 'boolean':
				case 'array':
				case 'object':
					// テスト関数への変換
					tests[i] = test = (function (expr) {
						return function () { return [expr]; };
					}(test));
				case 'function':
					that.test(utest.type(tests[i - 1]) !== 'function' ? tests[i - 1] : test.name || null, test, comp);
					return true;
				default:
					return false;
			}
		}

		if (utest.type(comp) !== 'function') {
			comp = null;
		}

		// 非同期テスト
		if (this.delay) {
			var delay = this.delay, timeout = this.timeout;
			(function loop(i) {
				// ループの終了
				if (i >= tests.length) {
					comp && comp.call(this);
					return;
				}
				// 準備
				var called = false, tid_timeout, tid_delay, next = function () {
					if (called) return;
					called = true;
					clearTimeout(tid_timeout);
					clearTimeout(tid_delay);
					loop(i + 1);
				};
				// 実行
				if (run(tests[i], i, tests, function () {
					if (called) return;
					clearTimeout(tid_delay);
					tid_delay = setTimeout(next, delay);
				})) {
					tid_timeout = setTimeout(next, timeout);
				}
				else {
					loop(i + 1);
				}
			}(0));
		}
		// 同期テスト
		else {
			for (var i = 0, iz = tests.length; i < iz; ++i) {
				run(tests[i], i, tests);
			}
			comp && comp.call(this);
		}
	},
	// テストの実行
	// @param {String} name
	// @param {Function} test
	// @param {Function} [comp]
	test: function test(name, test, comp) {
		if (utest.type(test) !== 'function') {
			return;
		}
		if (utest.type(comp) !== 'function') {
			comp = null;
		}
		// カウンタの実行
		++utest.total;
		++this.count_total;
		++this.count_stand;
		// ノード生成
		var span = utest.append(
			this.result,
			utest.$N('span', { className: 'stand' }, name || 'test ' + this.count_total)
		);
		utest.append(this.result, ' ');
		// テストの実行
		var res, that = this;
		try {
			res = test(function (res, delay) {
				var res_type_obj = utest.type(res) === 'object';
				switch (utest.type(delay)) {
					case 'number':
						res_type_obj ? (res.delay = delay)
						             : (res = { expr: res, delay: delay });
						break;
					case 'object':
						res_type_obj ? (res.error = delay)
						             : (res = { error: delay });
				}
				that._test(span, res, comp);
			});
		} catch (e) {
			this._test(span, { error: e }, comp);
			return;
		}
		switch (utest.type(res)) {
			case 'object':
				for (var i in res) {
					var t = res[i];
					utest.type(t) === 'object' ? (t.name = i)
					                           : (t = { name: i, expr: t });
					this._test(span, t, comp);
				}
				break;
			case 'array':
				for (var i = 0, iz = res.length; i < iz; ++i) {
					var t = res[i];
					utest.type(t) !== 'object' && (t = { expr: t });
					this._test(span, t, comp);
				}
				break;
			default:
				this._test(span, res, comp);
				break;
		}
	},
	// テスト結果の画面への反映
	// @param {Node} span
	// @param {mixed} res
	//        Object: { expr: mixed, [error: object], [name: string], [delay: number] }
	//        Array: -> { expr: Array }
	//        boolean: -> { expr: boolean }
	// @param {Function} [comp]
	_test: function _test(span, res, comp) {
		// 遅延評価
		if (res && res.delay) {
			var that = this;
			setTimeout(function () {
				res.delay = null;
				that._test(span, res, comp);
			}, res.delay);
			return;
		}
		res = utest.judge(res);
		if (!res) {
			return;
		}
		var state = (/wrong|right/.exec(span.className) || [ 'stand' ])[0]
		switch (res.result) {
			case false:
				if (state !== 'wrong') {
					--this['count_' + state];
					++this.count_wrong;
					span.className = 'wrong';
				}
				break;
			case true:
				if (state === 'stand') {
					--this.count_stand;
					++this.count_right;
					span.className = 'right';
				}
				break;
			default:
				return;
		}
		var message = (res.name ? res.name + '> ' : '') + res.message;
		span.title ? (span.title += '\n' + message) : (span.title = message);

		this.header.innerHTML = [
			this.name,
			' ( ',
			'<span class="right">', this.count_right, '</span> / ',
			'<span class="wrong">', this.count_wrong, '</span> / ',
			//'<span class="stand">', this.count_stand, '</span> / ',
			'<span class="total">', this.count_total, '</span>',
			' )'
		].join('');

		comp && comp.call(this);
	}
};

// -----------------------------------------------------------------------------

// 実行結果の評価
// @param {mixed} res
// @return {Object}
utest.judge = function judge(res) {
	if (res == null) {
		return null;
	}
	if (utest.type(res) !== 'object') {
		res = { expr: res };
	}
	if (res.error) {
		res.result = false;
		res.message = res.error;
		return res;
	}
	var expr = res.expr;
	var type_expr = utest.type(expr);
	if (type_expr === 'boolean') {
		res.result = expr;
		res.message = utest_judge_message(expr);
		return res;
	}
	if (type_expr !== 'array') {
		return null;
	}
	switch (expr.length) {
		case 0:
			return null;
		case 1:
			res.result = !!expr[0];
			res.message = utest_judge_message(expr[0]);
			break;
		case 2:
			res.result = !!utest.op['==='](expr[0], expr[1]);
			res.message = utest_judge_message(expr[0], '===', expr[1]);
			break;
		default:
			res.result = expr[1] in utest.op ? utest.op[expr[1]](expr[0], expr[2]) : false;
			res.message = utest_judge_message(expr[0], expr[1], expr[2]);
			break;
	}
	return res;
};
function utest_judge_message(v1, op, v2) {
	return op ? [
		'(' + utest.type(v1) + ')', utest.dump(v1),
		op,
		'(' + utest.type(v2) + ')', utest.dump(v2)
	].join(' ') : '(' + utest.type(v1) + ') ' + utest.dump(v1);
}

// オペレータの設定
utest.op = {
	'===': function (v1, v2) {
		var t1 = utest.type(v1), t2 = utest.type(v2);
		if (t1 !== t2) {
			return false;
		}
		if (t1 === 'null' || t1 === 'undefined') {
			return true;
		}
		if (utest.type(v1.equals) === 'function' && utest.type(v2.equals) === 'function') {
			return v1.equals(v2) && v2.equals(v1);
		}
		switch (t1) {
			case 'array':
				if (v1.length !== v2.length) {
					return false;
				}
				for (var i = 0, iz = v1.length; i < iz; ++i) {
					var i_in_v1 = i in v1,
					    i_in_v2 = i in v2;
					if (i_in_v1 !== i_in_v2) {
						return false;
					}
					if (i_in_v1 && i_in_v2) {
						if (!utest.op['==='](v1[i], v2[i])) return false;
					}
				}
				return true;
			case 'object':
				for (var i in v1) {
					if (!utest.op['==='](v1[i], v2[i])) return false;
				}
				for (var i in v2) {
					if (!utest.op['==='](v1[i], v2[i])) return false;
				}
				return true;
		}
		return v1 === v2;
	},
	'==':  function (v1, v2) { return v1 == v2; },
	'!==': function (v1, v2) { return !utest.op['==='](v1, v2); },
	'!=':  function (v1, v2) { return v1 != v2; },
	'>':   function (v1, v2) { return v1 >  v2; },
	'>=':  function (v1, v2) { return v1 >= v2; },
	'<':   function (v1, v2) { return v1 <  v2; },
	'<=':  function (v1, v2) { return v1 <= v2; },
	'=~':  function (v1, v2) {
		switch (utest.type(v2)) {
			case 'array':
				for (var i = 0, iz = v2.length; i < iz; ++i) {
					if (utest.op['==='](v1, v2[i])) return true;
				}
				break;
			case 'object':
				for (var i in v2) {
					if (utest.op['==='](v1, v2[i])) return true;
				}
				break;
			case 'regexp':
				return v2.test(v1);
			case 'string':
			case 'number':
				switch (utest.type(v1)) {
					case 'string':
					case 'number':
						return ('' + v1).indexOf(v2) > -1;
					default:
						return v2 in v1;
				}
		}
		return false;
	}
};

// -----------------------------------------------------------------------------

return utest;

}());
