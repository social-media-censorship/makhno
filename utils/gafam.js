/* this file is an utility file to wrap what is present in ../platforms
 * as it talks about the supported platforms.
 *
 * it stores the information parsed from ../platforms/** and export utilities
 * and static data.
 */
const _ = require('lodash');
const path = require('path');
const debug = require('debug')('utils:gafam');
const { computeId } = require('./various');

let platforms = [], natures = [], platformRootDir = null;

function platformSupported(inputstr) {
  guaranteeLoading();
  if(!inputstr)
    return false;

  return !!(_.find(platforms, { name: inputstr }))
}

function natureSupported(inputstr) {
  guaranteeLoading();
  if(!inputstr)
    return false;

  throw new Error("natureSupported: not implemented yet");
}

function tryPotentialMatches(urlo, potentialMatches) {
  /* here we've only the YAML-imported codes that matched 
   * platofrm and path, so we should be really close to the 
   * match and normally the potential extractor is just 1, but
   * you never know when dealing with large platform URL styles... */
  debug("Trying %d potential nature extractor for %s",
    potentialMatches.length, urlo.href);

  const details = _.reduce(potentialMatches, function(memo, matched) {

    if(_.keys(memo).length)
      return memo;
    /* once is found keep the first good */

    /* the YAML files might have a 'param' (and it has priority),
       or a function implemented as special extraction code */
    if(matched.param?.length) {
      memo[matched.name] = urlo.searchParams.get(matched.param);
      debug("assigned detail via param as %O", memo);
    } else if(matched.function?.length) {
      /* we need to execute a function to interpret the URL */
      const functionFile = path.join(platformRootDir, matched.platform, matched.function)
      const { plugin } = require(functionFile);
      memo = plugin(urlo, matched);
      debug("assigned detail via function as %O", memo);
    }

    return memo;
  }, {});
  return details;
}

function findNature(urlo) {
  guaranteeLoading();

  /* this function process an URL() object and 
   * attirbute a nature based on the format */
  if(urlo.username.length || urlo.password.length)
    throw new Error("username and password not expected in Makhno");

  /* first step is to check if the domain is among the supported,
   * reduce keep the first platform name with a domain list that
   * includes URL.host */
  const platform = _.reduce(platforms, function(memo, o) {
    if(memo !== undefined)
      return memo;
    if(_.includes(o.domains, urlo.host))
      return o.name;
  }, undefined);

  /* if findNature return null means the URL is not supported */
  if(!platform)
    return null;

  /* once the platform is found, we should check if the domain match */
  const potentialMatches = _.filter(natures, function(o) {
    // console.log(`_.find in natures: o${JSON.stringify(o)}, p|${platform}, ${urlo.pathname}`);
    return (o.platform === platform &&
      _.startsWith(urlo.pathname, o.path) )
  }) || [];

  /* if there are not match return null as the URL is not supported */
  if(!potentialMatches.length) {
    debug("No potential matches with %s and %s",
      platform, urlo.pathname);
    return null;
  }

  /* it is a potential match because it might be more than
   * one match, and we need to find the correct 'details' */
  const details = tryPotentialMatches(urlo, potentialMatches);

  if(!_.keys(details).length) {
    debug("%s: no details extracted from %s",
      platform, urlo.href);
    return null;
  }

  /* we've all the information to compile a valid Nature */
  const nature = {
    platform,
    nature: potentialMatches[0].nature,
    details,
    supported: true,
  }
  id = computeId(JSON.stringify(nature));
  nature.id = id;
  debug("Nature is ready: %O", nature);
  return nature;
}

function guaranteeLoading(platformDir) {
  /* this function ensure the YAML files are properly 
   * loaded into the shared variables */

  if(!platforms.length && !natures.length) {
    const path = require('path');
    const fs = require('fs');

    if(!platformDir) {
      platformDir = path.join(process.cwd(), 'platforms');
      if(!fs.existsSync(platformDir)) {
        throw new Error(`Invalid path guessing for platform ${platformDir}`);
      }
    }
    // this can be used for dynamic loading by findNature, for example
    platformRootDir = platformDir;

    const domainfile = path.join(platformDir, 'domains.yaml');

    if(!fs.existsSync(domainfile)) {
      throw new Error(`domains.yaml file not found in ${domainfile}`);
    }
    debug('Loading "domains.yaml" files from %s', platformDir);

    /* P.S. yaml is explicit in package.json but part of zx */
    const yaml = require('yaml');

    const lsplatdir = fs.readdirSync(platformDir);
    /* lsplatfir contains directory with platforms, and domain.yaml */

    const domainst = fs.readFileSync(domainfile, 'utf-8');
    const listofd = yaml.parse(domainst);

    platforms = _.map(listofd, function(domains, name) {
      return {
        name,
        ...domains
      }
    });
    debug('Loaded %O platforms', _.map(platforms, 'name'));
    /* Note: $platforms has this format: [{
        "name": "youtube",
        "domains": [
          "www.youtube.com",
          "youtu.be"
        ]
      }, {
        "name": "facebook",
        "domains": [
          "www.facebook.com"
        ]
      }], useful only to link a domain to a name */

    debug('Searching Nature files in %s/*/*.yaml', platformDir);
    const yamlfiles = _.compact(_.flatten(_.map(lsplatdir, function(subd) {
      if(_.endsWith(subd, '.yaml'))
        return null;

      const subdpath = path.join(platformDir, subd);
      const filist = fs.readdirSync(subdpath);
      return _.map(filist, function(fname) {
        if(_.endsWith(fname, '.yaml')) {
          return path.join(subdpath, fname);
        } else {
          debug('Ignored file %s in %s as non-yaml', fname, subdpath);
        }
      });
    })));

    debug('Loading %d files', yamlfiles.length);
    _.each(yamlfiles, function(fullyampath) {
      const data = fs.readFileSync(fullyampath, 'utf-8');
      const nature = yaml.parse(data);
      natures.push(nature);
      debug("Imported nature [%s] from %s",
        nature.nature, fullyampath);
    })
    debug('Loaded %d Natures', natures.length);
  }

  if(!platforms.length || !natures.length) {
    throw new Error(`Unble to load data form ${platformDir}`);
  }
}

module.exports = {
  guaranteeLoading,
  platformSupported,
  natureSupported,
  findNature,

  platforms,
  natures
}
