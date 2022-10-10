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

function findNature(urlo) {
  /* this function process an URL() object and 
   * attirbute a nature based on the format */
  if(urlo.username.length || urlo.password.length)
    throw new Error("username and password not expected in Makhno");

  /* first step is to check if the domain is among the supported,
   * reduce keep the first platform name with a domain list that
   * includes URL.host */
  const platform = _.reduce(platforms, function(memo, o, i) {
    if(memo !== undefined)
      return memo;
    if(_.includes(o.domains, urlo.host))
      return o.name;
  }, undefined);

  /* if findNature return null means the URL is not supported */
  if(!platform)
    return null;

  /* once the platform is found, we should look the url schema */
  const potentialMatch = _.find(natures, function(o) {
    console.log(o.platform, platform, o.path, urlo.pathname);
    if(o.platform !== platform)
      return false;
    if(o.path !== urlo.pathname)
      return false;
    return true;
  });

  /* if there are not match return null as the URL is not supported */
  if(!potentialMatch)
    return null;

  console.log(JSON.stringify(potentialMatch, undefined, 4));
  /* it is only a potential match because
   * we still need find the Nature 'details' */
  let details = {};

  if(potentialMatch.param?.length) {
    details[potentialMatch.name] = urlo.searchParams.get(potentialMatch.param);
  }

  if(potentialMatch.function?.length) {
    /* we need to execute a function to interpret the URL */
    const ff = path.join(platformRootDir, platform, potentialMatch.function)
    const code = require(ff);
    details = code(urlo);
  }

  if(!_.keys(details).length)
    return null;

  /* we've all the information to compile a valid Nature */
  const nature = {
    platform,
    nature: potentialMatch.nature,
    details,
    supported: true,
  }
  id = computeId(JSON.stringify(nature));
  nature.id = id;
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
      }] */

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
          debug('ignored file %d in %s as non-yaml', fname, d);
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
