/* this is a "plugin" meant to inspect URL format in the case 
 * the URL parameters aren't enough to decode the nature of an URL */

function plugin(urlo) {
  const chunks = urlo.href.split('/');
  const end = chunks.pop();
  const previous = chunks.pop();
  return { end, previous };
}

module.exports = {
  plugin
}
