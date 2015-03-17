var Sequencer = require('..');
var expect = require('chai').expect;
var debug = require('debug')('sequencer:tests');

module.exports = {
    'Instantiation': {
        'init': function() {
            var s = Sequencer.parse('var a = new Object();');
            debug('sequence: %o', s.sequence);
            expect(s.sequence[0].op).to.equal('init');
            expect(s.sequence[0].variable).to.equal('a');
            expect(s.sequence[0].caller).to.equal('program');
            expect(s.sequence[0].type).to.equal('Object');
        },
		
		'nested init': function () {
			var s = Sequencer.parse('function B() { new A(); }; new B();');
			debug('sequence: %o', s.sequence);
			expect(s.sequence[1].op).to.equal('init');
			expect(s.sequence[1].type).to.equal('A');
			expect(s.sequence[1].caller).to.equal('B');
		}
    },

    'Calls': {
        'method call': function() {
			var s = Sequencer.parse('a.fn();');
			debug('sequence: %o', s.sequence);
			expect(s.sequence[0].op).to.equal('call');
			expect(s.sequence[0].caller).to.equal('program');
			expect(s.sequence[0].callee).to.equal('a');
			//expect(s.sequence[0].callee_type).to.equal(???); // Resolve variable references - have a sane default like 'undefined'
			expect(s.sequence[0].callee_method).to.equal('fn');
		},

        'instance method call': function() {
			var s = Sequencer.parse('var a = new A(); a.b();');
			debug('sequence: %o', s.sequence);
			expect(s.sequence[1].op).to.equal('call');
			expect(s.sequence[1].caller).to.equal('program');
			expect(s.sequence[1].callee).to.equal('a');
			expect(s.sequence[1].callee_method).to.equal('b');
		},

		'nested method calls': function () {
			var source = 'function Foo() {}; Foo.prototype.bar = function () { Zab.some(); }; var foo = new Foo(); foo.bar();';
			var s = Sequencer.parse(source);
			debug('sequence: %o', s.sequence);
			// Doesn't find Zab.some() - not implemented
			expect(s.sequence[2].op).to.equal('call');
			expect(s.sequence[2].caller).to.equal('foo');
			expect(s.sequence[2].caller_type).to.equal('Foo');
			expect(s.sequence[2].callee).to.equal('Zab');
			expect(s.sequence[2].callee_method).to.equal('some');
		}
	}
};
