var gulp = require('gulp')
  , plugins = require('gulp-load-plugins')(gulp)
  , package = require('./package.json');


var config = {
  src: './src/'
  , tmp: '.tmp/'
  , dist: 'dist/'
  , name: package.name
  , docs: './documentation'
  , browserSync: require('browser-sync').create()
};


require('gulp-autoload-tasks')(gulp, plugins, config);

gulp.task('default', ['typescript', 'templates', 'server']);

