var _  = require('lodash');
var gutil = require('gulp-util');
var scenario = require('mongoose-scenario');
var through = require('through');

module.exports = function(options) {
	var data = {};

	function bufferContents(file) {
		// Sanity checks {{{
		if (file.isNull()) return; // ignore
		if (file.isStream()) return this.emit('error', new PluginError('gulp-concat-json', 'Streaming not supported'));
		// }}}

		var obj = JSON.parse(file.contents.toString('utf8'));
		_.forEach(obj, function(rows, collection) {
			if (!data[collection]) { // Doesn't already exist
				data[collection] = rows;
			} else { // Does exist - merge the records together
				data[collection] = data[collection].concat(rows);
			}
		});
	}

	function endStream() {
		var self = this;
		scenario.import(data, options, function(err, progress) {
			if (err) return gutil.log('Scenario error:'.red, err.toString().red);
			if (!options.quiet) {
				gutil.log('Database scenario created'.bold);
				Object.keys(progress.created).sort().forEach(function(collection) {
					gutil.log(' * Created ' + progress.created[collection].toString().cyan + ' ' + collection.magenta);
				});
			}
			data = {};
			self.emit('end');
		});
	}

	return through(bufferContents, endStream);
};
