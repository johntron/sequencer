Sequencer
=========

Generate sequence diagrams of JavaScript code

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
Tell me if these don't make sense:
* caller - object or "program" scope from which method was called - "scope" may be more intuitive
* callee - object owning called method e.g. "a" would be callee of: `a.b()`
* callee_method - method called on callee e.g. "b" would be callee method of: `a.b()`
* type - object type of callee e.g. "A" would be type for this method call: `new A(); a.b();`
