var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream');

var paths = {
    src: ['./public/src/**/*.js']
};

gulp.task('watch', function () {
    gulp.watch(paths.src, ['build']);
});

gulp.task('build', function () {
    browserify({
        entries: './public/src/main.js',
        extensions: ['.js'],
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('default', ['watch', 'build']);
