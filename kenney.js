const request = require('request-promise');
const cheerio = require('cheerio');

const urlBuilder = (page = 1, query = '') => ({
 uri: `http://kenney.nl/assets/page:${page}/?q=${query}`,
 transform: body => cheerio.load(body),
});

request(urlBuilder())
  .then($ => {
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

    console.log(data);

    return data;
  })
  .catch(err => {
    
    
  });


module.exports = ({ page, query }) =>
  new Promise((resolve, reject) =>  {
    request(urlBuilder(page, query))
      .then($ => {
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

        resolve(data);
      }).catch(err => reject(err));
  });
