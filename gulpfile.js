var gulp = require('gulp'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	sass = require('gulp-sass'),
	packageJSON = require('./package.json'),
	semver = require('semver'),
	notify = require('gulp-notify');

var paths = {
	dist: './javascript/dist',
	js: ['./javascript/src/**/*.js'],
	scss: ['./javascript/src/**/*.scss'],
	image: ['./javascript/src/img/**']
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
		entries: './javascript/src/boot/index.js',
		extensions: ['.js'],
		debug: true
	})
	.transform(babelify)
	.external('react')
	.external('jQuery')
	.external('i18n')
	.external('silverstripe-component')
	.external('react-dom')
	.external('react-addons-test-utils')
	.external('react-redux')
	.external('redux')
	.external('redux-thunk')
	.bundle()
	.on('error', notify.onError({
		message: 'Error: <%= error.message %>',
	}))
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function () {
	gulp.src('./javascript/src/styles/main.scss')
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
