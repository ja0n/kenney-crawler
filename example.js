const fs = require('fs');
const flatten = require('array-flatten');
const kenney = require('./index');

Promise.all([1, 2].map(n => kenney.search({ page: n })))
  .then(data => {
    fs.writeFile('dump.json', JSON.stringify(flatten(data), null, 2), () => {});
  });

kenney.getAsset({ assetId: 'castle-kit' })
  .then(data => {
    fs.writeFile('dump-asset.json', JSON.stringify(data, null, 2), () => {});
  });
