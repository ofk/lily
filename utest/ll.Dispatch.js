
var empty = /(a)?/.exec('b')[1];

utest('ll.Dispatch.parseUrl', [
	// [ all, protocol, username, password, hostname, port, pathname, search, hash ]
	[ ll.Dispatch.parseUrl.exec(''), [ '', empty, empty, empty, empty, empty, empty, empty, empty ] ],
	[ ll.Dispatch.parseUrl.exec('protocol://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ 'protocol://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
	    'protocol://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],

	[ ll.Dispatch.parseUrl.exec('protocol://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value'),
	  [ 'protocol://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value',
	    'protocol://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', empty ] ],
	[ ll.Dispatch.parseUrl.exec('protocol://username:password@hostname.tld:80/pathname/dir/file.ext#hash'),
	  [ 'protocol://username:password@hostname.tld:80/pathname/dir/file.ext#hash',
	    'protocol://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', empty, '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('protocol://username:password@hostname.tld:80?search=query&key=value#hash'),
	  [ 'protocol://username:password@hostname.tld:80?search=query&key=value#hash',
	    'protocol://', 'username', 'password', 'hostname.tld', '80', empty, '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('protocol://username:password@hostname.tld/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ 'protocol://username:password@hostname.tld/pathname/dir/file.ext?search=query&key=value#hash',
	    'protocol://', 'username', 'password', 'hostname.tld', empty, '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('protocol://username:password@:80/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ 'protocol://username:password@:80/pathname/dir/file.ext?search=query&key=value#hash',
	    'protocol://', 'username', 'password', empty, '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('protocol://username:@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ 'protocol://username:@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
	    'protocol://', 'username', empty, 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('protocol://:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ 'protocol://:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
	    'protocol://', empty, 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ '://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
	    '://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],

	[ ll.Dispatch.parseUrl.exec('username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ 'username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
	    empty, 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ 'hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
	    empty, empty, empty, 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('/pathname/dir/file.ext?search=query&key=value#hash'),
	  [ '/pathname/dir/file.ext?search=query&key=value#hash',
	    empty, empty, empty, empty, empty, '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('?search=query&key=value#hash'),
	  [ '?search=query&key=value#hash',
	    empty, empty, empty, empty, empty, empty, '?search=query&key=value', '#hash' ] ],
	[ ll.Dispatch.parseUrl.exec('#hash'),
	  [ '#hash',
	    empty, empty, empty, empty, empty, empty, empty, '#hash' ] ]
]);

utest('ll.Dispatch', [
	function () {
		var p = [];
		var d = new ll.Dispatch;
		d.update('/abc');
		d.match(true, function () { p.push(1); })
		 .match(function (pathname) { return pathname === '/abc'; }, function () { p.push(2); })
		 .match('/abc', function () { p.push(3); })
		 .match(/^\/abc$/, function () { p.push(4); })
		 .call();
		return [[ p, [1,2,3,4] ]];
	},
	function () {
		var p = [];
		var d = new ll.Dispatch;
		d.update('/abc');
		d.match({ pathname: true }, function () { p.push(1); })
		 .match({ pathname: function (pathname) { return pathname === '/abc'; } }, function () { p.push(2); })
		 .match({ pathname: '/abc' }, function () { p.push(3); })
		 .match({ pathname: /^.abc$/ }, function () { p.push(4); })
		 .call();
		return [[ p, [1,2,3,4] ]];
	},
	function () {
		var p = [];
		var d = new ll.Dispatch; d.update('?test=abc');
		d.match({ search: { test: true } }, function () { p.push(1); })
		 .match({ search: { test: function (val) { return val === 'abc'; } }  }, function () { p.push(2); })
		 .match({ search: { test: 'abc' }  }, function () { p.push(3); })
		 .match({ search: { test: /^abc$/ }  }, function () { p.push(4); })
		 .call();
		return [[ p, [1,2,3,4] ]];
	},
	function () {
		var p = [];
		var d = new ll.Dispatch;
		d.update('/index.html?test=abc');
		d.match({ pathname: /index/, search: /test=/ }, function () { p.push(1); })
		 .call();
		return [[ p, [1] ]];
	}
]);
