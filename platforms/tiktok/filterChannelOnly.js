/* this plugin meant to pick a channel name only if there is nothing
 * else after the channel, otherwise return null */

function plugin(urlo, matched) {
  const chunks = urlo.pathname.split('/');

  if(chunks.length > 2)
    return null;

  const first = chunks[1];
  return { channel: first };
}

module.exports = {
  plugin
}
