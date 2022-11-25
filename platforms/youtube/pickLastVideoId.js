/* this is a "plugin" meant to inspect youtube URL and return,
 * if present, the videoId at the end of an URL. it works
 * in two cases (youtube.be short URL and standard video URL)
 * and should not be considered something generic */

function plugin(urlo) {
  const chunks = urlo.href.split('/');
  const last = chunks.pop();
  const match = last.match(/[A-Za-z0-9_\-]{11}/);
  return match ? { videoId: last } : null;
}

module.exports = {
  plugin
}
