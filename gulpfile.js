const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const packageJSON = require('./package.json');
const semver = require('semver');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');

const PATHS = {
  JAVASCRIPT_DIST: './javascript/dist',
  JAVASCRIPT_SRC: './javascript/src',
  SCSS: './javascript/src',
  IMAGES: './javascript/src/img/**',
};

const isDev = typeof process.env.npm_config_development !== 'undefined';

const nodeVersionIsValid = semver.satisfies(process.versions.node, packageJSON.engines.node);

const browserifyOptions = {
  entries: './javascript/src/boot/index.js',
  paths: [PATHS.JAVASCRIPT_SRC],
};

const babelifyOptions = {
  presets: ['es2015', 'es2015-ie', 'react'],
  plugins: ['transform-object-assign'],
  ignore: /(node_modules|thirdparty)/,
  comments: false,
};

if (!nodeVersionIsValid) {
  // eslint-disable-next-line no-console
  console.error(`Invalid Node.js version. You need to be using ${packageJSON.engines.node}`);
  process.exit();
}

// Default Node environment to production.
process.env.NODE_ENV = isDev ? 'development' : 'production';

if (isDev) {
  browserifyOptions.debug = true;
  browserifyOptions.plugin = [watchify];
}

gulp.task('js', function bundleJavaScript() {
  return browserify(browserifyOptions)
    .transform(babelify, babelifyOptions)
    .external('components/text-field/index')
    .external('deep-freeze')
    .external('react')
    .external('jQuery')
    .external('i18n')
    .external('silverstripe-component')
    .external('silverstripe-backend')
    .external('react-dom')
    .external('react-addons-test-utils')
    .external('react-redux')
    .external('redux')
    .external('redux-thunk')
    .external('page.js')
    .external('react-addons-css-transition-group')
    .bundle()
    .on('update', bundleJavaScript)
    .on('error', notify.onError({ message: 'Error: <%= error.message %>' }))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(!isDev, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(PATHS.JAVASCRIPT_DIST));
});

gulp.task('sass', () => { // eslint-disable-line arrow-body-style
  return gulp.src('./javascript/src/styles/main.scss')
    .pipe(sass().on('error', notify.onError({ message: 'Error: <%= error.message %>' })))
    .pipe(gulp.dest(PATHS.JAVASCRIPT_DIST));
});

gulp.task('images', () => { // eslint-disable-line arrow-body-style
  return gulp.src(PATHS.IMAGES)
    .pipe(gulp.dest(`${PATHS.JAVASCRIPT_DIST}/img`));
});

gulp.task('default', ['js', 'sass', 'images'], () => {
  if (isDev) {
    gulp.watch(`${PATHS.JAVASCRIPT_SRC}/**/*.js`, ['js']);
    gulp.watch(`${PATHS.SCSS}/**/*.scss`, ['sass']);
  }
});
