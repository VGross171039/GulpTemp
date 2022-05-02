// ==========================================================

const gulppug = require('gulp-pug'); // Скачать пакет

function pug() {
  return gulp.src(paths.pug.src)
    .pipe(gulppug())
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browsersync.stream());
}

exports.pug = pug;

// ==========================================================

const stylus = require('gulp-stylus'); // Скачать пакет

function styl() {
  return gulp.src(paths.stylus.src)
    .pipe(stylus())
    .pipe(gulp.dest(paths.stylus.dest));
}

exports.styl = styl;

// ==========================================================

function grid() {
  return gulp.src('node_modules/bootstrap/scss/bootstrap-grid.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(rename({
      basename: 'grid',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
}

exports.grid = grid;

// ===========================================================