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
var stylestats = require('gulp-stylestats');

/**
 * 処理前のソースへのパス。
 */
var source = {
  'root': 'source/',
  'jade': 'source/**/',
  'sass': 'source/asset/sass/**/*.scss',
  'js': 'source/asset/js/**/*.js',
  'stylestats': 'build/css/*.css'
}

/**
 * 処理後に出力するパス。
 */
var build = {
  'root': 'build/',
  'html': 'build/',
  'css': 'build/css/',
  'js': 'build/js/',
  'stylestats': 'build/css/stylestats'
}

/**
 * `.jade`を`.html`にコンパイルします。
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
 * `.scss`を`.css`にコンパイルします。
 * 対象は`source/asset/sass/`の中にある`.scss`ファイルです。
 * ベンダープレフィックスを付与後、csscombで整形されます。
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
 * `.js`を結合します。
 * 対象は`source/asset/js`の中にある`.js`ファイルです。
 * ファイル名は`script.js`になります。
 */
gulp.task('js', function() {
  return gulp.src(source.js)
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build.js))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * `.css`を圧縮します。
 * 対象は'build/css/'に出力された`.css`ファイルです。
 * ファイル名は`ファイル名.min.css`になります。
 */
 gulp.task('minify-css', function() {
  return gulp.src(build.css + '*.css')
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build.css));
 });

 /**
 * jsを圧縮します。
 * 対象は'build/js/'に出力された`.js`ファイルです。
 * ファイル名は'script.min.js'になります。
 */
 gulp.task('minify-js', function() {
  return gulp.src(build.js + '*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(concat('script.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build.js));
});

/**
 * stylestatsでCSSを解析します。
 * 対象は'build/css/'に出力された`.css`ファイルです。
 * `css/stylestats/`ディレクトリに`.json`として出力されます。
 * https://github.com/t32k/stylestats
 */
gulp.task('stylestats', function() {
  return gulp.src(source.stylestats)
    .pipe(stylestats({
      type: 'json',
      outfile: true
    }))
    .pipe(gulp.dest(build.stylestats));
});

/**
 * ローカルサーバーの起動後、各ファイルを監視します。
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
  gulp.watch(build.css + '*.css', ['stylestats']);
});


/**
 * 開発中に使用するタスクです。
 * jade, sass, js, stylestatsのタスクを処理しながらライブリロードします。
 */
gulp.task('default', function() {
  runSequence(
    ['jade', 'sass', 'js', 'stylestats'],
    'browser-sync'
  );
});

 /**
 * `.css`と`.js`を圧縮します。
 * minify-cssとminify-jsのタスクを参照してくだい。
 */
gulp.task('minify', function() {
  runSequence(
    'minify-css',
    'minify-js'
  );
});