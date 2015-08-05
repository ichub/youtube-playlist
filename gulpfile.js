var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var ms = require('merge-stream');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('clean', function() {
  return gulp.src('dist')
    .pipe(rimraf());
});

gulp.task('build', ['clean'], function() {
  return ms(
    gulp.src(['manifest.json', 'injected.html', 'background.js', 'jquery.min.js'])
      .pipe(gulp.dest('dist')),
    gulp.src('injected.less')
      .pipe(less())
      .pipe(minifyCss())
      .pipe(gulp.dest('dist')),
    gulp.src('injected.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
  );
});

gulp.task('default', function() {

});