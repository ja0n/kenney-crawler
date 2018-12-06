const request = require('request-promise');
const cheerio = require('cheerio');

const urlBuilder = (page = 1, query = '') => ({
 uri: `https://kenney.nl/assets/page:${page}/?q=${query}`,
 transform: body => cheerio.load(body),
});


const findContentContainer = $ => $('.container').eq(2);

const metaExtractor = $ => {
  const content = findContentContainer($);
  const searchRow = content.children().first();
  const searchInput = searchRow.children().first().find('form input').first();
  const randomAnchor = searchRow.children().first().contents('random');
  const categoryAnchors = searchRow.children().last().children('a');
  const paginationRow = content.children().last();
  const previousPageAnchor = paginationRow.find('a').first();
  const nextPageAnchor = paginationRow.find('a').last();
  const pageAnchors = paginationRow.find('a').slice(1).slice(0, -1);
  const currentPageSpan = paginationRow.find('span.active');
  debugger;

  return {
    'query': searchInput.val(),
    'random': randomAnchor.attr('href'),
    'categories': categoryAnchors.map((index, anchor) => ({
      'label': $(anchor).text(),
      'url': $(anchor).attr('href'),
    })).get(),
    'pagination': {
      'previous_url': previousPageAnchor.attr('href'),
      'next_url': nextPageAnchor.attr('href'),
      'current_page': currentPageSpan.text(),
      'total_pages': pageAnchors.last().text(),
    },
  };
};

const resultsExtracor = $ => {
  const assets = Array.from($('.col-md-12 a'));
  const regex = /url\((.*)\)/;

  const data = assets.map((el) => {
    const anchor = $(el);

    return {
      url: anchor.attr('href'),
      thumbnail: regex.exec(anchor.find('> div').css('background-image'))[1],
      label: anchor.find('> div > div:nth-child(1) > span').text(),
      title: anchor.find('> div > div:nth-child(2) > h1').text(),
      assets: anchor.find('> div > div:nth-child(2) > span').text(),
    };
  });
  return results;
};

module.exports = ({ page, query }) =>
  new Promise((resolve, reject) =>  {
    request(urlBuilder(page, query))
      .then($ => {

        const data = {
          'meta': metaExtractor($),
          'results': [],
        };

        resolve(data);
      })
      .catch(err => reject(err));
  });
