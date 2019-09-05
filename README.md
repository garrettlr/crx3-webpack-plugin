# crx3-webpack-plugin
A Webpack plugin to bundle chrome extensions for CRX3. The api is essentially identical to [crx-webpack-plugin](https://github.com/johnagan/crx-webpack-plugin), and you can simply swap the two and go.

## Inspired or enabled by the following projects:
[crx-webpack-plugin](https://github.com/johnagan/crx-webpack-plugin)

[crx3](https://github.com/ahwayakchih/crx3)

## API

add the plugin
```
yarn add -D crx3-webpack-plugin
```

require it:
```javascript
const crx3 = require('crx3-webpack-plugin');
```

configure the plugin:
```javascript
// webpack.config.js

module.exports = {
  entry: //...,
  output: //...,
  plugins: [
    new crx3({
      updateUrl: 'url-to-update.xml',
      updateFilename: 'update.xml',
      keyFile: './build.pem',
      contentPath: './build',
      outputPath: './dist',
      name: 'my-extension.crx',
      zip: true,
      browserVersion: '64.0.3242'
   })
  ]
}
```


### Configuration Settings:

| Option | Required | Type | Default | About |
|---|---|---|---|---|
| contentPath |  yes | string | none  | location of build files. should be the webpack output folder to consume your bundle(s). |
| outputPath |  yes | string | none  | where to export the built extension.  |
| keyFile | no | string | generates build.pem | a private key required to update the extension. |
| name | no | string | 'crx' | the name of the built extension |
| updateUrl | no | string | none | where to find updates.xml |
| updateFilename | no | string | name | filename for updates.xml |
| zip | no | boolean | false | provides a zip of the build files along with the CRX. |
| browserVersion | no | string | none | specify a minimum browser version for the app. |


Note: your build process should copy your manifest.json to outputPath before the plugin runs, or it will fail.



### Important Note: CRX_REQUIRED_PROOF_MISSING
See [crx3](https://github.com/ahwayakchih/crx3#issues) for further details. Essentially, due to tightening regulations regarding the sources of chrome extensions, most users will be unable to install extensions built with this plugin, and it will be difficult to update them. This plugin therefore is probably not suitable for public Chrome Extensions. Your best bet is probably to bundle your application via Webpack and build and distribute manually through the web store. This plugin is useful for managing enterprise plugins however, provided that you're able to enforce a [managed policy](https://support.google.com/chrome/a/answer/2657289?hl=en&ref_topic=9027936).




