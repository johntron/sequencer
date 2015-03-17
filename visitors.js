var _debug = require('debug')('sequencer:visitors');
var walk = require('./walk.js');

function debug (visitor, node, ctx) {
	_debug('%s node: %o, ctx: %o', visitor, node, ctx);
}

var visitors = {
    Program: factory('Program', '', 'body'),
    ExpressionStatement: factory('ExpressionStatement', 'expression'),

    NewExpression: function(node, ctx) {
        debug('NewExpression', node, ctx);

		var type = node.callee.name;
		var step = {
            op: 'init',
            caller: ctx.caller,
            type: type
		};
		var function_tree = ctx.function_trees[type];

		if (ctx.declarator) {
			step.variable = ctx.declarator.name;
		}

        ctx.sequence.push(step);

		if (function_tree) {
			var prev = ctx.caller;
			ctx.caller = type;
			visitors.walk(function_tree.body, ctx);
			ctx.caller = prev;
		}
    },

	VariableDeclaration: factory('VariableDeclaration', '', 'declarations'),

	VariableDeclarator: function (node, ctx) {
		debug('VariableDeclarator', node, ctx);
		ctx.declarator = node.id;
		visitors.walk(node.init, ctx);
	},

	CallExpression: function (node, ctx) {
		debug('CallExpression', node, ctx);
		var step = {
			op: 'call',
			caller: ctx.caller,
			callee: node.callee.object.name,
			callee_method: node.callee.property.name
		};
		ctx.sequence.push(step);
	},

	FunctionDeclaration: function (node, ctx) {
		debug('FunctionDeclaration', node, ctx);
		ctx.function_trees[node.id.name] = node;
	},

	BlockStatement: factory('BlockStatement', '', 'body')
};

function factory(type, walk_property, walk_each_property) {
	return function (node, ctx) {
		debug(type, node, ctx);
		if (walk_property) {
			visitors.walk(node[walk_property], ctx);
		}

		if (walk_each_property) {
			walk_each(node[walk_each_property], ctx);
		}
	};
}

function walk_each(arr, ctx) {
	arr.forEach(function (node) {
		visitors.walk(node, ctx);
	});
}

module.exports = visitors;
module.exports.walk = walk; // Expose for test purposes
walk.visitors = module.exports; // Setup circular dependency
