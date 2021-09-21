var rules = require('./rules');
var util = require('./util');
var Node = require('./node');
var Rulebook = require('./rulebook');

var reduce = Array.prototype.reduce;
var isBrowser = (() => !(typeof process === 'object'
                         && typeof process.versions === 'object'
                         && typeof process.versions.node !== 'undefined'))();

var isHtml = function (str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
  var match = quickExpr.exec(str);
  return !!(match && match[1]);
};

var createDoc = function (html) {
  if (!isBrowser) {
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    const dom = new JSDOM(html);
    return dom.window.document;
  } else{
    var container = document.createElement('html');
    container.innerHTML = html;
    return container;
  }
};


function HTML2Org (options) {
  var defaults = {
    rules: rules,
    blankReplacement: function (content, node) {
      return node.isBlock ? '\n\n' : '';
    },
    defaultReplacement: function (content, node) {
      return node.isBlock ? '\n\n' + content + '\n\n' : content;
    }
  };

  this.rulebook = new Rulebook(defaults);
}


HTML2Org.prototype = {
  fromString: function (string) {
    var doc = createDoc(string);
    var content = parse.call(this, doc);
    return util.forceSpacing(content);
  },
};

function parse(parentNode) {
  var self = this;
  var org = '';

  parentNode.childNodes.forEach(function (node, index) {
    org += parseNode.call(self, new Node(node));
  });

  return org;
}

function parseNode(node) {
  var self = this;
  var replacement = '';

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  if (node.nodeType === 3) {
    // TEXT_NODE
    replacement = node.nodeValue;
  } else if (node.nodeType === 1) {
    // ELEMENT_NODE
    var rule = self.rulebook.forNode(node);
    var content = parse.call(self, node);
    replacement = rule.parser(content, node);
  }

  return replacement;
}

module.exports = HTML2Org;
