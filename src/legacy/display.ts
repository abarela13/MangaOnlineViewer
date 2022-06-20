import { IManga } from '../types/IManga';
import reader from './reader';
import { logScript, setValueGM } from '../utils/tampermonkey';
import { controls, setKeyDownEvents } from './events';
import { loadManga } from './page';
import { isNothing } from '../utils/checks';
import { settings } from './settings';

export default function display(manga: IManga, begin: number) {
  window.stop();
  if (manga.before !== undefined) {
    manga.before();
  }
  document.documentElement.innerHTML = reader(manga, begin);
  logScript('Rebuilding Site');
  setTimeout(() => {
    try {
      controls();
      setKeyDownEvents();
      setTimeout(() => {
        $(window).scrollTop(0);
        loadManga(manga, begin);
      }, 50);
      // Clear used Bookmarks
      if (!isNothing(settings.bookmarks.filter((el) => el.url === window.location.href))) {
        logScript(`Bookmark Removed ${window.location.href}`);
        settings.bookmarks = settings.bookmarks.filter((el) => el.url !== window.location.href);
        setValueGM('MangaBookmarks', JSON.stringify(settings.bookmarks));
      }
    } catch (e) {
      logScript(e);
    }
  }, 50);
  if (manga.after !== undefined) {
    manga.after();
  }
}
