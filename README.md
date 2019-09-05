# crx3-webpack-plugin
a webpack plugin to bundle chrome extensions for CRX3

## API

add the plugin
```
yarn add crx3-webpack-plugin
```

require it:
```
const crx3 = require('crx3-webpack-plugin');
```

configure the plugin:
```
new crx3({
  updateUrl: 'http://extensions.getservice.com/',
  updateFilename: 'annotator.xml',
  keyFile: '../build.pem',
  contentPath: '../build',
  outputPath: '../dist',
  name: 'Annotator',
})
```


