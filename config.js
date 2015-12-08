var tsify = require('tsify')
, babelify = require('babelify')
, config =  {

  // Settings for typescript compilation
  tsify: [tsify, {
    target: 'es6',
    noImplicitAny: true,
    sourceMap: false
  }],

  // Settings for babelify compilation
  babelify: [babelify, {
    presets: ['es2015'],
    sourceMaps: false,
    extensions: ['.ts', '.js']
  }]

};

module.exports = config;
