const path = require('path')
const webpack = require('webpack')

module.exports = config => config.set({
  frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],
  reporters: ['mocha', 'coverage-istanbul'],
  preprocessors: {
    'test/unit/**/*.js': ['webpack', 'sourcemap']
  },
  webpack: {
    mode: 'none',
    devtool: 'inline-source-map',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          use: [
            {
              loader: 'raw-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: 'compressed'
                }
              }
            }
          ]
        },
        {
          test: /src\/.+\.js$/,
          exclude: /node_modules/,
          loader: 'istanbul-instrumenter-loader',
          enforce: 'post',
          options: {
            esModules: true
          }
        }
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        DEBUG: false
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: null,
        test: /\.js($|\?)/i
      })
    ]
  },
  webpackMiddleware: {
    stats: 'errors-only'
  },
  coverageIstanbulReporter: {
    fixWebpackSourcePaths: true,
    reports: [process.env.CI ? 'lcovonly' : 'html', 'text-summary']
  },
  files: [
    'test/unit/**/*.js',
    {
      pattern: 'test/fixtures/**/*',
      included: false,
      served: true
    }
  ],
  browsers: ['ChromeHeadless', 'FirefoxHeadless']
})
