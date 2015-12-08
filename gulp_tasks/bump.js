module.exports = function (gulp, plugins) {
  function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
      // bump the version number in those files
      .pipe(plugins.bump({type: importance}))
      // save it back to filesystem
      .pipe(gulp.dest('./'))
      // commit the changed version number
      .pipe(plugins.git.commit('bumps package version'))
      // read only one file to get the version number
      .pipe(plugins.filter('package.json'))
      // **tag it in the repository**
      .pipe(plugins.tagVersion())
      // exit
      .pipe(plugins.exit());
  }
  gulp.task('patch', function() { return inc('patch'); });
  gulp.task('feature', function() { return inc('minor'); });
  gulp.task('release', function() { return inc('major'); });
};
