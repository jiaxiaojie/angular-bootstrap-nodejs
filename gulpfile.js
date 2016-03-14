// JSHint stuffs:
/* global __dirname: false, require: false, JSON: false, process: false */

/*========================================
 =            Requiring stuffs            =
 ========================================*/

var gulp              = require('gulp'),
    concat            = require('gulp-concat'),
    connect           = require('gulp-connect'),
    csso              = require('gulp-csso'),
    del                = require('del'),
    jshint            = require('gulp-jshint'),
    less               = require('gulp-less'),
    mobilizer         = require('gulp-mobilizer'),
    path               = require('path-extra'),
    protractor        = require('gulp-protractor').protractor,
    releaseTasks      = require('gulp-release-tasks'),
    rename             = require('gulp-rename'),
    os                  = require('os'),
    fs                  = require('fs'),
    seq                 = require('run-sequence'),
    sourcemaps         = require('gulp-sourcemaps'),
    uglify              = require('gulp-uglify'),
    linker              = require('gulp-linker'),
    nodemon             = require('gulp-nodemon'),
    sftp                = require('gulp-sftp'),
    _                   = require('lodash'),
    gls                 = require('gulp-live-server'),
    gCssample          = require('gulp-cssample'),
    ngHtml2Js           = require("gulp-ng-html2js"),
    minifyHtml          = require("gulp-minify-html"),
    replace             = require('gulp-replace'),
    gutil               = require('gulp-util');

/*=============================
 =            Globs           =
 =============================*/

var GLOBS = {};
GLOBS.fonts                 = ['bower_components/font-awesome/fonts/fontawesome-webfont.*', 'bower_components/bootstrap/fonts/**'];
GLOBS.vendorLess            = [ path.resolve(__dirname, 'app/less'), path.resolve(__dirname, 'bower_components'), path.resolve(__dirname) ];
GLOBS.lieveServer = null;
// GLOBS.fakeServerSshConfig = {
//     host: 'fakeapi.fdjf.net',
//     port: 22,
//     user: 'wechat',
//     key : path.homedir()+'/.ssh/wechat.key'
// };
GLOBS.appConfig = JSON.parse(fs.readFileSync('config/app.json'));
// GLOBS.fakeapiRemoteRootPath = '/home/wechat/www/fakeapi';
// GLOBS.fakeappRemoteRootPath = '/home/wechat/www/fakeapp';

/*================================================
 =            Report Errors to Console            =
 ================================================*/

gulp.on('error', function(e) {
    throw(e);
});

/*=========================================
 =            Clean dest folder            =
 =========================================*/

gulp.task('clean', function (cb) {
    del(['app/dist/**'], cb);
});

/*===================================================================
 =            nodemon  a new connect server            =
 ===================================================================*/

gulp.task('nodemon', function () {
    GLOBS.lieveServer = gls(path.join(__dirname, 'bin/www') , {env: {NODE_ENV: 'development'}});
    GLOBS.lieveServer.start();
    gulp.watch(['app/**'], function (file) {
        GLOBS.lieveServer.notify.apply(GLOBS.lieveServer, [file]);
        console.log('brower reload');
    });
});

gulp.task('cnodemon', function () {
    GLOBS.lieveServer = gls('bin/www', {env: {NODE_ENV: 'development'}});
    GLOBS.lieveServer.start();
    gulp.watch(['css_example/**'], function (file) {
        GLOBS.lieveServer.notify.apply(GLOBS.lieveServer, [file]);
    });
});

/*===================================================================
 =            Watch for source changes and rebuild/reload            =
 ===================================================================*/

gulp.task('watch', function () {
    // gulp.watch(['app/**', 'config/**'],['linker','yeepaylinker']);
    gulp.watch(['app/less/**'],['css:less']);
});

gulp.task('cwatch', function () {
    gulp.watch(['app/less/**'],['clinker']);
});

/*==================================
 =            Copy fonts            =
 ==================================*/

gulp.task('fonts', function() {
    return gulp.src(GLOBS.fonts)
        .pipe(gulp.dest(path.join('app', 'fonts')))
        .pipe(gulp.dest(path.join('app', 'dist', 'fonts')));
});

