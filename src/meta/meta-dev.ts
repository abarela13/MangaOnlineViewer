import adult from '../adult';
import main from '../main';
import { requiredScripts } from '../core/externals';

const sites = [...main, ...adult];

export default {
  name: 'MOV',
  author: 'TagoDR',
  namespace: 'https://github.com/TagoDR',
  description: 'Shows all pages at once in online view for sites',
  version: new Date().valueOf().toString(), // .slice(0, 10).replaceAll('-', '.'),
  license: 'MIT',
  'run-at': 'document-end',
  grant: [
    'unsafeWindow',
    'GM_getValue',
    'GM_setValue',
    'GM_listValues',
    'GM_deleteValue',
    'GM_xmlhttpRequest',
  ],
  noframes: 'on',
  connect: '*',
  require: requiredScripts,
  include: sites.map((s) => s.url),
} as Partial<Tampermonkey.ScriptMetadata>;
