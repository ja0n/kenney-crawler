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

/**
 * Returns search data
 * @param {Object} config - Config object
 * @param {number} config.page - Page number
 * @param {string} config.query - Query criteria
 * @param {string} config.category - Category id ('2d', '3d', etc)
 * @returns {Promise} Promise object represents the result of the crawling
 */
function extractSearch ({ page, query, category }) {
  return request(searchUrlBuilder(page, query, category))
    .then($ => {
      const data = {
        'meta': metaExtractor($),
        'results': resultsExtractor($),
      };

      return data;
    })
}

/**
 * Returns data about specific asset
 * @param {Object} config - Config object
 * @param {string} config.assetId - Like the last section of `https://kenney.nl/assets/platformer-kit`
 * @returns {Promise} Promise object represents the result of the crawling
 */
function extractAsset ({ assetId }) {
  return request(assetUrlBuilder(assetId))
    .then($ => {
      const data = {
        'asset': assetExtractor($),
      };

      return data;
    })
}

module.exports = {
  search: extractSearch,
  getAsset: extractAsset,
  parseURL: () => null,
};
