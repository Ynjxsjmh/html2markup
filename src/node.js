const util = require('./util');

function Node (node) {
  node.isBlock = util.isBlock(node);
  node.isBlank = isBlank(node);
  return node;
}

function isBlank (node) {
  return (
    !util.isVoid(node)
    && !util.isMeaningfulWhenBlank(node)
    && /^\s*$/i.test(node.textContent)
    && !util.hasVoid(node)
    && !util.hasMeaningfulWhenBlank(node)
  );
}

module.exports = Node;
