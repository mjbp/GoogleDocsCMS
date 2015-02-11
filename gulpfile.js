var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var exec = require('child_process').exec;
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 7',
  'ie_mob >= 10',
  'ff >= 20',
  'chrome >= 4',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var deployOptions = {
    cacheDir: 'demo'
}

gulp.task('deploy', function () {
    return gulp.src('demo/**/*')
        .pipe(deploy(deployOptions));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/src/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('app/build/assets/img'))
    .pipe($.size({title: 'images'}));
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('css:scss', function () {
  return gulp.src(['app/src/scss/**/*.scss'])
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: ['app/src/scss']
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.pixrem())
    .pipe(gulp.dest('app/build/assets/css'))
    .pipe($.size({title: 'styles:scss'}));
});

// Output Final CSS Styles
gulp.task('css', ['css:scss']);

gulp.task('js', function() {
  gulp.src(['app/src/js/angular/angular.js',
			'app/src/js/filters/index.js',
			'app/src/js/directives/index.js',
    		'app/src/js/services/miso.ds.deps.min.0.4.0.js',
    		'app/src/js/services/data.js',
    		'app/src/js/app.js'])
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('app/build/assets/js'))
    .pipe($.size({title: 'js'}));
});

    
gulp.task('compress:js', function () {
    gulp.src('app/build/assets/js/app.js')
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.rename('app.min.js'))
        .pipe(gulp.dest('app/build/assets/js'))
        .pipe($.size({title: 'compress:js'}));
});
    
gulp.task('compress:css', function () {
    gulp.src('build/assets/css/styles.css')
        .pipe($.csso())
        .pipe($.rename('styles.min.css'))
        .pipe(gulp.dest('build/assets/css'))
        .pipe($.size({title: 'compress:css'}));
});
    
gulp.task('compress:html', function () {
    gulp.src('build/**/*.html')
        .pipe($.minifyHtml())
        .pipe(gulp.dest('build'))
        .pipe($.size({title: 'compress:html'}));
});

gulp.task('compress', ['compress:css', 'compress:js', 'compress:html']);

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'build']));

// Watch Files For Changes & Reload
gulp.task('serve', ['styles:components', 'styles:scss'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['.tmp', 'src']
    }
  });

  gulp.watch(['src/**/*.html'], reload);
  gulp.watch(['src/css/**/*.scss'], ['styles:scss']);
  gulp.watch(['{.tmp,src}/css/**/*.css'], ['styles:css', reload]);
  gulp.watch(['src/img/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: 'build'
    }

  });
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('css', ['css', 'js', 'images'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://example.com',
  strategy: 'mobile'
}));

gulp.task('watch', function () {
    gulp.watch('app/src/js/**/*.js', ['js']);
  	gulp.watch('app/src/scss/**/*', ['css']);
});



// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}