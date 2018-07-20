'use strict';

import gulp         from 'gulp';
import gutil        from 'gulp-util';

import babel        from 'gulp-babel';
import nodemon      from 'gulp-nodemon';
import concat       from 'gulp-concat';
import uglify       from 'gulp-uglify';


import less         from 'gulp-less';
import path         from 'path';

import browserSync    from 'browser-sync';

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', (cb) => {
    var called = false;
    return nodemon({
        script: 'app.js',
        watch: [
            'app.js',
            'routes/**/*.js',
            'models/**/*.js',
            'config/**/*.*'
        ],
        restartable: 'rs',
        ignore: [
            '.git',
            'node_modules/**/node_modules',
            'public/components/'
        ],
        verbose: true,
        env: {
            NODE_ENV: 'development'
        },
        ext: 'js json'
    })
    .on('start', function onStart() {
        // ensure start only got called opensource
        if (!called) { cb(); }
        called = true;
    })
    .on('restart', function onRestart() {
        // reload connected browsers after a slight delay
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], () => {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        reloadOnRestart: true,
        reloadDelay: 1000,
        files: [
            'dist/**/*.*',
            'views/**/*.*'
        ],
        port: 7000,
        open: false,
        browser: 'chrome',
        ghostMode: false
    })
});

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
           .pipe(uglify())
           .pipe(gulp.dest('dist/js'));
});

gulp.task('less', () => {
    return gulp.src([
        'src/less/app-less/app.less',
        'src/less/template-less/template.less',
        'src/less/template-less/skins/skin-wins.less'
    ])
    .pipe(less())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('watch', ['browser-sync'], () => {
    let watcher = {
        js: gulp.watch('src/js/**/*.js', ['js', browserSync.reload]),
        less: gulp.watch('src/less/**/*.less', ['less', browserSync.reload]),
        view: gulp.watch('view/**/*.ejs', ['bs-reload'])
    }

    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
    }
});

gulp.task('default', ['js', 'less', 'watch'], () => {
    gutil.log('Gulp is running');
});
