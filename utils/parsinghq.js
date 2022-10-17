const _ = require('lodash');
debug = require('debug')('utils:parsinghq');

function rawmatch(input, lookfor) {
  const re = new RegExp(lookfor);
  // debug("lookfor [%s] is [%s]", lookfor, re.test(input));
  return re.test(input);
}

function shouldBe(accumulated, subject) {
  const previous = _.last(accumulated);
  // debug("shouldBe %O subject %s", subject); 
  return (previous == subject);
};

function querySelector(d, subject) {
  const node = d.querySelector(subject);
  // debug("querySelector found %s", node);
  return node;
};

function textContentBe(accumulated, subject) {
  const node = _.last(accumulated);
  if(!node)
    return false;
  // debug("textContent [%s] subject %s", node.textContent, subject); 
  return (node.textContent == subject);
};

function apply(plogic, htmlo) {
  /* the htmlo contains {
    document: <JSDOM.window.document>
    raw: <String>
   }, and plogic one of the object from YAML files.

    because they are meant to be executed in sequence,
    _.reduce is out best option to keep track of the previous output */

   const r = _.reduce(plogic, function(memo, specifics, commandNumber) {
    // specifics comes from YAML and it is like { command: subject }
    const command = _.keys(specifics)[0];
    const subject = _.values(specifics)[0];

    // pattern: some functions always take the input, other
    // the output, the formers are 'validators' the first 
    // 'producer'.
    switch(command) {
      case 'rawmatch':
        memo.output.push(rawmatch(memo.input.raw, subject))
        break;
      case 'shouldBe':
        memo.output.push(shouldBe(memo.output, subject))
        break;
      case 'querySelector':
	memo.output.push(querySelector(memo.input.document, subject));
        break;
      case 'textContentBe':
	memo.output.push(textContentBe(memo.output, subject));
        break;
      default:
        throw new Error(`Invalid command: ${command} (subject is ${subject})`);
    }
    //  debug("After executing %s: %O", command, memo.output);
    return memo;
   }, { output: [], input: htmlo });

   return _.last(r.output);
}

module.exports = {
  apply,
}
