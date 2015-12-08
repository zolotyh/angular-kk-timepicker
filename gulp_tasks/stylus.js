module.exports = function (gulp, plugins, config) {
  gulp.task('stylus' ,function(){
    return gulp.src(config.src + './index.styl')
      .pipe(plugins.stylus())
      .pipe(plugins.rename(config.name + '.css'))
      .pipe(gulp.dest(config.dist))
      .pipe(config.browserSync.stream());
  });
  gulp.watch(config.src + '/**/*.styl', ['stylus']);
};
