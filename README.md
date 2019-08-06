Gulp-Mongoose-Scenario
======================
Gulp wrapper for mongoose-scenario.


Installation
------------
Install via NPM:

```
npm install --save-dev gulp-mongoose-scenario
```


Usage:


```javascript
var gulp = require('gulp');
var scenario = require('gulp-mongoose-scenario');

gulp.task('db', ()=> {
	// Load all config files including your main DB handler
	global.config = require('./config/global');
	require('./config/db');

	// Load all modules
	require('./models/users');
	require('./models/projects');
	require('./models/products');
	require('./models/productCategories');

	// Slurp in all the .json files located in models/scenarios and run them though mongoose-scenario

	return gulp.src('models/scenarios/**/*.json')
		.pipe(scenario({connection: db, nuke: true}))
});
```


If you wish to use `.js` files rather than raw JSON, run use something like [gulp-eval](https://www.npmjs.com/package/gulp-eval) earlier in the pipeline:

```javascript
var eval = require('gulp-eval');
var gulp = require('gulp');

gulp.task('scenario', ()=>
	gulp.src('models/scenarios/**/*.{js,json}')
		.pipe(eval())
		.pipe(scenario({connection: db, nuke: true}))
)
```
