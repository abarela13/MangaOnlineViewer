// == MangaHub =====================================================================================
export default {
  name: 'MangaHub',
  url: /https?:\/\/(www.)?(mangahub).io\/chapter\/.+\/.+/,
  homepage: 'https://mangahub.io/',
  language: ['English'],
  category: 'manga',
  waitEle: '#select-chapter',
  run() {
    let api: { data: { chapter: { pages: any[] } } };
    const slug = window.CURRENT_MANGA_SLUG || window.location.pathname.split('/')[2];
    const number = window.location.pathname.split('/')[3].replace('chapter-', '');
    const data = { query: `{chapter(x:m01,slug:"${slug}",number:${number}){pages}}` };
    $.ajax({
      type: 'POST',
      url: 'https://api.mghubcdn.com/graphql',
      data,
      async: false,
      success(res) {
        api = res;
      },
    });
    const images = Object.values(JSON.parse(api!.data.chapter.pages.toString()));
    return {
      title: $('#mangareader h3').text().trim(),
      series: $('#mangareader a:first').attr('href'),
      pages: images.length,
      prev: $('.previous a').attr('href'),
      next: $('.next a').attr('href'),
      listImages: images.map((i) => `https://img.mghubcdn.com/file/imghub/${i}`),
    };
  },
};
