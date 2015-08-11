var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

var paths = {
  'rootDir': './source',
  'htmlSrc': 'source/*.html',
  'scssDir': 'source/scss/*.scss',
  'cssSrc': 'source/css',
  'distDir': 'source/dist'
};

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: paths.rootDir
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('sass', function() {
  return gulp.src(paths.scssDir)
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
  }))
  .pipe(sass({outputStyle: 'expanded'}))
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.cssSrc))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('default', ['sass', 'browser-sync'], function() {
  gulp.watch(paths.scssDir, ['sass']);
  gulp.watch(paths.htmlSrc, ['bs-reload']);
});

gulp.task('cssmin', function() {
  return gulp.src(paths.scssDir)
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
  }))
  .pipe(sass({outputStyle: 'expanded'}))
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.distDir + '/css'))
  .pipe(cssmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(paths.distDir + '/css'));
});