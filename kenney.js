const request = require('request-promise');
const cheerio = require('cheerio');

const { metaExtractor, resultsExtractor, assetExtractor } = require('./extractors');

const searchUrlBuilder = (page = 1, query = '', category= '') => ({
  uri: `https://kenney.nl/assets/page:${page}?s=${query}&q=${category}`,
  transform: body => cheerio.load(body),
});

const assetUrlBuilder = (assetId = '') => ({
  uri: `https://kenney.nl/assets/${assetId}`,
  transform: body => cheerio.load(body),
});

const extractSearch = ({ page, query, category }) => new Promise((resolve, reject) => {
  request(searchUrlBuilder(page, query, category))
    .then($ => {
      const data = {
        'meta': metaExtractor($),
        'results': resultsExtractor($),
      };

      resolve(data);
    })
    .catch(err => reject(err));
});

const extractAsset = ({ assetId }) => {
  return request(assetUrlBuilder(assetId))
    .then($ => {
      const data = {
        'asset': assetExtractor($),
      };

      return data;
    })
};

module.exports = {
  search: extractSearch,
  getAsset: extractAsset,
  parseURL: () => null,
};
