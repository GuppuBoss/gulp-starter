require('es6-promise').polyfill();
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('useref', function () {
  return gulp.src('app/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cleanCSS({compatibility: 'ie8'})))
  .pipe(gulp.dest('dist'))
});


gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server : {
      baseDir: 'app'  
    },
  })
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('watch', ['browserSync', 'sass'],function () {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('build', function(callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
    )
});



var imageop = require('gulp-image-optimization');
gulp.task('images', function () {
   gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imageop()))
    .pipe(gulp.dest('dist/images'))
});



// gulp.watch('file-to-watch', ['tasks', 'to', 'run'] );
// gulp.watch('app/scss/**/*.scss', ['sass']);


// gulp.task('hello', function() {
//   return gulp.src('source-files')
//   .pipe(aGulpPlugin())
//   .pipe(gulp.dest('destination-files'))
// });