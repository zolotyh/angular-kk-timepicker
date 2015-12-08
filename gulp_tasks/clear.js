var del = require('del');

module.exports = function (gulp, plugins, config) {
  gulp.task('clear', function(){
    return del([config.dist]);
  });
};
