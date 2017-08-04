const DEVELOPMENT = require('../environment').isDevelopment;
const PRODUCTION = !DEVELOPMENT;
const gulp = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const nunjucksify = require('nunjucksify');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const uglifyify = require('uglifyify');
const envify = require('envify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const browserSync = require('browser-sync');
const config = require('../config');

function bundle() {
    const transforms = [babelify, envify, nunjucksify];
    const opts = {
        entries: config.JS_ENTRY,
        debug: DEVELOPMENT,
        transform: DEVELOPMENT ? transforms : [...transforms, uglifyify]
    };
    const bundler = DEVELOPMENT ? watchify(browserify(Object.assign({}, watchify.args, opts))) : browserify(opts);
    const rebundle = () => {
        return bundler.bundle()
            .on('error', e => gutil.log(gutil.colors.red(e.name) + e.message))
            .pipe(source(config.JS_MAIN_FILENAME))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(gulpif(PRODUCTION, uglify()))
            .pipe(sourcemaps.write('./'))

            .pipe(gulp.dest(config.JS_BUILD))
            .pipe(gulpif(DEVELOPMENT, browserSync.stream()))
            ;
    };
    bundler
        .on('update', rebundle)
        .on('log', gutil.log);
    return rebundle();
}

gulp.task('js', ['eslint'], bundle);
