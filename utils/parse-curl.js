/* This file it is similar to ./gafam.js because load 
 * YAML files from ../platforms
 */
const _ = require('lodash');
const debug = require('debug')('utils:parse-curl');
// const { computeId } = require('./various');
const { guaranteeLoading } = require('./gafam');
const { apply } = require('./parsinghq');
const { verifyConsistency } = require('./results');

const JSDOM = require("jsdom").JSDOM;

function validateCURLhtml(inputstr) {
  /* this validate the HTML and return 
   * JSDOM window.document object + the RAW version */
  try {
    const { document } = (new JSDOM(inputstr)).window;
    debug("Loaded correctly HTML of %d bytes", inputstr.length);
    return {
      document,
      raw: inputstr
    };
  } catch(error) {
    debug("Error in loading HTML with JSDOM: %s", error.message);
  }
}

function simplify(yaminpu) {
  /* the yaml input, once is parse, produce a list of objects
   * while we need an object. This function apply this 
   * conversion so the YAMLcache[platform][nature] = { object }
   * would be more accessible in further iterations */
  return _.reduce(yaminpu, function(memo, element) {
    return {
      ...memo,
      ...element,
    }
  }, {});
  /* This is the input: "logics": [
        {
          "accessible": [
            {
              "rawmatch": "\"availableCountryCodes\":"
            },
            {
              "shouldBe": 1
            }
          ]
        },
        {
          "notfound": [ 
    and should become 
    logics: { accessible: [], notfound: [], ... } */
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
        /* because of YAML flexibilities better to simplify the 
         * list of object (logics) into a more accessible object */
        const logics = simplify(parseinfos.logics ?? []);
        delete parseinfos.logics;
        /* and this set the parser information */
        _.set(YAMLcache, [ platf, natr ], {
          ...parseinfos,
          logics,
        });
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

function parse(nature, htmlo) {

  const parsedetails = loadParseYAML(
    nature.platform, nature.nature, 'curl'
  );

  debug("Parsing %s|%s with %j supported matches",
    parsedetails.platform,
    parsedetails.nature, _.keys(parsedetails.logics));

  try {
    const accessible = apply(parsedetails.logics.accessible, htmlo);
    const notfound = apply(parsedetails.logics.notfound, htmlo);
    const explicit = apply(parsedetails.logics.explicit, htmlo);

    const estimations = {
      accessible,
      notfound,
      explicit
    };

    // the verify function only produce debug so far
    const determination = verifyConsistency(estimations);
    debug("Final determination for %j is %s", estimations, determination);
    return determination;

  } catch(error) {
    debug("Error in parsing w/YAML specs (%s): %s",
      nature.href, error.message);
    throw new Error(`Error in makhno parsing logic: ${error.message}`);
  }
}

module.exports = {
  loadParseYAML,
  validateCURLhtml,
  parse,
}
