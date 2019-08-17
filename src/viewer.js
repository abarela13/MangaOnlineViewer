import {
  getBrowser, getEngine, getInfoGM, logScript, logScriptC,
} from './browser';
import { controls, setKeyDownEvents } from './events';
import { checkImagesLoaded, loadManga } from './page';
import reader from './reader';
import { settings } from './settings';
import { isEmpty } from './utils';

function formatPage(manga, begin) {
  if (manga.before !== undefined) {
    manga.before();
  }
  document.documentElement.innerHTML = reader(manga, begin);
  setTimeout(() => {
    try {
      controls(manga);
      setKeyDownEvents(manga);
      checkImagesLoaded(manga);
      logScript('Site rebuild done');
      setTimeout(() => {
        $('body').scrollTo(0);
        loadManga(manga, begin);
      }, 50);
    } catch (e) {
      logScript(e);
    }
  }, 50);
  if (manga.after !== undefined) {
    manga.after();
  }
}

function lateStart(manga, begin = 1) {
  logScript('LateStart');
  Swal.fire({
    title: 'Starting MangaOnlineViewer',
    input: 'range',
    inputAttributes: {
      min: 1,
      max: manga.quant,
      step: 1,
    },
    inputValue: begin,
    text: 'Choose the Page to start from:',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    reverseButtons: true,
  }).then((result) => {
    if (result.value) {
      logScript(`Choice: ${result.value}`);
      W.stop();
      formatPage(manga, result.value);
    } else {
      logScript(result.dismiss);
    }
  });
}

// Organize the site adding place holders for the manga pages
function preparePage(manga, begin = 0) {
  logScript(`Found ${manga.quant} pages`);
  if (manga.quant > 0) {
    let beginnig = begin;
    if (beginnig === 0) {
      beginnig = settings.bookmarks// [manga.name]
        .filter((x) => x.url === W.location.href)
        .map((x) => x.page)[0] || 0;
    }
    $('head')
      .append(
        '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@8.16.0/dist/sweetalert2.all.min.js" integrity="sha256-7BOWXe6DFHEYnigBpBMkb0N31LYs/lltF8wa5O9Othw=" crossorigin="anonymous"></script>',
      );
    $('head').append(`<style type='text/css'>
#mov {
position: fixed;
left: 50%;
transform: translateX(-50%);
top: 0;
z-index: 1000;
border-radius: .25em;
font-size: 1.5em;
cursor: pointer;
display: inline-block;
margin: .3125em;
padding: .625em 2em;
box-shadow: none;
font-weight: 500;
color: #FFF;
background: rgb(102, 83, 146);
border: 1px #FFF;
}
</style>`);
    W.mov = (b) => lateStart(manga, b || beginnig);

    switch (settings.loadMode) {
      case 'never':
        $('body').append('<button id="mov" onclick=mov()>Start MangaOnlineViewer</button>');
        break;
      default:
      case 'normal':
        Swal.fire({
          title: 'Starting MangaOnlineViewer',
          text: `${beginnig
          > 1 ? `Resuming reading from Page ${beginnig}.\n` : ''}Please wait, 3 seconds...`,
          showCancelButton: true,
          cancelButtonColor: '#d33',
          reverseButtons: true,
          timer: 3000,
        }).then((result) => {
          if (result.value || result.dismiss === Swal.DismissReason.timer) {
            W.stop();
            formatPage(manga, beginnig);
          } else {
            $('body').append('<button id="mov" onclick=mov()>Start MangaOnlineViewer</button>');
            logScript(result.dismiss);
          }
        });
        break;
      case 'always':
        W.stop();
        formatPage(manga);
        break;
    }
  }
}

// Script Entry point
function start(sites) {
  logScript(
    `Starting ${getInfoGM.script.name} ${getInfoGM.script.version} on ${getBrowser()} with ${getEngine()}`,
  );
  W.InfoGM = getInfoGM;
  logScript(`${sites.length} Known Manga Sites`);
  let waitElapsed = 0;

  // Wait for something on the site to be ready before executing the script
  function waitExec(site) {
    let wait = '';
    if (site.waitMax !== undefined) {
      if (waitElapsed >= site.waitMax) {
        preparePage(site.run());
        return;
      }
    }
    if (site.waitAttr !== undefined) {
      wait = $(site.waitAttr[0]).attr(site.waitAttr[1]);
      logScript(`Wating for ${site.waitAttr[1]} of ${site.waitAttr[0]} = ${wait}`);
      if (wait === undefined || isEmpty(wait)) {
        setTimeout(() => {
          waitExec(site);
        }, site.waitStep || 1000);
        waitElapsed += site.waitStep || 1000;
        return;
      }
    }
    if (site.waitEle !== undefined) {
      wait = $(site.waitEle).get();
      logScript(`Wating for ${site.waitEle} = ${`${wait}`}`);
      if (wait === undefined || isEmpty(wait)) {
        setTimeout(() => {
          waitExec(site);
        }, site.waitStep || 1000);
        waitElapsed += site.waitStep || 1000;
        return;
      }
    }
    if (site.waitVar !== undefined) {
      wait = W[site.waitVar];
      logScript(`Wating for ${site.waitVar} = ${wait}`);
      if (isEmpty(wait)) {
        setTimeout(() => {
          waitExec(site);
        }, site.waitStep || 1000);
        waitElapsed += site.waitStep || 1000;
        return;
      }
    }
    preparePage(site.run());
  }

  logScript('Looking for a match...');
  const test = R.compose(R.map(waitExec),
    R.map(logScriptC('Site Found:')),
    R.filter((x) => R.test(x.url, W.location.href)));
  test(sites);
}

// eslint-disable-next-line import/prefer-default-export
export { start };
