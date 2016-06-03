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
  JS_DIST: './client/dist/js',
  JS_SRC: './client/src',
  SCSS_SRC: './client/src',
  SCSS_DIST: './client/dist',
};

const isDev = typeof process.env.npm_config_development !== 'undefined';

const nodeVersionIsValid = semver.satisfies(process.versions.node, packageJSON.engines.node);

const browserifyOptions = {
  entries: './client/src/boot/index.js',
  paths: [PATHS.JS_SRC],
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
    .external('components/TextField/TextField')
    .external('components/FormAction/FormAction')
    .external('deep-freeze')
    .external('lib/Config')
    .external('react')
    .external('jQuery')
    .external('i18n')
    .external('lib/SilverStripeComponent')
    .external('lib/Backend')
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
    .pipe(gulp.dest(PATHS.JS_DIST));
});

gulp.task('css', ['compile:css'], () => { // eslint-disable-line arrow-body-style
  if (isDev) {
    gulp.watch(`${PATHS.SCSS_SRC}/**/*.scss`, ['compile:css']);
  }
});

gulp.task('compile:css', () => { // eslint-disable-line arrow-body-style
  return gulp.src(`${PATHS.JS_SRC}/styles/bundle.scss`)
    .pipe(sass().on('error', notify.onError({ message: 'Error: <%= error.message %>' })))
    .pipe(gulp.dest(`${PATHS.SCSS_DIST}/styles`));
});

gulp.task('default', ['js', 'css'], () => {
  if (isDev) {
    gulp.watch(`${PATHS.JS_SRC}/**/*.js`, ['js']);
  }
});
