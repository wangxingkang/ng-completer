// Karma configuration
// Generated on Sat Sep 05 2015 11:24:25 GMT+0500 (PKT)

module.exports = function(config) {
  config.set({

    basePath: '',

    // 应用的测试框架
    frameworks: ['jasmine'],

    // 测试需要加载的js文件
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'src/ngCompleter.js',
      'tests/*.js'
    ],

    // 需要执行的文件列表
    exclude: [],

    //添加插件；
    plugins:[
      'karma-jasmine',
      'karma-chrome-launcher'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],

    // 服务端口
    port: 9876,

    colors: true,

    // 日志级别
    logLevel: config.LOG_INFO,

    // autoWatch为true,Karma将自动执行测试用例
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
};