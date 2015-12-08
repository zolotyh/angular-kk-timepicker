var browserify = require('browserify')
  , watchify = require('watchify')
  , buffer = require('vinyl-buffer')
  , source = require('vinyl-source-stream')
  , buildConfig = require('../config.js');

module.exports = function (gulp, plugins, config) {
  var browserifyObject = browserify({
    entries: config.src + './app.ts',
    extensions: ['.ts'],
    debug: false
  });

  browserifyObject.plugin.apply(browserifyObject, buildConfig.tsify)
    .transform.apply(browserifyObject, buildConfig.babelify);

  var watchifyObject = watchify(browserifyObject);

  gulp.task('typescript', bundle);

  watchifyObject.on('update', bundle);
  watchifyObject.on('log', plugins.util.log);

  function bundle() {
    gulp.start('reload');
    browserifyObject.bundle()
      .on('error', function (err) {
        console.log(err.message);//eslint-disable-line no-console
      })
      .pipe(source('out.js'))
      .pipe(buffer())
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.sourcemaps.init({loadMaps: true}))
      .pipe(plugins.rename(config.name + '.js'))
      .pipe(gulp.dest(config.dist))
      .pipe(plugins.uglify())
      .pipe(plugins.rename(config.name + '.min.js'))
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest(config.dist));
  }
};

