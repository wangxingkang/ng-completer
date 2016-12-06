var gulp = require('gulp');
var karma = require('gulp-karma');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build', function(done) {
  return gulp.src('src/ngCompleter.js')
    .pipe(uglify())
    .pipe(rename('ngCompleter.min.js'))
    .pipe(gulp.dest('build'));
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