const { build, preview } = require('vite')

let previewServer

build({ build: { watch: {} } }).then((buildWatcher) => {
  buildWatcher.on('event', async ({ code }) => {
    if (code === 'END') {
      previewServer = previewServer || (await preview())

      console.log('\n')
      previewServer.printUrls()
    }
  })
})
