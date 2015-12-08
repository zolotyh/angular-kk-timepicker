module.exports = function (gulp, plugins, config) {
  gulp.task('templates' ,function(){
    var templateConfig = {
      module: 'kk.timepicker'
    };
    return gulp.src(config.src + '**/*.html')
      .pipe(plugins.angularTemplatecache(templateConfig))
      .pipe(plugins.rename(config.name + '.tpl.js'))
      .pipe(gulp.dest(config.dist));
  });
  gulp.watch(config.src + '/**/*.html', ['templates', 'reload']);
};
