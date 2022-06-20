// == HBrowser =====================================================================================
export default {
  name: 'HBrowser',
  url: /https?:\/\/(www.)?hbrowse.com\/.+/,
  homepage: 'http://www.hbrowse.com/',
  language: ['English'],
  category: 'hentai',
  run() {
    const url = window.location.href + (window.location.href.slice(-1) === '/' ? '' : '/');
    const num = $('td.pageList a, td.pageList strong').length - 1;
    const chapter = $('#chapters + table a.listLink');
    return {
      title: $('.listTable td.listLong:first').text().trim(),
      series: window.location.href.match(/.+\/[0-9]+\//),
      pages: num,
      prev: chapter
        .eq(chapter.index(chapter.filter(`[href='${window.location.href}']`)) - 1)
        .attr('href'),
      next: chapter
        .eq(chapter.index(chapter.filter(`[href='${window.location.href}']`)) + 1)
        .attr('href'),
      listPages: Array(num)
        .fill(null)
        .map((_, i) => url + String(`000${i + 1}`).slice(-4)),
      img: 'td.pageImage a img',
    };
  },
};
