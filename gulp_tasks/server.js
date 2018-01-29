module.exports = function (gulp, plugins, config) {
  gulp.task('server', ['stylus'] ,function(){
    config.browserSync.init({
      server: {
        baseDir: ['./dist', './node_modules/angular', './documentation', './node_modules/jquery/dist/', './node_modules/bootstrap/dist/']
      }
    });
    // add watchers for reloading
    gulp.watch(config.src + '/**/*.html', ['reload']);
    gulp.watch(config.docs + '/**/*.html', ['reload']);
  });
};

