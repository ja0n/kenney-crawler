const surroundingsRegex = /[\])}[{(]/g;

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
      category: anchor.next().find('span.sub').text().trim().replace(surroundingsRegex, ''),
      assets: anchor.find('.tag').text().replace(/[a-z\t\n]/gi, ''),
      title: anchor.next().get()[0].childNodes[0].nodeValue.trim(),
    };
  }).get();
  return results;
};

module.exports = { metaExtractor, resultsExtractor };