/*==================================
 =            Copy images            =
 ==================================*/

gulp.task('images', function() {
    return gulp.src('app/images/**')
        .pipe(gulp.dest(path.join('app', 'dist', 'images')));
});

/*====================================
 =   Compile, minify, mobilize less  =
 ====================================*/
gulp.task('css:less', function () {
    return gulp.src(['app/less/app-base.less'])
            .pipe(less({paths: GLOBS.vendorLess}))
            .pipe(mobilizer('app-base.css', {
                'app-base.css': { hover: 'exclude', screens: ['0px'] }
            }))
            .pipe(gulp.dest('app/css/'));
});

gulp.task('css:minify', function() {
    return gulp.src('app/css/**')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join('app', 'dist', 'css')));
});

/*====================================================================
 =            Compile and minify js generating source maps            =
 ====================================================================*/

gulp.task('js:minify',  function() {
    var serverConfig =  fs.readFileSync(__dirname+'/config/app.json', 'utf8')+';';
    var logConfig = fs.readFileSync(__dirname+'/config/log.json', 'utf8')+';';
    return gulp.src([
        'bower_components/ua-parser-js/dist/ua-parser.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-touch/angular-touch.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-ui-bootstrap/dist/ui-bootstrap-custom-*.js',
        '!bower_components/angular-ui-bootstrap/dist/ui-bootstrap-custom-*.min.js',
        '!bower_components/angular-ui-bootstrap/dist/ui-bootstrap-custom-tpls-*.js',
        'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
        'bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.min.js',
        'bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js',
        'bower_components/ui-router-extras/release/ct-ui-router-extras.min.js',
        'bower_components/angular-post-message-qt/dist/angular-post-message.min.js',
        'bower_components/angular-base64/angular-base64.min.js',
        'bower_components/angular-md5/angular-md5.min.js',
        'app/scripts/app.js','app/scripts/*.js','app/scripts/*/*.js','app/scripts/*/*/*.js','!app/scripts/*/*.spec.js','!app/scripts/*/*/*.spec.js'])
        .pipe(replace('/*--app config--*/', 'window.SERVERCONF='+serverConfig+';'))
        .pipe(replace('/*--log config--*/', 'window.LOGCONF='+logConfig+';'))
        .pipe(replace(/\,[\s]*[\"]?deployServer[\"]?:\{[^\}]*\}/, ''))
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join('app', 'dist', 'js')))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join('app', 'dist', 'js')));
});

gulp.task('js:templates:view', function () {
   return gulp.src(['app/scripts/views/**'])
       .pipe(minifyHtml({
           empty: true,
           spare: true,
           quotes: true
       }))
       .pipe(ngHtml2Js({
           moduleName: "hsWechat.tpls",
           prefix: "scripts/views/"
       }))
       .pipe(sourcemaps.init())
       .pipe(concat('view.tpls.js'))
       .pipe(replace('__IMG_VERSION__','version='+GLOBS.appConfig.version))
       .pipe(replace('__IMG_BASE__',GLOBS.appConfig.appRootUrl))
       .pipe(uglify())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest(path.join('app', 'dist', 'js')))
       .pipe(sourcemaps.write('.'))
       .pipe(gulp.dest(path.join('app', 'dist', 'js')));
});

gulp.task('js:templates:directive', function () {
   return gulp.src(['app/scripts/directives/*.tpl.html'])
       .pipe(minifyHtml({
           empty: true,
           spare: true,
           quotes: true
       }))
       .pipe(ngHtml2Js({
           moduleName: "hsWechat.tpls",
           prefix: "scripts/directives/"
       }))
       .pipe(sourcemaps.init())
       .pipe(concat('directive.tpls.js'))
       .pipe(uglify())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest(path.join('app', 'dist', 'js')))
       .pipe(sourcemaps.write('.'))
       .pipe(gulp.dest(path.join('app', 'dist', 'js')));
});

/*====================================
 =            Developer Linker       =
 ====================================*/
