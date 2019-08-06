var _  = require('lodash');
var debug = require('debug')('gulp-mongoose-scenario');
var gutil = require('gulp-util');
var scenario = require('mongoose-scenario');
var through = require('through');

module.exports = function(options) {
	var data = {};

	return through(
		function stream(file) {
			// Sanity checks {{{
			if (file.isNull()) return; // ignore
			if (file.isStream()) return this.emit('error', new PluginError('gulp-concat-json', 'Streaming not supported'));
			// }}}

			debug('Concat file', file.path);

			// Use file.data if present (probably decoded via gulp-eval or the like) otherwise decode the contents as JSON
			var obj = file.data ? file.data : JSON.parse(file.contents.toString('utf8'));
			_.forEach(obj, function(rows, collection) {
				if (!data[collection]) { // Doesn't already exist
					data[collection] = rows;
				} else { // Does exist - merge the records together
					data[collection] = data[collection].concat(rows);
				}
			});
		},
		function end() {
			debug('Begin import');
			scenario.import(data, options, (err, progress) => {
				debug('End import');
				if (err) return gutil.log(gutil.colors.red('Scenario error:'), err.toString());
				if (!options.quiet) {
					gutil.log(gutil.colors.bold('Database scenario created'));
					Object.keys(progress.created).sort().forEach(function(collection) {
						gutil.log(' * Created ' + gutil.colors.cyan(progress.created[collection].toString()) + ' ' + gutil.colors.magenta(collection));
					});
				}
				data = {};
				this.emit('end');
			});
		}
	);
};
