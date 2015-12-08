module.exports = function (gulp, plugins, config) {
  gulp.task('reload', function(){
    config.browserSync.reload();
  });
};
