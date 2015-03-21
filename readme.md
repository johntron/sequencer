Sequencer
=========

Generate sequence diagrams of JavaScript code. [Example](https://rawgit.com/johntron/sequencer/master/example/index.html). This is still in alpha.

API
---
```javascript
var parse = require('sequence-generator').parse;
var script = fs.readFileSync('some.js', {encoding: 'utf8'});
var sequence = parse(script);
```

Currently, there's no API for generating the images, but look at [the example](example/index.html) for some ideas.

Definitions
---

* walk - evaluate a portion of the AST.
* store - save a branch of AST or an instance - used as lookups when methods are called.
* caller - an instance or "program" - from which a method is called; beginning of an arrow in sequence diagram
* callee - object owning called method e.g. "a" would be callee of: `a.b()`; end of arrow in sequence diagram.
* callee_method - method called on callee e.g. "b" would be callee method of: `a.b()`; label of arrow in sequence diagram.
* type - object type of callee e.g. "A" would be type for this method call: `new A(); a.b();`; title of lifeline in sequence diagram.
