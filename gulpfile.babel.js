'use strict';

import autoprefixer from 'gulp-autoprefixer'
import babel from 'babel-core/register'
import babelify from 'babelify'
import browserify from 'browserify'
import buffer from 'vinyl-buffer'
import clean from 'gulp-clean'
import cleanCSS from 'gulp-clean-css'
import gulp from 'gulp'
import gutil from 'gulp-util'
import htmlmin from 'gulp-htmlmin'
import mocha from 'gulp-mocha'
import nodemon from 'gulp-nodemon'
import sass from 'gulp-sass'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'

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

gulp.task('nodemon', ['build'], () => {
    return nodemon({
        script: 'server.js',
        ext: 'html js scss json gif png',
        ignore: 'dist/*',
        tasks: ['build'] //This does not work in windows due to a bug in gulp-nodemon, which is why there's a separate watch task below
    })
});

gulp.task('watch', ['build', 'nodemon'], () => {
    gulp.watch(`${dirs.src}/images/**/*`, ['images']);
    gulp.watch(`${dirs.src}/scripts/**/*`, ['scripts']);
    gulp.watch(`${dirs.src}/styles/**/*`, ['sass']);
    gulp.watch(`${dirs.src}/**/*.html`, ['htmlmin']);
});

gulp.task('cleanCSS', () => {
    return gulp.src(`${dirs.build}/styles`, { read: false })
        .pipe(clean());
});

gulp.task('sass', ['cleanCSS'], () => {
    return gulp.src(`${dirs.src}/styles/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer( {
                browsers: ['last 2 versions']
            }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${dirs.build}/styles`))
});

gulp.task('cleanHTML', () => {
    return gulp.src(`${dirs.build}/**/*.html`, { read: false })
        .pipe(clean());
});

gulp.task('htmlmin', ['cleanHTML'], () => {
    return gulp.src(`${dirs.src}/**/*.html`)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dirs.build))
});

gulp.task('cleanImages', () => {
    return gulp.src(`${dirs.build}/images`, { read: false })
        .pipe(clean());
});

gulp.task('images', ['cleanImages'], () => {
    return gulp.src(`${dirs.src}/images/**/*`)
        .pipe(gulp.dest(`${dirs.build}/images`))
});

gulp.task('cleanScripts', () => {
    return gulp.src(`${dirs.build}/scripts`, { read: false })
        .pipe(clean());
});

gulp.task('scripts', ['cleanScripts'], () => {
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
