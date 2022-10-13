/* this is a more generic "plugin" meant to inspect path
 * and return the last chunk of an URL.
 * from the 'match' it takes the 'name' and use it as the
 * key for the produced object */

function plugin(urlo, match) {
  const chunks = urlo.pathname.split('/');
  const last = chunks.pop();

  /* return value takes 'name' to fill up the object */
  const rv = {};
  rv[match.name] = last;
  return rv;
}

module.exports = {
  plugin
}