gulp.task('linker', function(done){
    var serverConfig = fs.readFileSync(__dirname+'/config/app.json', 'utf8');
    var logConfig = fs.readFileSync(__dirname+'/config/log.json', 'utf8');

    return gulp.src('app/_index.html')
        .pipe(linker({
            scripts:[
                'bower_components/ua-parser-js/dist/ua-parser.min.js',
                'bower_components/angular/angular.js',
                'bower_components/angular-animate/angular-animate.js',
                'bower_components/angular-touch/angular-touch.js',
                'bower_components/angular-ui-router/release/angular-ui-router.js',
                'bower_components/angular-ui-bootstrap/dist/ui-bootstrap-custom-*.js',
                '!bower_components/angular-ui-bootstrap/dist/ui-bootstrap-custom-*.min.js',
                '!bower_components/angular-ui-bootstrap/dist/ui-bootstrap-custom-tpls-*.js',
                'bower_components/angular-local-storage/dist/angular-local-storage.js',
                'bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js',
                'bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.js',
                'bower_components/ui-router-extras/release/ct-ui-router-extras.js',
                'bower_components/angular-post-message-qt/dist/angular-post-message.js',
                'bower_components/angular-base64/angular-base64.js',
                'bower_components/angular-md5/angular-md5.min.js'
            ],
            startTag: '<!--bower js-->',
            endTag: '<!--bower js end-->',
            fileTmpl: '<script src="/%s" type="text/javascript"></script>',
            appRoot: 'bower_components/'
        }))
        .pipe(linker({
            scripts:[
                'bower_components/angular-carousel/dist/angular-carousel.css'
            ],
            startTag: '<!--bower css-->',
            endTag: '<!--bower css end-->',
            fileTmpl: '<link crossorigin="anonymous" href="/%s" media="all" rel="stylesheet" />',
            appRoot: 'bower_components/'
        }))
        .pipe(linker({
            scripts:['app/scripts/app.js','app/scripts/*.js','app/scripts/*/*.js','app/scripts/*/*/*.js','!app/scripts/*/*.spec.js','!app/scripts/*/*/*.spec.js'],
            startTag: '<!--app js-->',
            endTag: '<!--app js end-->',
            fileTmpl: '<script src="/%s" type="text/javascript"></script>',
            appRoot: 'app/'
        }))
        .pipe(linker({
            scripts:['app/css/*.css'],
            startTag: '<!--css-->',
            endTag: '<!--css end-->',
            fileTmpl: '<link crossorigin="anonymous" href="/%s" media="all" rel="stylesheet" />',
            appRoot: 'app/'
        }))
        .pipe(replace('/*--app config--*/', 'window.SERVERCONF='+serverConfig+';'))
        .pipe(replace('/*--log config--*/', 'window.LOGCONF='+logConfig+';'))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('app'));
});

gulp.task('clinker', function (done) {
    var markdown = require('gulp-markdown');
    var marked = require('gulp-markdown/node_modules/marked');
    var renderer = new marked.Renderer();
    renderer.codespan = function (text) {
        return '<pre><code>' + text + '</code></pre>';
    };//need pre tag
    var fs = require('fs');
    return gulp.src(['app/less/**']).pipe(gCssample(null))
        .pipe(linker({
            scripts:['app/less/framework.less'],
            startTag: '<!--frameworkcss-->',
            endTag: '<!--frameworkcss end-->',
            fileTmpl: '<link crossorigin="anonymous" href="/%s" media="all" rel="stylesheet/less" type="text/css" />',
            appRoot: 'app/'
        }))
        .pipe(rename('index.html'));
        // .pipe(gulp.dest('./css_example'));
});

