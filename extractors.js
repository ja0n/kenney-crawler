const $ = require('cheerio');

const surroundings = /[\])}[{(]/g;

const findContentContainer = $ => $('.container').eq(2);

const removeChar = (str, char) => str.replace(char, '');

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

  return {
    'query': searchInput.val(),
    'random': randomAnchor.attr('href'),
    'categories': categoryAnchors.map((index, anchor) => ({
      'label': $(anchor).text(),
      'url': $(anchor).attr('href'),
      'id': $(anchor).attr('href').split('/assets?q=')[1] || '',
    })).get(),
    'pagination': {
      'previous_url': previousPageAnchor.attr('href'),
      'next_url': nextPageAnchor.attr('href'),
      'current_page': currentPageSpan.text(),
      'total_pages': pageAnchors.last().text(),
    },
  };
};

const resultsExtractor = $ => {
  const assets = $('#content a.project');
  const regex = /url\((.*)\)/;

  const results = assets.map((index, el) => {
    const anchor = $(el);
    return {
      url: anchor.attr('href'),
      thumbnail: anchor.css('background-image').split('"')[1],
      category: anchor.next().find('span.sub').text().trim().replace(surroundings, ''),
      included_assets: anchor.find('.tag').text().replace(/[a-z\t\n]/gi, ''),
      title: anchor.next().contents().eq(0).text().trim(),
    };
  }).get();
  return results;
};

const getAttr = attr => (index, el) => $(el).attr(attr);
const clearText = text => text.trim().replace(/[×\t\n]/gi, '');
const getTextUrl = (index, el) => ({ text: $(el).text(), url: $(el).attr('href') });

const assetExtractor = $ => {
  const content = findContentContainer($);
  const metaList = content.find('.float-left ul').first();
  const downloadAnchor = content.find('.float-right a').first();
  const rows = content.find('.row');

  return {
    download_url: downloadAnchor.attr('href'),
    included_assets: clearText(metaList.children().eq(0).contents().eq(-1).text()),
    size: metaList.children().eq(1).contents().eq(-1).text().trim(),
    tags: metaList.children().eq(2).find('a').map(getTextUrl).get(),
    name: rows.eq(0).children().eq(0).find('h1').first().text(),
    description: rows.eq(0).children().eq(0).find('p').first().text(),
    includes: rows.eq(0).children().eq(0).find('h3:contains(Includes)').next().text(),
    preview: rows.eq(0).children().eq(-1).find('h3:contains(Preview)').first().siblings('a').map(getAttr('href')).get(),
    more: rows.eq(1).children().eq(0).find('h3:contains(More)').next().find('a').map(getAttr('href')).get(),
    license: clearText(rows.eq(1).children().eq(-1).find('h3:contains(License)').next().text()),
    support: rows.eq(0).children().eq(0).find('.donate-list a').map(getTextUrl).get(),
  };
}

module.exports = { metaExtractor, resultsExtractor, assetExtractor };
