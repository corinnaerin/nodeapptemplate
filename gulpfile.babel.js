'use strict';

import babel from "babel-core/register";
import babelify from "babelify";
import browserify from "browserify";
import buffer from "vinyl-buffer";
import cleanCSS from "gulp-clean-css";
import del from "del";
import gulp from "gulp";
import gutil from "gulp-util";
import htmlmin from "gulp-htmlmin";
import mocha from "gulp-mocha";
import nodemon from "gulp-nodemon";
import sass from "gulp-sass";
import source from "vinyl-source-stream";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";

const dirs = {
    src: './app',
    build: './dist',
    test: './tests'
};

gulp.task('test', () => {
    return gulp.src(`${dirs.test}/server-test.js`, {read: false})
        .pipe(mocha({
            reporter: 'nyan',
            complilers: {
                js: babel
            }
        }))
});

gulp.task('watch', ['build'], () => {
    return nodemon({
        script: 'server.js',
        ext: 'html js scss json gif png',
        ignore: 'dist/*',
        tasks: ['build']
    })
});

gulp.task('clean', () => {
    return del(`${dirs.build}/**/*`)
});

gulp.task('sass', ['clean'], () => {
    return gulp.src(`${dirs.src}/styles/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${dirs.build}/styles`))
});

gulp.task('htmlmin', ['clean'], () => {
    return gulp.src(`${dirs.src}/**/*.html`)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dirs.build))
});

gulp.task('images', ['clean'], () => {
   return gulp.src(`${dirs.src}/images/**/*`)
       .pipe(gulp.dest(`${dirs.build}/images`))
});

gulp.task('scripts', ['clean'], () => {
    return browserify({
            entries: `${dirs.src}/scripts/app.js`,
            debug: true
        })
        .transform('babelify', {presets: ['es2015']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${dirs.build}/scripts`));
});

gulp.task('build', ['sass', 'scripts', 'htmlmin', 'images']);