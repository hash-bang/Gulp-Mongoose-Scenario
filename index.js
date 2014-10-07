var gutil = require('gulp-util');
var es = require('event-stream');
var scenario = require('mongoose-scenario');

module.exports = function(options) {
	return es.map(function(file, cb) {
		if (file.isNull()) return cb(null, file); // pass along
		if (file.isStream()) return cb(new Error("gulp-mongoose-scenario: Streaming not supported"));

		var contents = file.contents.toString('utf8');
		contents = JSON.parse(contents);

		scenario(contents, options, function(err, data) {
			if (err) return cb(err);
			if (!options.quiet) {
				gutil.log('Database scenario created'.bold);
				Object.keys(data.created).sort().forEach(function(collection) {
					gutil.log(' * Created ' + data.created[collection].toString().cyan + ' ' + collection.magenta);
				});
			}
			cb(null, file);
		});
	});
};
