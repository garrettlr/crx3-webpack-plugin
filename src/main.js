import path, { join } from 'path';
import crx3 from 'crx3';

const MANIFEST = "manifest.json";
const NAME = "crx";
const UPDATE_URL = "http://localhost:8000/";
const UPDATE_FILENAME = "updates.xml";

class Plugin {
  constructor(options) {
    this.options = options || {};
    
    if (!this.options.name) this.options.name = NAME;

    if (!this.options.updateUrl) {
      this.options.updateUrl = UPDATE_URL;
    }

    if (!this.options.updateFilename) {
      if (this.options.name) {
        this.options.updateFilename = `${this.options.name}.xml`;
      } else this.options.updateFilename = UPDATE_FILENAME;
    }
    // export a zip of the build files.
    this.zip = !!this.options.zip;

    // remove trailing slash
    this.options.updateUrl = this.options.updateUrl.replace(/\/$/, "");

    // setup paths
    this.context = path.dirname(module.parent.filename);
    this.keyFile = path.isAbsolute(this.options.keyFile) ? this.options.keyFile : join(this.context, this.options.keyFile);
    this.outputPath = path.isAbsolute(this.options.outputPath) ? this.options.outputPath : join(this.context, this.options.outputPath);
    this.contentPath = path.isAbsolute(this.options.contentPath) ? this.options.contentPath : join(this.context, this.options.contentPath);
    this.name = this.options.name

    // set output info
    this.crxName = `${this.options.name}.crx`;
    this.zipName = `${this.options.name}.zip`;

    this.crxFile = join(this.outputPath, this.crxName);
    this.zipFile = join(this.outputPath, this.zipName);
    this.manifest = join(this.contentPath, MANIFEST);
    this.updateFile = join(this.outputPath, this.options.updateFilename);
    this.updateUrl = `${this.options.updateUrl}/${this.options.updateFilename}`;
    
    // bind methods
    this.apply = this.apply.bind(this);
    this.package = this.package.bind(this);
    this.handleOptionalSettings = this.handleOptionalSettings.bind(this);
  }

  // hook into webpack
  apply(compiler) {
    return compiler.plugin('done', () => {
      this.package(this);
    })
  }

  handleOptionalSettings(options) {
    const { zip, version, browserVersion } = this.options;
    if (zip) options.zipPath = this.zipFile;
    // if (version) options.appVersion = version; not working in crx3 at the moment.
    if (browserVersion) options.browserVersion = browserVersion;
    return options;
  }

  // package the crx.
  package() {
    const options = {
      keyPath: this.keyFile,
      xmlPath: this.updateFile,
      crxURL: this.updateUrl,
      crxPath: this.crxFile,
    }
    this.handleOptionalSettings(options);

    crx3([this.manifest], options)
      .catch(console.error);
  }
}

export default Plugin;