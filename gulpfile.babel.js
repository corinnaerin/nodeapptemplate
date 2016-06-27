'use strict';

import autoprefixer from 'gulp-autoprefixer'
import babel from 'babel-core/register'
import babelify from 'babelify'
import browserify from 'browserify'
import clean from 'gulp-clean'
import cleanCSS from 'gulp-clean-css'
import gulp from 'gulp'
import gutil from 'gulp-util'
import htmlmin from 'gulp-htmlmin'
import mocha from 'gulp-mocha'
import nodemon from 'gulp-nodemon'
import path from 'path';
import sass from 'gulp-sass'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import tslint from 'gulp-tslint'
import tsify from 'tsify'
import uglify from 'gulp-uglify'

const dirs = {
    src: './app',
    build: './dist',
    test: './tests'
};

const fileExtToTasks = {
    '.ts': 'scripts',
    '.tsx': 'scripts',
    '.html': 'html',
    '.scss': 'sass',
    '.gif': 'images',
    '.png': 'images'
};

gulp.task('test', () => {
    return gulp.src(`${dirs.test}/server-test.js`, {read: false})
        .pipe(mocha({
            reporter: 'nyan',
            compilers: {
                js: babel
            }
        }));
});

gulp.task('nodemon', ['build'], () => {
    return nodemon({
        script: 'server.ts',
        ext: 'html ts tsx scss gif png',
        ignore: 'dist/*',
        exec: 'ts-node',
        tasks: (changedFiles) => {
            var tasks = new Set();
            changedFiles.forEach((file) => {
                const task = fileExtToTasks[path.extname(file)];
                if (!!task) tasks.add(task);
            });
            return Array.from(tasks);
        }
    })
});

gulp.task('nodemon:release', ['release'], () => {
    return nodemon({
        script: 'server.ts',
        ext: 'html ts tsx scss gif png',
        ignore: 'dist/*',
        exec: 'ts-node',
        tasks: (changedFiles) => {
            var tasks = new Set();
            changedFiles.forEach((file) => {
                const task = fileExtToTasks[path.extname(file)];
                if (!!task) tasks.add(`${task}:release`);
            });
            return Array.from(tasks);
        }
    })
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
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${dirs.build}/styles`))
});

gulp.task('sass:release', ['cleanCSS'], () => {
    return gulp.src(`${dirs.src}/styles/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer( {
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${dirs.build}/styles`))
});

gulp.task('cleanHTML', () => {
    return gulp.src(`${dirs.build}/**/*.html`, { read: false })
        .pipe(clean());
});

gulp.task('html:release', ['cleanHTML'], () => {
    return gulp.src(`${dirs.src}/**/*.html`)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dirs.build))
});

gulp.task('html', ['cleanHTML'], () => {
    return gulp.src(`${dirs.src}/**/*.html`)
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

gulp.task('ts-lint', () => {
    gulp.src(`${dirs.src}/scripts/*/**.ts`)
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

gulp.task('scripts', ['cleanScripts', 'ts-lint'], () => {
    return browserify({
            entries: `${dirs.src}/scripts/app.tsx`,
            debug: true
        })
        .plugin(tsify)
        .transform(babelify, {presets: ['es2015'], extensions: [ '.tsx', '.ts' ] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(`${dirs.build}/scripts`));
});

gulp.task('scripts:release', ['scripts'], () => {
    return gulp.src(`${dirs.build}/scripts/app.js`)
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest(`${dirs.build}/scripts`));
});

gulp.task('build', ['sass', 'scripts', 'html', 'images']);

gulp.task('release', ['sass:release', 'scripts:release', 'html:release', 'images']);
