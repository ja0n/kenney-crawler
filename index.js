const fs = require('fs');
const flatten = require('array-flatten');
const kenney = require('./kenney');

Promise.all([1, 2, 3, 4, 5, 6].map(n => kenney({ page: n })))
  .then(data => {
    fs.writeFile('dump.json', JSON.stringify(flatten(data), null, 2), () => {});
  });
