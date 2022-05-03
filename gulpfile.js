// ===================== General =======================

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const purgecss = require('gulp-purgecss');
const browsersync = require('browser-sync').create();
const del = require('del');

const paths = {
  html: {
    src: './app/**/*.html',
    dest: './dist/'
  },
  styles: {
    src: './app/src/sass/style.scss',
    watch: './app/src/sass/**/*.scss',
    dest: './app/css/prev/'
  },
  scripts: {
    src: './app/src/scripts/main.js',
    watch: './app/src/scripts/**/*.js',
    dest: './app/js/prev/'
  },
  images: {
    src: './app/src/images/**',
    dest: './app/images/'
  },
  clean: {
    src: ['./app/css/**', 'app/js/**']
  },
  cleandist: {
    src: './dist/'
  }
}

// ===================== Dev =====================================

function clean() {
  return del(paths.clean.src)
}

function styleLibs() {
  return gulp.src(['./app/src/libs/testlib/testlib.css'])
    .pipe(cleanCss({
      level: 2
    }))
    .pipe(concat('compiled.css'))
    .pipe(gulp.dest('./app/css/'))
}

function scriptLibs() {
  return gulp.src(['./app/src/libs/testlib/testlib.js'])
    .pipe(concat('compiled.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js/'))
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(rename({
      basename: 'style',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream());
};

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream());
}

function img() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}

function watch() {
  browsersync.init({
    server: {
      baseDir: "./app/"
    }
  })
  gulp.watch(paths.html.src).on('change', browsersync.reload)
  gulp.watch(paths.styles.watch, styles)
  gulp.watch(paths.scripts.watch, scripts)
  gulp.watch(paths.images.src, img)
}

const add = gulp.series(clean, styleLibs, scriptLibs, gulp.parallel(styles, scripts, img), watch);

// ===================== Dev Functions Exports =======================

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.styleLibs = styleLibs;
exports.scriptLibs = scriptLibs;
exports.img = img;
exports.watch = watch;
exports.add = add;
exports.default = add;

// ===================== Dist ==========================

function cleandist() {
  return del(paths.cleandist.src)
};

function compiledCss() {
  return gulp.src(['./app/css/compiled.css', './app/css/prev/style.css'])
    .pipe(concatCss('compiledCss.css'))
    .pipe(
      purgecss({
        content: ['./app/**/*.html', './app/**/*.js']
      })
    )
    .pipe(cleanCss({
      level: 2
    }))
    .pipe(gulp.dest('./dist/css/'))
}

function compiledJs() {
  return gulp.src(['./app/js/compiled.js', './app/js/prev/main.js'])
    .pipe(concat('compiledJs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
}

// ==================== TRANSFER ==================== //

function html() {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./dist'));
}

function imgDest() {
  return gulp.src('./app/images/**')
    .pipe(gulp.dest('./dist/images/'));
}

function libs() {
  return gulp.src('./app/src/libs/**')
    .pipe(gulp.dest('./dist/src/libs/'));
}

function fonts() {
  return gulp.src('./app/src/fonts/**')
    .pipe(gulp.dest('./dist/src/fonts/'));
}

function files() {
  return gulp.src('./app/files/**/*')
    .pipe(gulp.dest('./dist/src/files/'));
}

function videofiles() {
  return gulp.src('./app/src/video/**/*')
    .pipe(gulp.dest('./dist/src/video/'));
}

function demo() {
  return gulp.src('./app/demo/**/*')
    .pipe(gulp.dest('./dist/demo/'));
}

// ----------------------------------------------------------------

const build = gulp.series([
  cleandist,
  compiledCss,
  compiledJs,
  html,
  imgDest,
  libs,
  fonts,
  files,
  videofiles,
  demo
]);

// ===================== Dist Functions Exports =======================

exports.cleandist = cleandist;
exports.compiledCss = compiledCss;
exports.compiledJs = compiledJs;

// --------------------------------------------------------------------

exports.html = html;
exports.imgDest = imgDest;
exports.libs = libs;
exports.fonts = fonts;
exports.files = files;
exports.videofiles = videofiles;
exports.demo = demo;

// ------------------------------------------------------------------

exports.build = build;

