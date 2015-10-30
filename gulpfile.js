var gulp = require('gulp'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	sass = require('gulp-sass'),
	packageJSON = require('./package.json'),
	semver = require('semver');

var paths = {
	dist: './public/dist',
	js: ['./public/src/**/*.js'],
	scss: ['./public/src/**/*.scss'],
	image: ['./public/src/img/**']
};

var nodeVersionIsValid = semver.satisfies(process.versions.node, packageJSON.engines.node);

if (!nodeVersionIsValid) {
	console.error('Invalid Node.js version. You need to be using ' + packageJSON.engines.node);
	process.exit();
}

gulp.task('js:watch', function () {
	gulp.watch(paths.js, ['js']);
});

gulp.task('js', function () {
	browserify({
		entries: './public/src/main.js',
		extensions: ['.js'],
		debug: true
	})
	.transform(babelify)
	.external('react')
	.external('jquery')
	.external('i18n')
	.external('silverstripe-component')
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function () {
	gulp.src('./public/src/styles/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('sass:watch', function () {
	gulp.watch(paths.scss, ['sass']);
});

gulp.task('images', function () {
	gulp.src(paths.image)
		.pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('default', ['js:watch', 'sass:watch', 'js', 'sass', 'images']);
