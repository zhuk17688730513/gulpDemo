var gulp = require('gulp');                     //引入/定义gulp
var $ = require('gulp-load-plugins')();            //它会打包基于gulp的所有插件（有了它下面这下都可以不用安装）

// var concat = require('gulp-concat');            //合并文件
// var uglify = require('gulp-uglify');            //压缩js文件
// var rename = require('gulp-rename');            //重命名文件
// var stylus = require('gulp-stylus');            //stylus预编译
// var cssClean = require('gulp-clean-css');       //压缩css文件
// var htmlMin = require('gulp-htmlMin');          //压缩html文件
// var livereload = require('gulp-livereload');    //自动编译
// var connect = require('gulp-connect');          //热加载

var open = require('open');                     //自动打开index文件


//注册合并压缩JS
gulp.task('js',function(){
    return gulp.src('./src/js/*.js')        //找到目标源文件，将数据读取到gulp内存
    .pipe($.concat('build.js'))               //合并文件
    .pipe($.uglify())                         //压缩文件
    .pipe($.rename({suffix: '.min'}))         //重命名文件
    .pipe(gulp.dest('./dist/js'))           //输出生成文件
    .pipe($.livereload())                     //实时刷新
    .pipe($.connect.reload())                 //热更新

})

//注册编译stylus文件
gulp.task('stylus',function(){
    return gulp.src('./src/css/*.styl')
    .pipe($.stylus())
    .pipe(gulp.dest('./src/css'))
    .pipe($.livereload())
    .pipe($.connect.reload()) 

})

//注册合并压缩css
gulp.task('css',['stylus'],function(){  //stylus任务作为 css任务的依赖，先执行编译stylus然后才执行合并压缩 .css文件
    return gulp.src('./src/css/*.css')
    .pipe($.concat('build.css'))
    .pipe($.cleanCss({compatibility: 'ie8'}))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
    .pipe($.livereload())
    .pipe($.connect.reload()) 

})

//注册合并压缩html
gulp.task('html',function(){
    return gulp.src('./*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
    .pipe($.livereload())
    .pipe($.connect.reload()) 

})

//注册监视任务（半自动）不使用了
gulp.task('watch',function(){
    //开启监听
    livereload.listen();
    //确认监听目标以及绑定任务
    // gulp.watch('src/js/&.js', ['js']);
    // gulp.watch(['src/css/*.styl','src/css/*.css'], ['css']);
}) 

//注册监视任务并热更新（全自动）
gulp.task('server',['default'],function(){
    //配置服务器选项
    $.connect.server({
        root: 'dist',
        livereload: true,   //实时刷新
        port: '5000'        //服务器地址
    });
    //确认监听目标以及绑定任务
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch(['src/css/*.styl','src/css/*.css'], ['css']);
    gulp.watch(['./*.html'],['html']);
    open('http://localhost:5000/')
})
gulp.task('default',["js","css","html"])