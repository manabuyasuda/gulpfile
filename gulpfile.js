var gulp = require('gulp');
var jade = require('gulp-jade');
var marked = require('marked');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');


/**
 * コンパイル前のソースへのパス。
 */
var source = {
  'root': 'source/',
  'jade': 'source/**/',
  'sass': 'source/asset/scss/*.scss'
};

/**
 * コンパイル後に出力するパス。
 */
var build = {
  'root': 'build/',
  'css': 'build/css/',
  'html': 'build/'
};

/**
 * jadeをhtmlにコンパイル。
 */
gulp.task('jade', function() {
  gulp.src([source.jade + '*.jade', '!' + source.jade + '_*.jade'])
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest(build.html))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * .scssを.cssにコンパイル。
 * 圧縮する場合は`gulp css-minify`を実行します。
 */
gulp.task('sass', function(){
  return gulp.src(source.sass)
  .pipe(sourcemaps.init())
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 3 versions'],
  }))
  .pipe(sass())
  .pipe(csscomb())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(build.css))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * ローカルサーバーの起動後、各ファイルの監視をする。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: build.root
    }
  })
  gulp.watch(source.jade + '*.jade', ['jade']);
  gulp.watch(source.sass, ['sass']);
});


/**
 * jade, sassのコンパイルの監視とライブリロード。
 */
gulp.task('watch', function() {
  runSequence(
    ['jade', 'sass'], 'browser-sync'
  );
});

/**
 * コンパイルしているCSSファイルを圧縮（コピー）して.minを付与する。
 */
gulp.task('css-minify', function(){
  return gulp.src(build.css + '/*.css')
  .pipe(sourcemaps.init())
  .pipe(rename({suffix: '.min'}))
  .pipe(minifyCss())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(build.css));
});