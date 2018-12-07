const request = require('request-promise');
const cheerio = require('cheerio');

const { metaExtractor, resultsExtractor } = require('./extractors');

const urlBuilder = (page = 1, query = '') => ({
 uri: `https://kenney.nl/assets/page:${page}/?q=${query}`,
 transform: body => cheerio.load(body),
});

module.exports = ({ page, query }) =>
  new Promise((resolve, reject) =>  {
    request(urlBuilder(page, query))
      .then($ => {

        const data = {
          'meta': metaExtractor($),
          'results': resultsExtractor($),
        };

        resolve(data);
      })
      .catch(err => reject(err));
  });