gulp.task('buildlinker', function(done){
    return gulp.src('app/_index.html')
        .pipe(linker({
            scripts:['app/dist/js/*.js'],
            startTag: '<!--app js-->',
            endTag: '<!--app js end-->',
            fileTmpl: '<script src="/%s?v='+GLOBS.appConfig.version + '" type="text/javascript"></script>',
            appRoot:GLOBS.appConfig.appRoot
        }))
        .pipe(linker({
            scripts:['app/dist/css/*.css'],
            startTag: '<!--css-->',
            endTag: '<!--css end-->',
            fileTmpl: '<link crossorigin="anonymous" href="/%s?v='+GLOBS.appConfig.version+'" media="all" rel="stylesheet" />',
            appRoot:GLOBS.appConfig.appRoot
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(path.join('app','dist')));
});

/*====================================
 =            Docs                   =
 ====================================*/

// gulp.task('docs', function(done){
//     var gulpDocs = require('gulp-ngdocs');
//     var options = {
//         html5Mode: false
//     };
//     return gulp.src(['app/scripts/*.js','app/scripts/*/*.js'])
//         .pipe(gulpDocs.process(options))
//         .pipe(gulp.dest('./docs'))
//         .pipe(sftp(_.extend({remotePath:GLOBS.fakeapiRemoteRootPath+'/docs'}, GLOBS.fakeServerSshConfig)));
// });

// gulp.task('cssdocs', function(done){
//     gulp.src(['css_example/**'])
//         .pipe(sftp(_.extend({remotePath:GLOBS.fakeapiRemoteRootPath+'/css_example'}, GLOBS.fakeServerSshConfig)));
//     gulp.src(['app/less/**'])
//         .pipe(sftp(_.extend({remotePath:GLOBS.fakeapiRemoteRootPath+'/app/less'}, GLOBS.fakeServerSshConfig)));

// });

/*====================================
 =            Default Task            =
 ====================================*/

gulp.task('default', function(done){
    var tasks = [];
    tasks.push('nodemon');
    tasks.push('watch');
    seq('css:less', 'linker',tasks,done);
});

gulp.task('csstest', function(done){
    var tasks = [];

    tasks.push('cnodemon');
    tasks.push('cwatch');
    seq('clinker',tasks,done);
});

gulp.task('build', function(done){
    seq('css:less', ['css:minify','js:minify', 'js:templates:view', 'js:templates:directive', 'fonts','images','build:info'],'buildlinker',done);
});

// gulp.task('deploy:fake:upload', function () {
//     return gulp.src(['app/dist/**'])
//         .pipe(sftp(_.extend({remotePath:GLOBS.fakeappRemoteRootPath}, GLOBS.fakeServerSshConfig)));
// });

// gulp.task('deploy:fake', function (done) {
//     seq('build', 'deploy:fake:upload', done);
// });

gulp.task('deploy:real:upload', function () {
    return gulp.src(['app/dist/**'])
        .pipe(sftp({
            host: GLOBS.appConfig.deployServer.host,
            port: GLOBS.appConfig.deployServer.port,
            user: GLOBS.appConfig.deployServer.user,
            key : GLOBS.appConfig.deployServer.privatekey,
            remotePath: GLOBS.appConfig.deployServer.path
        }));
});

gulp.task('deploy:real', function (done) {
    seq('build', 'deploy:real:upload', done);
});

/*===============================
 =            other             =
 ===============================*/

//系统的基本信息，
gulp.task('build:info', function (done) {
    var info = {
        code : 0,
        text : 'ok',
        data : {
            version : GLOBS.appConfig.version
        }
    };
    return string_src('info.json', JSON.stringify(info))
        .pipe(gulp.dest(path.join('app','dist')));
});

//编译angular-ui-boostrap
gulp.task('angular-ui-bootstrap:build', function (done) {
    require('gulp-grunt')(gulp,{base:path.join(__dirname,'bower_components/angular-ui-bootstrap/')});
    seq('grunt-html2js','grunt-build');
});

gulp.task('angular-ui-bootstrap', function (done) {
    seq('angular-ui-bootstrap:copy', 'angular-ui-bootstrap:build');
});


/*===============================
 =            Release           =
 ===============================*/

gulp.task('exit', function(){
    process.nextTick(function() {
        process.exit(0);
    });
});

releaseTasks(gulp);

/*===============================
 =            Tools            =
 ===============================*/
/**
 * from string to gulp.src
 * @param filename
 * @param string
 * @returns {*}
 */
function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true })
    src._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
        this.push(null)
    };
    return src;
}