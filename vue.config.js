module.exports = {
  pages: {
    index: 'src/main.ts',
    preferences: 'src/preferences.ts'
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // This fixes an issue where some ESNext features wouldn't be available
      // https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/1432
      chainWebpackMainProcess: config => {
        config.module
          .rule('babel')
          .before('ts')
          .use('babel')
          .loader('babel-loader')
          .options({
            presets: [['@babel/preset-env', { modules: false }]],
            plugins: ['@babel/plugin-proposal-class-properties']
          })
      }
    }
  }
}