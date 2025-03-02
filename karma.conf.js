module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-scss-preprocessor') // Add this line
    ],
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true,
    reporters: ['progress', 'kjhtml'],
    preprocessors: {
      // Add SCSS preprocessing
      '**/*.scss': ['scss']
    },
    scssPreprocessor: {
      // Optional: You can also add specific configurations for SCSS preprocessing
      includePaths: ['src/styles']
    }
  });
};
