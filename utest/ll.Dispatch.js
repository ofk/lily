utest('ll.Dispatch.parseUrl', function () {
	var empty = /(a)?/.exec('b')[1];
	function reg_test(res) {
		return [ ll.Dispatch.parseUrl.exec(res[0]), res ];
	}

	return [
		// [ all, protocol, username, password, hostname, port, pathname, search, hash ]
		reg_test([ '', empty, empty, empty, empty, empty, empty, empty, empty ]),

		reg_test([ 'protocol://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
				   'protocol://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ 'protocol://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value',
				   'protocol://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', empty ]),
		reg_test([ 'protocol://username:password@hostname.tld:80/pathname/dir/file.ext#hash',
				   'protocol://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', empty, '#hash' ]),
		reg_test([ 'protocol://username:password@hostname.tld:80?search=query&key=value#hash',
				   'protocol://', 'username', 'password', 'hostname.tld', '80', empty, '?search=query&key=value', '#hash' ]),
		reg_test([ 'protocol://username:password@hostname.tld/pathname/dir/file.ext?search=query&key=value#hash',
				   'protocol://', 'username', 'password', 'hostname.tld', empty, '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ 'protocol://username:password@:80/pathname/dir/file.ext?search=query&key=value#hash',
				   'protocol://', 'username', 'password', empty, '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ 'protocol://username:@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
				   'protocol://', 'username', empty, 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ 'protocol://:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
				   'protocol://', empty, 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ '://username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
				   '://', 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),

		reg_test([ 'username:password@hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
				   empty, 'username', 'password', 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ 'hostname.tld:80/pathname/dir/file.ext?search=query&key=value#hash',
				   empty, empty, empty, 'hostname.tld', '80', '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ '/pathname/dir/file.ext?search=query&key=value#hash',
				   empty, empty, empty, empty, empty, '/pathname/dir/file.ext', '?search=query&key=value', '#hash' ]),
		reg_test([ '?search=query&key=value#hash',
				   empty, empty, empty, empty, empty, empty, '?search=query&key=value', '#hash' ]),
		reg_test([ '#hash',
				   empty, empty, empty, empty, empty, empty, empty, '#hash' ])
	];
});

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
