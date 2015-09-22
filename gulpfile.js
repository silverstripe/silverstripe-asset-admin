var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream');

var paths = {
    javascript: ['./javascript/src/**/*.js']
};

gulp.task('watch', function () {
    gulp.watch(paths.javascript, ['build']);
});

gulp.task('build', function () {
    browserify({
        entries: './javascript/src/main.js',
        extensions: ['.js'],
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./javascript/dist'));
});

gulp.task('default', ['watch', 'build']);
