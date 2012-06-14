/**
 * @fileOverview
 *   This file has features related to development of applications in JavaScript.
 * @author <a href="http://0fk.org/">ofk</a>
 * @version 0.2
 * @license
 *   lily.js a.k.a. LIght LibrarY JavaScript (c) 2011 ofk
 *   lily is licensed under the MIT.
 */

/**
 * Global namespace used by lily.js.
 * It has several functions and classes.
 *
 * @namespace
 *   lily.js provides a common feature.
 */

var ll = (function () { //< Expose ll to the global object

	// -----------------------------------------------------------------------------
	// Cache of native objects.

	var
	is_support_bind = !!Function.prototype.bind,
	_document = window.document,
	_isFinite = isFinite,
	_TypeError = TypeError,
	_Date = Date,
	_Array_slice = Array.prototype.slice,
	_Object_toString = Object.prototype.toString; //< Type detect function


	// -----------------------------------------------------------------------------
	// All public classes and functions will be attached to the ll.

	llextend(ll, {
		log:      lllog,
		type:     lltype,
		extend:   llextend,
		each:     lleach,
		Event:    llEvent,
		KVObject: llKVObject,
		Dispatch: llDispatch,
		Deferred: llDeferred
	});


	// -----------------------------------------------------------------------------
	// Define a local copy of ll.

	/**
	 * Make Prototype's class-based OOP system.
	 *
	 * @example
	 * Animal = ll({
	 *   init: function (name) { this.name = name; },
	 *   walk: function () { print('teku teku'); },
	 *   sing: function () { print('la la la'); }
	 * });
	 * Human = ll(Animal, {
	 *   speak: function () { print('hello'); }	 
	 * });
	 * Singer = ll(Human, {
	 *   speak: function () { print('hello!!'); },
	 *   sing: function () { for (var i = 0; i < 3; ++i) this.parent('sing')(); }
	 * });
	 * lily = Singer('yuri');
	 * lily.name; // 'yuri'
	 * lily.walk(); // teku teku
	 * lily.speak(); // hello!!
	 * lily.sing(); // la la la la la la la la la
	 *
	 * @name ll
	 * @param {Function} [SuperClass] 
	 * @param {Function} Class
	 * @returns {Function} The class function.
	 */
	function ll(SuperClass, def) {
		def || (def = SuperClass, SuperClass = null);

		// create class
		function Class() {
			// called as a constructor
			this.init && this.init.apply(this, arguments);
		}

		// classical inheritance
		if (SuperClass) {
			// dummy super class
			function ParentClass() {}
			ParentClass.prototype = SuperClass.prototype;
			// inherit from superclass
			Class.prototype = new ParentClass;
			var ClassProto = Class.prototype;
			// set properties
			for (var name in def) {
				ClassProto[name] = def[name];
			}

			// calls same method as its caller but in the superclass
			var parentDef = new ParentClass;
			ClassProto.parent = function parent(name) {
				// methods cache
				parent._proto_cache || (parent._proto_cache = {});
				var ParentProtoCache = parent._proto_cache;
				if (!(name in ParentProtoCache)) {
					ParentProtoCache[name] = null;
					var BaseClass = Class, BaseProto = ClassProto;
					while (!BaseProto.hasOwnProperty(name)) {
						BaseClass = BaseProto.superConstructor;
						BaseProto = BaseClass.prototype;
					}
					BaseClass = BaseProto.superConstructor;
					for (; BaseClass; BaseClass = BaseProto.superConstructor) {
						BaseProto = BaseClass.prototype;
						if (BaseProto.hasOwnProperty(name)) {
							ParentProtoCache[name] = BaseProto;
							break;
						}
					}
				}

				var ParentProto = ParentProtoCache[name];
				if (!ParentProto) {
					throw new _TypeError(this + " has no method " + name);
				}

				var that = this;
				// multistage inheritance
				if (ParentProto.parent) {
					return function () {
						var copy = {}, key;
						for (key in that) {
							copy[key] = that[key];
						}
						copy.parent = is_support_bind ? ParentProto.parent.bind(copy) : function () {
							return ParentProto.parent.apply(copy, arguments);
						};
						var ret = ParentProto[name].apply(copy, arguments);
						delete copy.parent;
						for (key in copy) {
							that[key] = copy[key];
						}
						return ret;
					};
				}
				// simple inheritance
				return is_support_bind ? ParentProto[name].bind(that) : function () {
					return ParentProto[name].apply(that, arguments);
				};
			};

			ClassProto.superConstructor = SuperClass;
		}
		// set properties
		else {
			Class.prototype = def;
		}

		Class.prototype.constructor = Class;

		return Class;
	}

	/**
	 * Outputs a dump of the variable.
	 *
	 * @methodOf ll
	 * @name log
	 */
	function lllog() {
		var args = _Array_slice.call(arguments);
		if (!args.length) {
			return;
		}
		args.push("at " + new Date);

		if (window.console && window.console.log) {
			"apply" in console.log ? console.log.apply(console, args) :
			           console.dir ? console.dir(args) : console.log(args);
		}
		else if (_document) {
			var pre = _document.createElement("pre");
			pre.className = "console";
			pre.appendChild(_document.createTextNode(args.join(", "))); //< FIXME
			_document.documentElement.appendChild(pre);
		}
	}

	/**
	 * Detect a type of the object.
	 * <ul>
	 * <li>If the object is undefined or null, then &quot;undefined&quot; or &quot;null&quot; is returned accordingly.</li>
	 * <li>If the object belongs an internal JavaScript class, the associated name is returned.</li>
	 * <li>If the object has an array-like struct, &quot;array&quot; is returned.</li>
	 * <li>Everything else returns &quot;object&quot;.</li>
	 * </ul>
	 *
	 * @example
	 * ll.type(true); // boolean
	 * ll.type(4); // number
	 * ll.type("test"); // string
	 * ll.type(/test/); // regexp
	 * ll.type([ 1, 2 ]); // array
	 * ll.type(function () {}); // function
	 * ll.type(new Date); // date
	 * ll.type(null); // null
	 * ll.type(window); // window
	 * ll.type(document.body); // node
	 * ll.type(document.childNodes); // array
	 * ll.type(arguments); // array
	 * ll.type({}); // object
	 * ll.type(new function () {}); // object
	 *
	 * @methodOf ll
	 * @name type
	 * @param {mixed} obj A object to be inspected.
	 * @returns {String} The type string.
	 * @link <a href="http://d.hatena.ne.jp/uupaa/20091006">original by uupaa</a>
	 */
	function lltype(obj) {
		var t = typeof obj;
		return lltype_values[t] || (t = lltype_values[_Object_toString.call(obj)]) ? t :
			!obj           ? "null" :
			obj.setTimeout ? "window" :
			obj.nodeType   ? "node" :
			"length" in obj && typeof (t = obj.length) === "number" && (!t || t - 1 in obj) ? "array" : "object";
	}

	// Table to convert to type-value from the type-result
	var lltype_values = {
		"undefined":         1,
		"boolean":           1,
		"number":            1,
		"string":            1,
		"[object Boolean]":  "boolean",
		"[object Number]":   "number",
		"[object String]":   "string",
		"[object RegExp]":   "regexp",
		"[object Array]":    "array",
		"[object Function]": "function",
		"[object Date]":     "date"
	};

	/**
	 * Iterate over each element, execute the provided function once.
	 *
	 * @example
	 * ll.each([ 1, 2, 4, 8 ], function (n) { print(n * n); })
	 *   // 1, 4, 16, 64
	 * ll.each({ "one": 1, "two": 2 }, function (n, k) { print(k + ":" + n); });
	 *   // one:1, two:2
	 *
	 * @methodOf ll
	 * @name each
	 * @param {Array|Object} arr An array or object to iterate over.
	 * @param {Function} fn(value,index,collection) A function to execute for each element. If this returns false, stop the loop.
	 * @param {Object} target A object to use as this when executing a function.
	 * @returns {Boolean} Whether completed of the loop.
	 */
	function lleach(arr, fn, target) {
		var type = lltype(arr), i = 0;

		// Loop for array
		if (type === "array") {
			for (var iz = arr.length; i < iz; ++i) {
				// If there is no element
				if (i in arr && fn.call(target, arr[i], i, arr) === false) {
					return false;
				}
			}
		}
		// Loop for object
		else {
			for (i in arr) {
				// Don't get the value of a prototype extension
				if (arr.hasOwnProperty(i) && fn.call(target, arr[i], i, arr) === false) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Extend contents of arguments, put together into the first object.
	 *
	 * @example
	 * ll.extend({ 1: "ichi", 2: "nii" }, { 1: "one", 3: "three" });
	 *   // { 1: "one", 2: "nii", 3: "three" }
	 *
	 * @methodOf ll
	 * @name extend
	 * @param {Object} src A first object to extend, altered.
	 * @param {Object} Subsequent objects to extend into the first, unaltered.
	 * @returns {Object} The altered first object. (first argument)
	 */
	function llextend(src) {
		// Undefined and null don't have a property
		// Replace an empty object
		if (src == null) {
			src = {};
		}

		// Extend the contents of arguments
		for (var args = arguments, i = 1, iz = args.length; i < iz; ++i) {
			var dst = args[i];
			// Extend into the first objects
			if (dst != null) {
				for (var j in dst) {
					src[j] = dst[j];
				}
			}
		}

		return src;
	}


	// -----------------------------------------------------------------------------
	// Private Functions

	/**
	 * Make a lowercase method name given a prefix. (ex. this.'onevent')
	 *
	 * @example
	 * makeMethodNameLower('on', 'testName'); // ontestname
	 * makeMethodNameLower('on', '_testName'); // _ontestname
	 *
	 * @private
	 * @param {String} prefix A prefix string.
	 * @param {String} name A property name string.
	 * @returns {String} The method name string.
	 */
	function makeMethodNameLower(prefix, name) {
		name += ''; //< to string

		var key = prefix + '|' + name;
		return make_method_name_lowercase_cache[key] //< use a cache
		    // Shift a top underscore
			|| (make_method_name_lowercase_cache[key] = name.replace(/^(_*)/, '$1' + prefix).toLowerCase());
	}
	// Converted string cache
	var make_method_name_lowercase_cache = {};


	/**
	 * Make a method name given a prefix. (ex. this.'getName')
	 *
	 * @example
	 * makeMethodName('get', 'test'); // getTest
	 * makeMethodName('get', '_test'); // _getTest
	 *
	 * @private
	 * @param {String} prefix A prefix string.
	 * @param {String} name A property name string.
	 * @returns {String} The method name string.
	 */
	function makeMethodName(prefix, name) {
		name += ''; //< to string

		var key = prefix + '|' + name;
		return make_method_name_cache[key] //< use a cache
		    // Shift a top underscore
			|| (make_method_name_cache[key] = name.replace(/^(_*)(.|$)/, function ($0, $1, $2) {
				return $1 + $2.toUpperCase();
			}));
	}
	// Converted string cache
	var make_method_name_cache = {};


	// -----------------------------------------------------------------------------	

	/**
	 * This class provides a feature of handlers management.
	 * This should be used to inherit prototype.
	 *
	 * @example
	 * Cls = function () {};
	 * Cls.prototype = new ll.Event;
	 * obj = new Cls;
	 * sum = 0;
	 * function f() { ++sum; }
	 * obj.attach('func', f);
	 * obj.onfunc(); // sum = 1
	 * obj.call('func'); // sum = 2
	 * obj.detach('func', f);
	 *
	 * @class
	 *   A base class for managing handlers.
	 * @memberOf ll
	 * @name Event
	 */
	function llEvent() {}

	llextend(llEvent, /** @lends ll.Event */ {
		/**
		 * Create a function to be able to manage handlers.
		 *
		 * @example
		 * f = ll.Event.createHandle();
		 * f.attach(function () { alert(1); });
		 * f.attach(function () { alert(2); });
		 * f(); // alert(1); alert(2);
		 *
		 * @returns {Function} The handle function.
		 */
		createHandle: function createHandle() {
			// Executes contained handlers.
			// @example
			// evt.attach('func', function (a) { alert('this: ' + this + ', arg:' + a); });
			// evt.onfunc(1); // alert('this: [object ll.Event], arg: 1')
			// evt.onfunc.call(null, 2); // alert('this: window, arg: 2')
			function llcall() {
				var q = llcall._llqueue;

				// Execute handlers
				for (var i = 0, iz = q.length; i < iz; ++i) {
					// If a handler returns false, remove the handler
					if (q[i].apply(this, arguments) === false) {
						q.splice(i--, 1), --iz;
					}
				}
			}
			// The queue of handlers
			llcall._llqueue = [];

			return llEvent.extendHandler(llcall, llcall._llqueue);
		},
		/**
		 * Create a function to be able to manage filters.
		 *
		 * @example
		 * f = llEvent.createFilter();
		 * f.attach(function (v) { return v + 1; });
		 * f.attach(function (v) { return v + 2; });
		 * f(1); // 4
		 *
		 * @memberOf ll.Event
		 * @name createFilter
		 * @returns {Function} The handle function.
		 */
		createFilter: function createFilter() {
			// Executes contained filters.
			function llfliter() {
				var q = llfliter._llqueue, args = _Array_slice.call(arguments);

				// Execute filters
				for (var i = 0, iz = q.length; i < iz; ++i) {
					args[0] = q[i].apply(this, args);
				}

				return args[0];
			}
			// The queue of filters
			llfliter._llqueue = [];

			return llEvent.extendHandler(llfliter, llfliter._llqueue);
		},
		/**
		 * Extend a function to be able to manage callbacks.
		 *
		 * @example
		 * function fn() {}
		 * queue = [];
		 * llEvent.extendHandler(fn, queue);
		 * fn.attach; // function attach method
		 * fn.detach; // function detach method
		 *
		 * @memberOf ll.Event
		 * @name extendHandler
		 * @param {Function} handler A handler is extended features.
		 * @param {Array} queue A queue of a handler.
		 * @returns {Function} An extended handler.
		 */
		extendHandler: function extendHandler(handler, queue) {
			// Attach a handler to the function.
			// @example
			// evt.onfunc.attach(function () { .. });
			// @param {Function} fn A function to execute each time the handle is triggered.
			handler.attach = function attach(fn) {
				if (lltype(fn) !== 'function') {
					throw new _TypeError('first argument type should be function.');
				}
				// Add a function to the queue
				var q = queue;
				q[q.length] = fn; //< faster push for IE
			};
			// Remove a previously-attached handler from the function.
			// @example
			// function f() {}
			// evt.onfunc.attach(f);
			// evt.onfunc.detach(f);
			// @param {Function} [fn] A function that is to be no longer executed.
			// @returns {Boolean} Whether succeeded of removal.
			handler.detach = function detach(fn) {
				// Remove the function from the queue
				var q = queue;
				for (var i = 0, iz = q.length; i < iz; ++i) {
					// Remove the function found first
					if (fn === q[i]) {
						q.splice(i, 1); //< remove from the queue
						return true;
					}
				}
				return false;
			};
			return handler;
		}
	});

	llextend(llEvent.prototype, /** @lends ll.Event# */ {
		/**
		 * Attach a handler on the name to a function.
		 *
		 * @example
		 * evt = new ll.Event;
		 * sum = 1;
		 * evt.attach('func', function (a) { sum += (10 * a); });
		 * evt.attach('func', function (a) { sum += (20 * a); });
		 * evt.onfunc(3); // sum = 91
		 *
		 * @param {String} name A name to attach.
		 * @param {Function} fn A function to execute each time the handle is triggered. If this returns false, remove itself.
		 * @returns {ll.Event} The object itself.
		 */
		attach: function attach(name, fn) {
			var that = this;

			name = makeMethodNameLower('on', name); //< to string

			// There is no handle
			if (!that[name] || lltype(that[name].attach) !== 'function') {
				that[name] = llEvent.createHandle();
			}
			// Attach a handler
			that[name].attach(fn);

			// Return for method chain
			return that;
		},
		/**
		 * Remove a previously-attached handler from the function.
		 *
		 * @example
		 * function f() {}
		 * evt.detach('func', f); // false
		 * evt.attach('func', f);
		 * evt.detach('func', f); // true
		 *
		 * @param {String} name A name to detach.
		 * @param {Function} [fn] A function that is to be no longer executed.
		 * @returns {Boolean} Whether succeeded of removal.
		 */
		detach: function detach(name, fn) {
			var that = this;

			name = makeMethodNameLower('on', name); //< to string

			// Handle not found
			if (!that[name]) {
				return true;
			}

			var f = that[name];

			// There is no handle
			if (lltype(f.detach) !== 'function') {
				throw new _TypeError('the handle function has no detach method.');
			}

			// Remove all handlers
			if (!fn) {
				f._llqueue = [];
				return true;
			}
			// Remove the handler
			return f.detach(fn);
		},
		/**
		 * Execute all handlers attached for the name with arguments.
		 *
		 * @example
		 * evt.call('func', 1, 2, 3); // evt.onfunc(1, 2, 3);
		 *
		 * @param {String} name A name to execute.
		 */
		call: function call(name) {
			var that = this;

			name = makeMethodNameLower('on', name); //< to string

			var fn = that[name];
			if (!fn) {
				return void 0;
			}
			if (lltype(fn) !== 'function') {
				throw new _TypeError('the handle function is not found.');
			}
			return fn.apply(that, _Array_slice.call(arguments, 1));
		}
	});


	// -----------------------------------------------------------------------------	

	/**
	 * This class provides a feature of a property's observer.
	 * This should be used to inherit prototype.
	 *
	 * @example
	 * kvo1 = new ll.KVObject;
	 * kvo1.attach('changed', function (value, name) { alert('update: ' + name); });
	 * kvo1.attach('changedProp', function (value, name) { alert('update: ' + this[name]); });
	 * kvo1.set('prop', 1); // alert('update: 1'), alert('update: prop')
	 * kvo1.get('prop'); kvo1.getProp(); kvo1.prop; // 1
	 * kvo2 = new ll.KVObject;
	 * kvo2.attach('changedProp', function (value) { alert('update2: ' + value); });
	 * kvo1.bindTo('prop', kvo2); // alert('update2: 1')
	 * kvo1.set('prop', 2); kvo2.set('prop', 2);
	 * // alert('update: 1'), alert('update: prop'), alert('update2: 1')
	 *
	 * @class
	 *   A base class for a observer of a property.
	 * @augments ll.Event
	 * @memberOf ll
	 * @name KVObject
	 */
	function llKVObject() {
		/**
		 * Rule set of binding.
		 * @private
		 * @fieldOf ll.KVObject#
		 * @name _bindings
		 * @type Object[]
		 */
	}

	llKVObject.prototype = new llEvent;

	/**
	 * Notify all observers on the name. (entity)
	 *
	 * @private
	 * @param {ll.KVObject} kvo A object to notify.
	 * @param {String|Number} name A property name to notify.
	 */
	function llKVObject_notify(kvo, name) {
		// Execute change events
		// this.onpropertychange(name);
		kvo.call(name + 'change', name);
		// this.onchange(name);
		kvo.call('change', name);
		// this._onnotify();
		kvo.call('_notify' + name);
	}

	llextend(llKVObject.prototype, /** @lends ll.KVObject# */ {
		/**
		 * Get a property value.
		 *
		 * @example
		 * kvo.get('key') == kvo.key OR kvo.getKey()
		 *
		 * @param {String|Number} name A property name.
		 * @returns {mixed} The property value.
		 */
		get: function get(name) {
			var that = this;

			// Exists bindings
			var b = that._llbindings;
			if (b && (b = b[name])) {
				return b.kvo.get(b.label);
			}

			// Base object
			// Make method name (ex. this.getProperty)
			var methodName = makeMethodName('get', name);

			return that[methodName] && lltype(that[methodName]) === 'function'
				? that[methodName]() //< use getter function
				: that[name];        //< use getter property
		},
		/**
		 * Set the property value with the name.
		 *
		 * @example
		 * kvo.set('key', 'value') // ~= kvo.key = 'value' OR kvo.setKey('value')
		 *
		 * @param {String|Number} name A property name.
		 * @param {mixed} value A property value.
		 */
		set: function set(name, value) {
			var that = this;

			// Exists bindings
			var b = that._llbindings;
			if (b && (b = b[name])) {
				return b.kvo.set(b.label, value);
			}

			// Base object
			// Make method name (ex. this.setProperty)
			var methodName = makeMethodName('set', name);

			that[methodName] && lltype(that[methodName]) === 'function'
				? that[methodName](value) //< use setter function
				: (that[name] = value);   //< use setter property

			// All binding Notify
			llKVObject_notify(that, name);
			return void 0;
		},
		/**
		 * Notify all observers on the name.
		 *
		 * @example
		 * kvo1.set('key', 'value');
		 * kvo1.bindTo('key', kvo2); // kvo2.key = undefined
		 * kvo1.notify('key'); // kvo2.key = 'value'
		 *
		 * @param {String|Number} name A property name.
		 */
		notify: function notify(name) {
			var that = this;

			// Exists bindings
			var b = that._llbindings;
			if (b && (b = b[name])) {
				return b.kvo.notify(b.label);
			}

			// All binding Notify
			llKVObject_notify(that, name);
			return void 0;
		},
		/**
		 * Binds this object to the object.
		 *
		 * @example
		 * kvo1.bindTo('key', kvo2); // kvo2.key = undefined
		 * kvo1.set('key', 'value'); // kvo2.key = 'value'
		 *
		 * @param {String|Number} name A property name.
		 * @param {Object} kvo A object to be binded.
		 * @param {String|Number} [kvoName] A property name of a binded object.
		 * @param {Boolean} [stopNotify] A flag of no notification.
		 */
		bindTo: function bindTo(name, kvo, kvoName, stopNotify) {
			var that = this;

			// Type checking and casting arguments
			kvoName = kvoName || name;
			if (!(kvo instanceof llKVObject)) {
				throw new _TypeError('second argument type should be [object ll.'+'KVObject].');
			}

			// Initialize bindings infomation
			that.unbind(name);

			// Binds the object with the name
			var b = that._llbindings = that._llbindings || {
				// name: { kvo: [ll.KVObject], label: '..', notify: function () {} },
			};
			b[name] = {
				kvo: kvo, label: kvoName
			};

			// Set a new binding
			kvo.attach('_notify' + kvoName, b[name].notify = function notify() {
				llKVObject_notify(that, name);
			});

			stopNotify || that.notify(name);
		},
		/**
		 * Remove a binding.
		 *
		 * @example
		 * kvo1.bindTo('key', kvo2); // kvo2.key = undefined
		 * kvo1.set('key', 'value1'); // kvo2.key = 'value1'
		 * kvo1.unbind('key', kvo2);
		 * kvo1.set('key', 'value2'); // kvo2.key = 'value1'
		 *
		 * @param {String|Number} name A property name.
		 */
		unbind: function unbind(name) {
			var that = this;

			// Exists bindings
			var b = that._llbindings, bn;
			if (b) {
				// Remove all bindings
				if (name == null) {
					for (var i in b) {
						that.unbind(i);
					}
				}
				// Remove a binding
				else if ((bn = b[name])) {
					delete b[name];
					bn.kvo.detach('_notify' + bn.label, bn.notify);
					that.set(name, bn.kvo.get(bn.label));
				}
			}
		}
	});


	// -----------------------------------------------------------------------------

	/**
	 * This class provides a feature to despatch of URL.
	 * This should be used to inherit prototype.
	 *
	 * @example
	 * dsp = new ll.Dispatch;
	 * dsp.update('?param=1');
	 * dsp.match({ search: { param: 1 } }, function () { alert('one') })
	 *    .match({ search: { param: 2 } }, function () { alert('two') });
	 * dsp.call(); // alert('one');
	 * dsp.update('?param=2');
	 * dsp.call(); // alert('two');
	 *
	 * @class
	 *   Provide a feature to despatch of URL.
	 * @memberOf ll
	 * @name Dispatch
	 */
	function llDispatch() {}

	/**
	 * Regular expression for parsing the URL rough.
	 *
	 * @fieldOf ll.Dispatch
	 * @name parseUrl
	 * @type RegExp
	 */
	llDispatch.parseUrl = /^(\w*:\/\/)?(?:([^\/:@]+)?:([^\/:@]+)?@)?([\w\._-]+)?(?::(\d*))?(\/[^\?#]*)?(\?[^#]*)?(#.*)?$/;
                          //`protocol'    `username'  `password'    `hostname-'     `port' `pathname-' `search-' `hash'

	/**
	 * Evaluate the condition.
	 * Usually called internally.
	 *
	 * @private
	 * @param {mixed} expr A condition.
	 * @param {String} val A URL data of target.
	 * @param {Object} loc A URL data.
	 * @returns {Boolean} The result of a condition.
	 */
	function llDispatch_test(expr, val, loc) {
		switch (lltype(expr)) {
		case 'boolean':
			return expr;
		case 'number':
		case 'string':
			return ('' + val) === ('' + expr);
		case 'regexp':
			return expr.test(val);
		case 'function':
			return !!expr.call(loc, val);
		default:
			return null;
		}
	}

	/**
	 * Check the URL dispatcher in the specified rule.
	 *
	 * @private
	 * @param {Object} loc A URL data.
	 * @param {Object} params A parsed parameters data.
	 * @param {String} defaultName A default key in a URL data.
	 * @param {mixed} rules Conditions in URL for running.
	 * @returns {Boolean} Whether to run in this rule.
	 */
	function llDispatch_check(loc, params, defaultName, rules) {
		var flag = true;

		// If you use an object, to target the pathname
		if (lltype(rules) !== 'object') {
			flag = llDispatch_test(rules, loc[defaultName], loc);
		}
		else {
			for (var name in rules) {
				// Missing keys are disabled
				if (!(name in loc)) {
					flag = false;
					break;
				}
				// Evaluate if the expression type isn't a object
				if (lltype(rules[name]) !== 'object') {
					if (!llDispatch_test(rules[name], loc[name], loc)) {
						flag = false;
						break;
					}
				}
				// Exceptional handling
				else {
					if (!params[name]) {
						params[name] = {};
						var search = loc[name].replace(/^\W+/, ''), reg = /([^&=]+)(?:=([^&]*))?/g, m;
						while ((m = reg.exec(search))) {
							params[name][m[1]] = m[2];
						}
					}
					var param = params[name];
					for (var key in rules[name]) {
						if (!llDispatch_test(rules[name][key], param[key], param)) {
							flag = false;
							break;
						}
					}
					if (!flag) {
						break;
					}
				}
			}
		}

		return flag;
	}


	llextend(llDispatch.prototype, /** @lends ll.Dispatch# */ {
		/**
		 * Update the URL data.
		 *
		 * @example
		 * dsp.update('#test'); // { hash: '#test' }
		 *
		 * @param {Object|String} loc A based URL data.
		 */
		update: function (loc, name) {
			var that = this;
			if (loc != null) {
				/**
				 * The based default URL data.
				 * @private
				 * @fieldOf ll.Dispatch#
				 * @name _defaultLocation
				 * @type Object
				 */
				that._defaultLocation = loc;
			}
			/**
			 * The based default URL name.
			 * @private
			 * @fieldOf ll.Dispatch#
			 * @name _defaultName
			 * @type String
			 */
			that._defaultName = name || that._defaultName || 'href';
		},
		/**
		 * Set the function to be executed conditionally.
		 *
		 * @example
		 * dsp = new ll.Dispatch;
		 * dsp.match({ hash: /^#search/ }, function () {})
		 *    .match('/page', function () {}) ..
		 *
		 * @param {mixed} rules Conditions in URL for running.
		 * @param {Function} fn A function to be executed. If this returns false, stop the dispatcher.
		 * @returns {ll.Dispatch} The object itself.
		 */
		match: function match(rules, fn) {
			var that = this;
			/**
			 * Rule set of URL.
			 * @private
			 * @fieldOf ll.Dispatch#
			 * @name _stash
			 * @type Object[]
			 */
			(that._stash = that._stash || [
				// { rule: [mixed], callback: function () {} },
			]).push({ rule: rules, callback: fn });
			return that;
		},
		/**
		 * Execute the URL dispatcher in all rules.
		 *
		 * @example
		 * dsp = new ll.Dispatch;
		 * dsp.match(..) ..
		 * dsp.call();
		 *
		 * @return {Boolean} Whether run more than once.
		 */
		call: function call() {
			var that = this;
			return that.run(that._defaultLocation, arguments);
		},
		/**
		 * Run the URL dispatcher in all rules.
		 *
		 * @example
		 * dsp = new ll.Dispatch;
		 * dsp.match(..) ..
		 * dsp.run('url string', [ 'args' ]);
		 *
		 * @param {Object} loc A URL data.
		 * @param {Array} args Arguments passed to the function.
		 * @param {ll.Dispatch} target A object to use as this when executing a function.
		 * @return {Boolean} Whether run more than once.
		 */
		run: function run(loc, args, target) {
			var that = this;
			var flag = false;

			if (loc && that._stash) {
				var defaultName = that._defaultName, m;

				// If location type is string, parse and convert object
				if (lltype(loc) === 'string') {
					var tmp = loc;
					loc = {};
					loc[defaultName] = tmp;
				}
				if (!('pathname' in loc)) {
					m = llDispatch.parseUrl.exec(loc[defaultName] || '');
				}

				if (m) {
					llextend(loc, {
						protocol: m[1] || '',
						hostname: m[4] || '',
						port:     m[5] || '',
						pathname: m[6] || '',
						search:   m[7] || '',
						hash:     m[8] || ''
					});
				}
				else {
					loc = llextend({}, loc);
				}

				// Set a default name.
				for (var name in { pathname: 1, search: 1, hash: 1 }) {
					if (loc[name]) {
						defaultName = name;
						break;
					}
				}

				target = target || loc;
				args = args || [];

				// Set parameters of a query in URL
				var paramsCache = {};

				// Run the URL dispacher.
				for (var i = 0, iz = that._stash.length; i < iz; ++i) {
					var t = that._stash[i];

					if (llDispatch_check(loc, paramsCache, defaultName, t.rule)) {
						flag = true;
						if (t.callback.apply(target, args) === false) {
							break;
						}
					}
				}
			}

			return flag;
		}
	});

	// Use default location object
	if (typeof location === 'object') {
		/**
		 * Default URL dispatcher (use the location).
		 * @type ll.Dispatch
		 * @memberOf ll
		 * @name dispatch
		 */
		ll.dispatch = new llDispatch;
		ll.dispatch.update(location);
	}


	// -----------------------------------------------------------------------------

	/**
	 * This class provides a feature of an asynchronous processing.
	 * This should be used to inherit prototype.
	 *
	 * @example
	 * ll.Deferred.then(function () { delay run; })
	 *            .lose(function (e) { catch error; });
	 *
	 * @class
	 *   Provide a feature of an asynchronous processing.
	 * @memberOf ll
	 * @name Deferred
	 */
	function llDeferred() {
		/**
		 * The type of this object after executed.
		 * @private
		 * @fieldOf ll.Deferred#
		 * @name _type
		 * @type string
		 */
		/**
		 * Arguments of this object after executed.
		 * @private
		 * @fieldOf ll.Deferred#
		 * @name _args
		 * @type Array
		 */
		/**
		 * Chained a deferred object.
		 * @private
		 * @fieldOf ll.Deferred#
		 * @name _dfr
		 * @type ll.Deferred
		 */
		/**
		 * A deferred function.
		 * @private
		 * @fieldOf ll.Deferred#
		 * @name _ok
		 * @type mixed
		 */
		/**
		 * A deferred function to catch a error.
		 * @private
		 * @fieldOf ll.Deferred#
		 * @name _ng
		 * @type mixed
		 */
	}

	/**
	 * Execute the function after the elapsed time.
	 *
	 * @example
	 * ll.Deferred.delay(function () { alert('delay 1sec'); }, 1);
	 *
	 * @methodOf ll.Deferred
	 * @name delay
	 * @param {Function} fn A function to call delayed.
	 * @param {Number} sec A delay time.
	 * @returns {Function} The function to cancel.
	 */
	llDeferred.delay = function delay(fn, sec) {
		var tid = setTimeout(fn, sec * 1000);
		return function cancel() {
			clearTimeout(tid);
		};
	};

	var hasWindow = typeof window === 'object', doc, head;

	/**
	 * Provide a faster deferred execution.
	 *
	 * @example
	 * ll.Deferred.nextTick(function () { alert('delay call'); });
	 *
	 * @methodOf ll.Deferred
	 * @name nextTick
	 * @param {Function} fn A function to call delayed.
	 * @returns {Function} The function to cancel.
	 */
	llDeferred.nextTick =
		// for cr, fx, ie (op doesn't work)
		hasWindow && !window.opera
	    && (doc = _document)
	    && (head = doc.head
	        || doc.getElementsByTagName('head')[0]
	        || doc.documentElement) ? function nextTickScript(fn) {
				var script = doc.createElement('script'), loaded = false;
				script.async = 'async';
				script.src = 'data:text/javascript,';
				script.onload = script.onerror = script.onreadystatechange = function handler() {
					if (!loaded) {
						cancel();
						fn();
					}
				};
				function cancel() {
					loaded = true;
					script.onload = script.onerror = script.onreadystatechange = null;
					head.removeChild(script);
				}
				head.insertBefore(script, head.firstChild);
				return cancel;
			} :
	// for op
	hasWindow && window.addEventListener ? function nextTickImage(fn) {
		var img = new Image;
		img.addEventListener('load', handler, false);
		img.addEventListener('error', handler, false);
		function handler() {
			cancel();
			fn();
		}
		function cancel() {
			img.removeEventListener('load', handler, false);
			img.removeEventListener('error', handler, false);
		}
		img.src = 'data:image/png,' + Math.random();
		return cancel;
	} :
	// for node.js
	typeof process === 'object' && typeof process.nextTick === 'function' ? function nextTickProcess(fn) {
		process.nextTick(fn);
		// non-canceler
	} :
	// not support (use ll.Deferred.delay)
	null;

	llextend(llDeferred.prototype, /** @lends ll.Deferred# */ {
		/**
		 * Invokes a function of the object itself.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr.then(function (v) { alert('ok: ' + v); })
		 *    .lose(function (v) { alert('ng: ' + v); });
		 * dfr.call(0); // alert('ok: 0')
		 *
		 * @returns {ll.Deferred} The deferred object itself.
		 */
		call: function call() {
			return this._run('_ok', arguments);
		},
		/**
		 * Invokes a function to catch a error of the object itself.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr.then(function (v) { alert('ok: ' + v); })
		 *    .lose(function (v) { alert('ng: ' + v); });
		 * dfr.fail(1); // alert('ng: 1')
		 *
		 * @returns {ll.Deferred} The deferred object itself.
		 */
		fail: function fail() {
			return this._run('_ng', arguments);
		},
		/**
		 * Execute a function and call a chained deferred object if this deferred object has a chained deferred object.
		 *
		 * @param {String} A type name of a function (_ok OR _ng).
		 * @param {Array} [args] Arguments passed to the function.
		 * @param {Function} [comp] A function to call once the execution is complete.
		 * @returns {ll.Deferred} The deferred object itself.
		 */
		_run: function _run(type, args, comp) {
			var that = this;

			var nextType = type, nextArgs = args || [];

			// Has a data.
			if (type in that) {
				var rv = that[type];
				// Run a function
				if (lltype(rv) === 'function') {
					try {
						rv = rv.apply(that, nextArgs);
						nextType = '_ok';
					} catch (e) {
						rv = e;
						nextType = '_ng';
						llDeferred.onerror && llDeferred.onerror(e);
					}
				}
				// Chain a deferred object.
				if (rv instanceof llDeferred) {
					rv._dfr = that._dfr;
					if (!comp || comp(rv)) {
						rv._next(comp);
					}
					return that;
				}
				// Update arguments.
				nextArgs = [ rv ];
			}

			that._type = nextType;
			that._args = nextArgs;
			if (!comp || comp(that)) {
				that._next(comp);
			}
			return that;
		},
		/**
		 * Invokes a function of the chained object.
		 */
		_next: function _next(comp) {
			var that = this;
			that._type && that._dfr
		        && that._dfr._run(that._type, that._args, comp);
		},
		/**
		 * Create a new deferred object and set a function.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr.then(function () { alert('next'); });
		 * dfr.call(); // alert('next');
		 *
		 * @param {Function|ll.Deferred|mixed} fn(lastValue) A function to be deferred and executed.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		then: function then(fn) {
			return this._set('_ok', fn);
		},
		/**
		 * Create a new deferred object and set a function to catch a error.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr.then(function () { throw new Error; });
		 *    .lose(function () { alert('error'); });
		 * dfr.call(); // alert('error');
		 *
		 * @param {Function|ll.Deferred|mixed} fn(lastValue) A function to catch a error in a deferred object.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		lose: function lose(fn) {
			return this._set('_ng', fn);
		},
		/**
		 * Create a new deferred object and sets the function.
		 *
		 * @param {String} type A type name of a function (_ok OR _ng).
		 * @param {Function|ll.Deferred|mixed} fn(lastValue) A function to regist.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		_set: function _set(type, fn) {
			var that = this;

			var dfr = new llDeferred;
			dfr[type] = fn;
			that._dfr = dfr;
			that._next();
			return dfr;
		},
		/**
		 * Set a delay seconds to execute.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr.then(function () { alert('start'); });
		 *    .wait(5)
		 *    .then(function () { alert('delay 5sec'); });
		 * dfr.call();
		 *
		 * @param {Number} sec A delay time.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		wait: function wait(sec) {
			return this.then(function () {
				return llDeferred.wait(sec);
			});
		},
		/**
		 * Bind to one deferred object of several deferred objects.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr1 = new ll.Deferred;
		 * dfr2 = new ll.Deferred;
		 * dfr.when({
		 *   foo: function () { return 1; },
		 *   bar: dfr1
		 * }).then(function (rv) {
		 *   console.log(rv); // foo: 1, bar: 2
		 * }).when([
		 *   function () { return 'one'; },
		 *   dfr2
		 * ]).then(function (rv) {
		 *   console.log(rv); // 'one', 'two';
		 * });
		 * dfr.call();
		 * dfr1.call(2);
		 * dfr2.call('two');
		 *
		 * @param {Object|Array} obj A list of deferred objects.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		when: function when(obj) {
			return this.then(function () {
				var dfr = new llDeferred, res = lltype(obj) === 'array' ? [] : {}, cnt = 1;

				// All each elements run
				lleach(obj, function (v, k) {
					++cnt;
					if (lltype(v) === 'function') {
						v = llDeferred.then(v);
					}
					if (v instanceof llDeferred) {
						v.then(function (v) {
							res[k] = v;
							!--cnt && dfr.call(res);
						}).lose(function (e) {
							dfr._run('_ng', [ e ], function (nowDfr) {
								if (nowDfr._type === '_ng') {
									return true;
								}
								!--cnt && dfr.call(res);
								return false;
							});
						});
					}
					else {
						// If the value is not deferred object, set the value directly
						res[k] = v;
						!--cnt && dfr.call(res);
					}
				});
				// If argument object is empty, invoke a chain deferred object
				!--cnt && dfr.call(res);

				return dfr;
			});
		},
		/**
		 * Browser-non-blocking 'each' method.
		 * Apply a function to each element.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr.each([ 1,2,3 ], function (v) { very heavy task; print(v); }); // 1,2,3
		 * dfr.call();
		 *
		 * @param {Array} arr An array to iterate over.
		 * @param {Function} fn(value,index,collection) A function to execute for each element. If this returns false, stop the loop.
		 * @param {Number|Object} [opt] An execution time or options of this method.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		each: function each(arr, fn, opt) {
			return this._for(lltype(opt) === 'number' ? { time: opt } : opt, arr, fn);
		},
		/**
		 * Browser-non-blocking 'loop' method.
		 * Execute a function times of specified number.
		 *
		 * @example
		 * dfr = new ll.Deferred;
		 * dfr.loop(3, function (v) { very heavy task; print(v); }); // 1,2,3
		 * dfr.call();
		 *
		 * @param {Number|Object} opt A loop count or options of this method.
		 * @param {Function} fn(index) A function to execute in a loop count. If this returns false, stop the loop.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		loop: function loop(opt, fn) {
			return this._for(lltype(opt) === 'number' ? { end: opt } : opt, null, fn);
		},
		/**
		 * The loop is executed delayed.
		 *
		 * @private
 		 * @param {Object} opt Options of this method.
		 * @param {Number} [opt.start=0] A value of a loop counter beginning.
		 * @param {Number} [opt.end=arr.length] A value of a loop counter finishing.
		 * @param {Number} [opt.step=1] A value of a loop step.
		 * @param {Number} [opt.time=0] A value of a delay time.
		 * @param {Array} arr An array to iterate over.
		 * @param {Function} fn A function to execute for each element. If this returns false, stop the loop.
		 * @returns {ll.Deferred} The new deferred object.
		 */
		_for: function _for(opt, arr, fn) {
			opt = llextend(null, opt);

			// Casting arguments
			var	start = +opt.start || 0, end = +opt.end, step = +opt.step || 1, time = +opt.time || 0;
			// Setting of loop count
			// Loop of array
			if (arr) {
				var len = arr.length;
				if (!_isFinite(end) || end > len) {
					end = len;
				}
				else if (end < 0) {
					end = 0;
				}
				if (start >= len) {
					start = len - 1;
				}
				else if (start < 0) {
					start = 0;
				}
			}
			// Loop of counter
			else {
				if (!_isFinite(end)) {
					throw new _TypeError('options.end type should be number.');
				}
			}
			// Don't loop
			if (start === end) {
				return this;
			}
			// Set step of loop
			if ((0 < step) !== (start < end)) {
				step = -step;
			}

			return this.then(function () {
				var dfr = new llDeferred, i = start, nextTick = llDeferred.nextTick || llDeferred.delay, stopFail = function (nowDfr) { return nowDfr._type === '_ng'; };

				// Start loop
				dfr.cancel = nextTick(function loop() {
					var startTime = time ? new _Date : null;

					do {
						// Call of each
						if (!arr || i in arr) {
							try {
								if ((arr ? fn.call(dfr, arr[i], i, arr) : fn.call(dfr, i)) === false) {
									dfr._run('_ng', null, stopFail).call();
									return;
								}
							} catch (e) {
								dfr._run('_ng', [ e ], stopFail).call();
								return;
							}
						}
						i += step;
						// End of loop
						if (start < end ? i >= end : i < end) {
							dfr.call();
							return;
						}
					} while (time && (new _Date - startTime < time));

					dfr.cancel = nextTick(loop);
				});

				return dfr;
			});
		}
	});

	// Create generic method

	/**
	 * Set a delay seconds to execute and execute automatically.
	 *
	 * @example
	 * ll.Deferred.wait(1)
	 *            .then(function (ms) { alert('990 ~ ' + ms + '~1100'); });
	 *
	 * @function
	 * @memberOf ll.Deferred
	 * @name wait
	 * @param {Number} sec A delay time.
	 * @returns {ll.Deferred} The new deferred object.
	 */
	llDeferred.wait = function wait(sec) {
		var dfr = new llDeferred, t = new _Date;
		dfr.cancel = (!sec && llDeferred.nextTick || llDeferred.delay)(function () {
			sec ? dfr.call(new _Date - t)
				: dfr.call();
		}, sec);
		return dfr;
	};

	/**
	 * Set a function and execute automatically.
	 *
	 * @example
	 * ll.Deferred.then(function () { alert('two'); })
	 *            .then(function () { alert('three'); });
	 * alert('one');
	 *
	 * @function
	 * @memberOf ll.Deferred
	 * @name then
	 * @param {Function|ll.Deferred|mixed} fn(lastValue) A function to be deferred and executed.
	 * @returns {ll.Deferred} The new deferred object.
	 */
	/**
	 * Bind to one deferred object and execute automatically.
	 *
	 * @example
	 * dfr1 = new ll.Deferred;
	 * dfr2 = new ll.Deferred;
	 * ll.Deferred.when({
	 *   foo: dfr1, bar: dfr2
	 * }).then(function (v) {
	 *   alert('1: ' + v.foo + ', 2: ' + v.bar);
	 * });
	 * dfr1.call('one');
	 * dfr2.call('two'); // alert('1: one, 2: two')
	 *
	 * @function
	 * @memberOf ll.Deferred
	 * @name when
	 * @augments ll.Deferred#when
	 */
	/**
	 * Execute 'each' method automatically.
	 *
	 * @example
	 * ll.Deferred.each([ 1,2,3 ], function (v) { very heavy task; print(v); }); // 1,2,3
	 *
	 * @function
	 * @memberOf ll.Deferred
	 * @name each
	 * @param {Array} arr An array to iterate over.
	 * @param {Function} fn(value,index,collection) A function to execute for each element. If this returns false, stop the loop.
	 * @param {Number|Object} [opt] An execution time or options of this method.
	 * @returns {ll.Deferred} The new deferred object.
	 */
	/**
	 * Execute 'loop' method automatically.
	 *
	 * @example
	 * ll.Deferred.loop(3, function (v) { very heavy task; print(v); }); // 1,2,3
	 *
	 * @function
	 * @memberOf ll.Deferred
	 * @name loop
	 * @param {Number|Object} opt A loop count or options of this method.
	 * @param {Function} fn(index) A function to execute in a loop count. If this returns false, stop the loop.
	 * @returns {ll.Deferred} The new deferred object.
	 */
	lleach([ 'then', 'when', 'each', 'loop' ], function (methodName) {
		llDeferred[methodName] = function () {
			return llDeferred.prototype[methodName].apply(llDeferred.wait(0), arguments);
		};
	});


	// -----------------------------------------------------------------------------

	if (typeof module === 'object') {
		module.exports = ll;
	}

	return ll;

}(this));
