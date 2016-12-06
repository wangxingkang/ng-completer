var gulp = require('gulp');
var karma = require('gulp-karma');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');

gulp.task('build', ['js', 'css'], function() {

});

gulp.task('js', function () {
  return gulp.src('src/ngCompleter.js')
    .pipe(uglify())
    .pipe(rename('ngCompleter.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp.src('src/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
  return gulp.src('./foobar')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action : 'run'
    }))
    .on('error', function (err) {
      console.log(err);
      this.emit('end');
    });
});