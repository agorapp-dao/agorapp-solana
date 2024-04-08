'use strict';

const fs = require('fs/promises');
const path = require('path');
const pkg = require(__dirname + '/../package.json');

async function main() {
  await fs.mkdir(path.resolve(__dirname, '../public/content2'), { recursive: true });

  for (const dep of Object.keys(pkg.dependencies)) {
    if (dep.startsWith('@agorapp-dao/content-')) {
      console.log(`Linking public folder from ${dep}`);

      const source = path.resolve(__dirname, '../node_modules', dep, 'public');
      const target = path.resolve(__dirname, '../public/content2', path.basename(dep));

      await fs.rm(target, { recursive: true, force: true });

      await fs.symlink(source, target, 'dir');
    }
  }
}

main();
