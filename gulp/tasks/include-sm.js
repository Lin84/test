const config = require('../config');
const DEVELOPMENT = require('../environment').isDevelopment;
const gulp = require('gulp');
const replace = require('gulp-replace');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync');
const merge = require('merge-stream');

gulp.task('includeSm', () => {
    const css = gulp.src(`${config.SM_STYLES}/**/*.*`)
        .pipe(replace('/../fonts/', '/fonts/'))
        .pipe(gulp.dest(config.CSS_BUILD_INNOGY));

    const js = gulp.src(`${config.SM_JS}/*.*`)
        .pipe(gulp.dest(`${config.JS_BUILD_INNOGY}`));

    const fonts = gulp.src(`${config.SM_FONTS}/*.*`)
        .pipe(gulp.dest(config.FONTS_BUILD));

    return merge(css, js, fonts);
});
