let Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public')
    .setPublicPath('/')
    .addEntry('app', './src/js/app.js')
    .addStyleEntry('styles', './src/scss/styles.scss')
    .enableReactPreset()
    .disableSingleRuntimeChunk()
    .enableSassLoader(function(options) {}, {
        resolveUrlLoader: false
    })
;

module.exports = Encore.getWebpackConfig();
