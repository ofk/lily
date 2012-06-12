var kvo1 = new ll.KVObject,
    kvo2 = new ll.KVObject,
    kvo3 = new ll.KVObject;
// prop1: kvo1 -> kvo2 -> kvo3
kvo1.bindTo('prop1', kvo2);
kvo2.bindTo('prop1', kvo3);
// prop2: kvo1 -> kvo2 <- remove
//            `-> kvo3
kvo1.bindTo('prop2', kvo2);
kvo1.bindTo('prop2', kvo3);
// prop3: kvo1 <- kvo2
//            `<- kvo3
kvo2.bindTo('prop3', kvo1);
kvo3.bindTo('prop3', kvo1);
// prop4: kvo1.prop4a -> kvo2.prop4a -> kvo2.prop4b -> kvo1.prop4b
kvo1.bindTo('prop4a', kvo2);
kvo2.bindTo('prop4a', kvo2, 'prop4b');
kvo2.bindTo('prop4b', kvo1);

utest('ll.KVObject', [
	function () {
		return [[ kvo1.get('test1'), void 0 ]];
	},
	function () {
		kvo1.set('test2', 2);
		return [[ kvo1.get('test2'), 2 ]];
	},
	function () {
		kvo1.setTest3 = function (v) { this.test3test3test3 = v; };
		kvo1.getTest3 = function () { return this.test3test3test3; };
		kvo1.set('test3', 3);
		return [[ kvo1.get('test3'), 3 ]];
	},
	function () {
		var p1;
		kvo1.ontest4change = function (k) { p1 = k + '=' + this.get(k); };
		kvo1.set('test4', 4);
		return [[ kvo1.get('test4'), 4 ], [ p1, 'test4=4' ]];
	},
	function () {
		var p1;
		kvo1.onchange = function (k) { p1 = k + '=' + this.get(k); };
		kvo1.set('test5', 5);
		return [[ kvo1.get('test5'), 5 ], [ p1, 'test5=5' ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop1change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop1change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop1change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo1.set('prop1', 6);
		return [[ kvo1.get('prop1'), 6 ],
		        [ kvo2.get('prop1'), 6 ],
		        [ kvo3.get('prop1'), 6 ],
		        [ p, [ '3:prop1=6', '2:prop1=6', '1:prop1=6' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop1change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop1change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop1change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo2.set('prop1', 7);
		return [[ kvo1.get('prop1'), 7 ],
		        [ kvo2.get('prop1'), 7 ],
		        [ kvo3.get('prop1'), 7 ],
		        [ p, [ '3:prop1=7', '2:prop1=7', '1:prop1=7' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop1change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop1change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop1change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo3.set('prop1', 8);
		return [[ kvo1.get('prop1'), 8 ],
		        [ kvo2.get('prop1'), 8 ],
		        [ kvo3.get('prop1'), 8 ],
		        [ p, [ '3:prop1=8', '2:prop1=8', '1:prop1=8' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop2change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop2change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop2change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo1.set('prop2', 9);
		return [[ kvo1.get('prop2'), 9 ],
		        [ kvo2.get('prop2'), void 0 ],
		        [ kvo3.get('prop2'), 9 ],
		        [ p, [ '3:prop2=9', '1:prop2=9' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop2change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop2change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop2change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo2.set('prop2', 10);
		return [[ kvo1.get('prop2'), 9 ],
		        [ kvo2.get('prop2'), 10 ],
		        [ kvo3.get('prop2'), 9 ],
		        [ p, [ '2:prop2=10' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop2change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop2change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop2change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo3.set('prop2', 11);
		return [[ kvo1.get('prop2'), 11 ],
		        [ kvo2.get('prop2'), 10 ],
		        [ kvo3.get('prop2'), 11 ],
		        [ p, [ '3:prop2=11', '1:prop2=11' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop3change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop3change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop3change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo1.set('prop3', 12);
		return [[ kvo1.get('prop3'), 12 ],
		        [ kvo2.get('prop3'), 12 ],
		        [ kvo3.get('prop3'), 12 ],
		        [ p, [ '1:prop3=12', '2:prop3=12', '3:prop3=12' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop3change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop3change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop3change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo2.set('prop3', 13);
		return [[ kvo1.get('prop3'), 13 ],
		        [ kvo2.get('prop3'), 13 ],
		        [ kvo3.get('prop3'), 13 ],
		        [ p, [ '1:prop3=13', '2:prop3=13', '3:prop3=13' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop3change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop3change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo3.attach('prop3change', function (k) { p.push('3:' + k + '=' + this.get(k)); });
		kvo3.set('prop3', 14);
		return [[ kvo1.get('prop3'), 14 ],
		        [ kvo2.get('prop3'), 14 ],
		        [ kvo3.get('prop3'), 14 ],
		        [ p, [ '1:prop3=14', '2:prop3=14', '3:prop3=14' ] ]];
	},
	function () {
		kvo1.set('prop4a', 15);
		return [[ kvo1.get('prop4a'), 15 ],
		        [ kvo2.get('prop4a'), 15 ],
		        [ kvo1.get('prop4b'), 15 ],
		        [ kvo2.get('prop4b'), 15 ]];
	},
	function () {
		kvo2.set('prop4a', 16);
		return [[ kvo1.get('prop4a'), 16 ],
		        [ kvo2.get('prop4a'), 16 ],
		        [ kvo1.get('prop4b'), 16 ],
		        [ kvo2.get('prop4b'), 16 ]];
	},
	function () {
		kvo1.set('prop4b', 17);
		return [[ kvo1.get('prop4a'), 17 ],
		        [ kvo2.get('prop4a'), 17 ],
		        [ kvo1.get('prop4b'), 17 ],
		        [ kvo2.get('prop4b'), 17 ]];
	},
	function () {
		kvo2.set('prop4b', 18);
		return [[ kvo1.get('prop4a'), 18 ],
		        [ kvo2.get('prop4a'), 18 ],
		        [ kvo1.get('prop4b'), 18 ],
		        [ kvo2.get('prop4b'), 18 ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop5change', function (k) { p.push('1:' + k); });
		kvo2.attach('prop5change', function (k) { p.push('2:' + k); });
		kvo1.bindTo('prop5', kvo2);
		return [[ p, [ '2:prop5', '1:prop5' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop5change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop5change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo1.set('prop5', 20);
		return [[ kvo1.get('prop5'), 20 ],
		        [ kvo2.get('prop5'), 20 ],
		        [ p, [ '2:prop5=20', '1:prop5=20' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop5change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop5change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo2.set('prop5', 21);
		return [[ kvo1.get('prop5'), 21 ],
		        [ kvo2.get('prop5'), 21 ],
		        [ p, [ '2:prop5=21', '1:prop5=21' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop5change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop5change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo1.unbind('prop5');
		return [[ kvo1.get('prop5'), 21 ],
		        [ kvo2.get('prop5'), 21 ],
		        [ p, [ '1:prop5=21' ] ]];
	},
	function () {
		var p = [];
		kvo1.attach('prop5change', function (k) { p.push('1:' + k + '=' + this.get(k)); });
		kvo2.attach('prop5change', function (k) { p.push('2:' + k + '=' + this.get(k)); });
		kvo1.set('prop5', 22);
		return [[ kvo1.get('prop5'), 22 ],
		        [ kvo2.get('prop5'), 21 ],
		        [ p, [ '1:prop5=22' ] ]];
	}
]);
