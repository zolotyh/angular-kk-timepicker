module.exports = function (gulp, plugins, config) {
  gulp.task('copy', ['typescript', 'stylus', 'templates'], function(){
    gulp.src([
      './node_modules/angular/**/*',
      './node_modules/bootstrap/dist/**/*',
      './node_modules/jquery/dist/**/*',
      config.dist + '**/*'
    ])
    .pipe(gulp.dest(config.docs));
  });
  gulp.task('deploy', ['copy'], function(){
    return gulp.src(config.docs + '/**/*')
        .pipe(plugins.ghPages())
        .pipe(plugins.exit());
  });
};
