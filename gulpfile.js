var gulp = require('gulp');
var jade = require('gulp-jade');
var marked = require('marked');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
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
  'sass': 'source/asset/sass/*.scss',
  'js': 'source/asset/js/**/*.js'
}

/**
 * コンパイル後に出力するパス。
 */
var build = {
  'root': 'build/',
  'html': 'build/',
  'css': 'build/css/',
  'js': 'build/js/'
}

/**
 * jadeをhtmlにコンパイルします。
 */
gulp.task('jade', function() {
  return gulp.src([source.jade + '*.jade', '!' + source.jade + '_*.jade'])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(build.html))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * .scssを.cssに圧縮してコンパイルします。
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
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build.css))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * source/asset/js内のjsファイルを
 * 圧縮してから結合します。
 */
gulp.task('js', function() {
  return gulp.src(source.js)
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(concat('script.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build.js))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * ローカルサーバーの起動後、各ファイルの監視をします。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: build.root
    }
  })
  gulp.watch(source.jade + '*.jade', ['jade']);
  gulp.watch(source.sass, ['sass']);
  gulp.watch(source.js, ['js']);
});


/**
 * jade, sass, jsのタスクを処理しながらライブリロード。
 */
gulp.task('watch', function() {
  runSequence(
    ['jade', 'sass', 'js'],
    'browser-sync'
  );
});