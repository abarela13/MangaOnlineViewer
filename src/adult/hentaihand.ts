// == HentaiHand ==================================================================================
export default {
  name: 'HentaiHand',
  url: /https?:\/\/(www.)?hentaihand.com\/viewc\/[0-9]+\/[0-9]+/,
  homepage: 'https://hentaihand.com/',
  language: ['English'],
  category: 'hentai',
  waitVar: 'model',
  run() {
    return {
      title: window.model.title.replace(' - Page {page}', ''),
      series: $('.back-to-gallery a').attr('href'),
      pages: Object.keys(window.images as object).length,
      prev: '#',
      next: '#',
      listImages: Object.values(window.images as object),
    };
  },
};
