/* this plugin meant to pick the videoId of a video and
 * also return the channel name as additional value */

function plugin(urlo) {
  const chunks = urlo.pathname.replace(/\?.*/, '').split('/');

  if(chunks.length !== 4)
    return null;

  const channel = chunks[1];
  const videoId = chunks[3];
  if(chunks[2] !== 'video' || !videoId.match(/[0-9].*/))
    return null;

  return {
    channel,
    videoId
  }
}

module.exports = {
  plugin
}
