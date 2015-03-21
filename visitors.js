var _debug = require('debug')('sequencer:visitors');
var walk = require('./walk.js');

function debug(visitor, node, ctx) {
    _debug('%s node: %o, ctx: %o', visitor, node, ctx);
}

var visitors = {
    Program: factory('Program', '', 'body'),

    ExpressionStatement: factory('ExpressionStatement', 'expression'),

    NewExpression: function(node, ctx) {
        debug('NewExpression', node, ctx);

        var step = init(ctx.caller, node.callee, ctx);
        return step;
    },

    VariableDeclaration: factory('VariableDeclaration', '', 'declarations'),

    VariableDeclarator: function(node, ctx) {
        debug('VariableDeclarator', node, ctx);
        var result = visitors.walk(node.init, ctx);
        result.variable = node.id.name;
        ctx.variables[result.variable] = result;
    },

    CallExpression: function(node, ctx) {
        debug('CallExpression', node, ctx);
        var step = call(ctx.caller, node.callee.object.name, node.callee.property.name, ctx);
        ctx.sequence.push(step);
    },

    FunctionDeclaration: function(node, ctx) {
        debug('FunctionDeclaration', node, ctx);
        ctx.function_trees[node.id.name] = node;
    },

    BlockStatement: factory('BlockStatement', '', 'body'),

    AssignmentExpression: function(node, ctx) {
        debug('AssignmentExpression', node, ctx);
        visitors.walk(node.left, ctx);
        var left = node.left;
        if (left.type === 'MemberExpression' && left.object.property.name === 'prototype') {
            // Assigning a method on object prototype
            // TODO store method in prototype of corresponding function_tree record
        }
    }
};

function init(caller, callee, ctx) {
    var type = callee.name;
    var step = {
        op: 'init',
        caller: caller,
        type: type
    };
    var tree = ctx.function_trees[type];
	
	ctx.sequence.push(step);

    if (tree) {
		// Walk function body
        var prev = caller;
        ctx.caller = type;
        visitors.walk(tree.body, ctx);
        ctx.caller = prev;
    }

	return step;
}

function call(caller, callee, method, ctx) {
    var step = {
        op: 'call',
        caller: caller,
        callee: callee,
        callee_method: method
    };
    var value = ctx.variables[callee];

    if (!value) {
        // Called a method on an undefined instance
        return; // Short-circuit
    }

    var type = ctx.function_trees[value.type];

    if (!type) {
        // Called method on an instance of an undefined object
        return; // Short-circuit
    }

    // TODO walk method
    _debug('calling method on instance of: ', type);

    return step;
}

function factory(type, walk_property, walk_each_property) {
    return function(node, ctx) {
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
    arr.forEach(function(node) {
        visitors.walk(node, ctx);
    });
}

module.exports = visitors;
module.exports.walk = walk; // Expose for test purposes
walk.visitors = module.exports; // Setup circular dependency
