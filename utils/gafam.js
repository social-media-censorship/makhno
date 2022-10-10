/* this file is an utility file to wrap what is present in ../platforms
 * as it talks about the supported platforms.
 *
 * it stores the information parsed from ../platforms/** and export utilities
 * and static data.
 */
const _ = require('lodash');
const debug = require('debug')('utils:gafam');

let platforms = [], natures = [];

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

function getNature(url) {
  /* this function paese an URL and attirbute a nature
   * based on the format */
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
        domains
      }
    });
    debug('Loaded %O platforms', _.map(platforms, 'name'));

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
  getNature,

  platforms,
  natures
}
