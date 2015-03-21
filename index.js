var esprima = require('esprima');
var debug = require('debug')('sequencer');
var walk = require('./walk.js');

function Sequencer() {
    this.sequence = [];
}

Sequencer.parse = function(script) {
    var s = new Sequencer();
    var ctx = {
        sequence: s.sequence,
        caller: 'program',
		function_trees: {},
		variables: {}
    };
    var ast = esprima.parse(script);
    walk(ast, ctx);
    return s;
};

module.exports = Sequencer;
