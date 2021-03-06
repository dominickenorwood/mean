// Karma configuration
// Generated on Tue Jan 21 2014 10:55:39 GMT-0600 (Central Standard Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/javascripts/vendor/jquery/jquery.min.js',
      'public/javascripts/vendor/angular/angular.min.js',
      'public/javascripts/vendor/angular/angular-resource.min.js',
      'public/javascripts/vendor/angular/angular-route.min.js',
      'public/javascripts/directives/directives.js',
      'public/javascripts/services/services.js',
      'public/javascripts/controllers/controllers.js',
      'public/bootstrap/js/bootstrap.min.js',
      'test/vendor/angular/angular-mocks.js',
      'public/javascripts/scripts.js',
      'test/*.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['ChromeCanary'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
