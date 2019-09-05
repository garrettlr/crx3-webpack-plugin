const fs = require('fs');
const path = require('path');
const join = path.join;
const crx3 = require('crx3');

class Plugin {
  constructor(options) {
    this.options = options || {};
    if (!this.options.updateUrl) {
      this.options.updateUrl = "http://localhost:8000/";
    }
    if (!this.options.updateFilename) {
      this.options.updateFilename = "updates.xml";
    }

    // remove trailing slash
    this.options.updateUrl = this.options.updateUrl.replace(/\/$/, "");

    // setup paths
    this.context = path.dirname(module.parent.filename);
    this.keyFile = path.isAbsolute(this.options.keyFile) ? this.options.keyFile : join(this.context, this.options.keyFile);
    this.outputPath = path.isAbsolute(this.options.outputPath) ? this.options.outputPath : join(this.context, this.options.outputPath);
    this.contentPath = path.isAbsolute(this.options.contentPath) ? this.options.contentPath : join(this.context, this.options.contentPath);
    this.name = this.options.name ? this.options.name : "extension";
    // set output info
    this.crxName = this.options.name + ".crx";
    this.crxFile = join(this.outputPath, this.crxName);
    this.updateFile = join(this.outputPath, this.options.updateFilename);
    this.updateUrl = this.options.updateUrl + "/" + this.options.updateFilename;

    this.apply = this.apply.bind(this);
    this.package = this.package.bind(this);
  }

  // hook into webpack
  apply(compiler) {
    return compiler.plugin('done', () => {
      this.package(this);
    })
  }

  // package the crx.
  package() {
    crx3([`${this.contentPath}/manifest.json`], {
      keyPath: this.keyFile,
      xmlPath: `${this.outputPath}/${this.updateFilename}`,
      crxURL: this.updateUrl,
      crxPath: `${this.outputPath}/${this.name}.crx`,
    })
      .then(() => console.log('done'))
      .catch(console.error)
  }
}
module.exports = Plugin;