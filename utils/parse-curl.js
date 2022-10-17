/* This file it is similar to ./gafam.js because load 
 * YAML files from ../platforms
 */
const _ = require('lodash');
const debug = require('debug')('utils:parse-curl');
const { computeId } = require('./various');
const { guaranteeLoading } = require('./gafam');

const JSDOM = require("jsdom").JSDOM;

function validateCURLhtml(inputstr) {
  /* this validate the HTML and return 
   * JSDOM window.document object */
  try {
    const { document } = (new JSDOM(inputstr)).window;
    debug("Loaded correctly HTML of %d bytes", inputstr.length);
    return document;
  } catch(error) {
    debug("Error in loading HTML with JSDOM: %s", error.message);
  }
}

let YAMLcache = null;

function loadParseYAML(platform, nature) {
  /* this function returns, if is loaded, a cached version
   * of the parsing information YAML file. otherwise it caches */

  if(!YAMLcache) {
    const path = require('path');
    const fs = require('fs');
    /* P.S. yaml is not explicit in package.json but part of zx */
    const yaml = require('yaml');

    const { natures } = guaranteeLoading();
    const platformDir = path.join(process.cwd(), 'platforms');

    YAMLcache = {};
    _.map(natures, function(nobj) {
      /* I know local variable scoping but why I should
         use the same name declared in the prototype? */
      const platf = nobj.platform;
      const natr = nobj.nature;

      /* there are more than one platform+nature combo so
         we here skip duplicates */
      if(_.get(YAMLcache, [platform, nature], null))
        return;

      /* by side effect initialize the YAMLcache */
      const fp = path.join(platformDir, platf, 'curl', `${natr}.yaml`);

      /* this is the expected path,
       * check README.md section `platforms` */
      if(fs.existsSync(fp)) {
        const parsinfstr = fs.readFileSync(fp, 'utf-8');
        debug("Loaded %s: %d", fp, parsinfstr.length);
        const parseinfos = yaml.parse(parsinfstr);
        _.set(YAMLcache, [ platf, natr ], parseinfos);
      }
      else {
        debug("File %s missing", fp);
      }
    });
    debug("Completed the loading of curl-related parsing information")
  }

  const parsedet = _.get(YAMLcache, [platform, nature], null);
  if(parsedet === null)
    throw new Error(`requested combo of Nature+Platform NOT supported`);
  
  return parsedet;
}

function actualParsing(parsedetails, document) {

  if(!(parsedetails?.logics?.length >= 1)) {
    debug("Missing parsing attempts logics in %s|%s",
      parsedetails.platform,
      parsedetails.nature
    );
    throw new Error("Not actually implemented any parsing logic");
  }

  debug("Parsing %s|%s with %d attempts",
    parsedetails.platform,
    parsedetails.nature, parsedetails.logics.length);

  const results = _.map(parsedetails.logics, function(lod) {
    const nodes = document.querySelectorAll(lod);
    return nodes.length ?? 0;
  });

  debug("Parsing results: %O", results);
}

function parse(nature, document) {

  const parsedetails = loadParseYAML(
    nature.platform, nature.nature, 'curl'
  );

  try {
    return actualParsing(parsedetails, document);
  } catch(error) {
    debug("Error in parsing %s HTML: %s",
      nature.href, error.message);
  }
}

module.exports = {
  loadParseYAML,
  validateCURLhtml,
  parse,
}
