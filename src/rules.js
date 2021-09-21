var orgElem = require('./org');


var rules = {};

rules.paragraph = {
  filter: 'p',

  parser: function (content, node) {
    return '\n\n' + content + '\n\n';
  }
};

rules.lineBreak = {
  filter: 'br',

  parser: function (content, node) {
    return orgElem.horizontalLine + '\n';
  }
};

rules.heading = {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

  parser: function (content, node) {
    if (!content.trim()) return '';

    var hLevel = Number(node.nodeName.charAt(1));
    return '\n\n' + orgElem.header.repeat(hLevel) + ' ' + content + '\n\n';
  }
};

rules.emphasis = {
  filter: ['em', 'i'],

  parser: function (content, node) {
    if (!content.trim()) return '';
    return orgElem.italic + content + orgElem.italic;
  }
};

rules.strong = {
  filter: ['strong', 'b'],

  parser: function (content, node) {
    if (!content.trim()) return '';
    return orgElem.bold + content + orgElem.bold;
  }
};

rules.list = {
  filter: ['ul', 'ol', 'dl'],

  parser: function (content, node) {
    var parent = node.parentNode;
    if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
      return '\n' + content;
    } else {
      return '\n\n' + content + '\n\n';
    }
  }
};

rules.listItem = {
  filter: 'li',

  parser: function (content, node) {
    content = content
      .replace(/^\n+/, '')         // remove leading newlines
      .replace(/\n+$/, '\n')       // replace trailing newlines with just a single one
      .replace(/\n/gm, '\n    ');  // indent
    var prefix = orgElem.unorderedList + ' ';
    var parent = node.parentNode;
    if (parent.nodeName === 'OL') {
      var start = parent.getAttribute('start');
      var index = Array.prototype.indexOf.call(parent.children, node);
      prefix = (start ? Number(start) + index : index + 1) + '. ';
    }
    return (
      prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
    );
  }
};

module.exports = rules;
