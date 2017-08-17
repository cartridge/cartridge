/* ============================================================ *\
	SETUP
\* ============================================================ */

/*jslint node: true */
'use strict';

// Gulp
var gulp   = require('gulp');
var argv   = require('yargs').argv;
var runSeq = require('run-sequence');

// Tasks
var del = require('del');

// Node
var path = require('path');
var fs   = require('fs');

// Tasks
var tasks         = {};

tasks.default     = [];
tasks.watch       = [];

// Config
var config        = require('./_config/project.json');
var cartridge     = JSON.parse(fs.readFileSync('./.cartridgerc', 'utf8'));

config.cleanPaths = [];
config.creds      = require('./_config/creds.json');

config.isProd     = argv.prod || false;
config.isWatched  = argv.watch || false;

/* ============================================================ *\
	TASK MODULES
\* ============================================================ */

cartridge.modules.forEach(function(module) {
	require(path.resolve('node_modules/' + module.task))(gulp, config, tasks);
});

gulp.task('clean', function () {
	return del(config.cleanPaths);
});

/* ============================================================ *\
	MAIN TASKS
\* ============================================================ */

// Task for local dev
gulp.task('default', tasks.default.concat(['watch']));

gulp.task('watch', tasks.watch);

// Task for local dev
if(!config.isProd) {
	tasks.default.concat(['watch']);
}
// Task for team city
gulp.task('build', function (cb) {
	return runSeq(['clean'], tasks.default, cb);
});
