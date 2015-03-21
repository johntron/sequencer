var debug = require('debug')('sequencer:walk');
var visitors = require('./visitors.js');

function walk(node, ctx) {
    debug('walking node', node);
    if (walk.visitors[node.type]) {
        return walk.visitors[node.type](node, ctx);
    }
}

module.exports = walk;
module.exports.visitors = visitors; // Expose for test purposes
visitors.walk = module.exports; // Setup circular dependency
