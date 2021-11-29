module.exports = {
  pages: {
    index: 'src/main.ts',
    preferences: 'src/preferences.ts'
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
}