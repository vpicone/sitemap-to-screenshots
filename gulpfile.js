const { series } = require('gulp');
const fs = require('fs');
const convert = require('xml-js');
const del = require('del');
const Pageres = require('pageres');
const mkdirp = require('mkdirp');

const resolutions = ['360x640', '1366x768'];

const screenshotsLoc = `${__dirname}/screenshots`;

const clean = async cb => {
  await del([screenshotsLoc]);
  cb();
};

const build = async cb => {
  const file = fs.readFileSync(`${__dirname}/sitemap.xml`);
  const json = convert.xml2js(file, { alwaysChildren: true, compact: true });
  const urls = json.urlset.url.map(url => url.loc._text);
  mkdirp(screenshotsLoc);

  for (const url of urls) {
    const slug = url.slice(url.search('.com') + 4);
    const subdir = `${screenshotsLoc + slug}`;
    mkdirp(subdir);
    const pageres = new Pageres();
    pageres.src(url, resolutions);
    pageres.dest(subdir);
    await pageres.run();
  }

  cb();
};

exports.build = build;
exports.default = series(clean, build);
