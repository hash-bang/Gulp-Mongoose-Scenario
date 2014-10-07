Gulp-Mongoose-Scenario
======================
Gulp wrapper for mongoose-scenario.


Installation
------------
Install via NPM:

	npm install --save-dev gulp-mongoose-scenario


Usage:


```javascript
gulp.task('db', function(next) {
	// Load all config files including your main DB handler
	global.config = require('./config/global');
	require('./config/db');

	// Load all modules
	require('./models/users');
	require('./models/projects');
	require('./models/products');
	require('./models/productCategories');

	// Slurp in all the .json files located in models/scenarios and run them though mongoose-scenario

	var scenario = require('gulp-mongoose-scenario');
	gulp.src('models/scenarios/setup.json')
		.pipe(scenario({connection: db, nuke: true}))
		.on('end', function(err) {
			if (err) return next(err);
			next();
		});
});
```
