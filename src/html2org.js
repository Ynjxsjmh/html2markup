var minify = require('html-minifier').minify;

var util = require('./util');
var Node = require('./node');
var Ruler = require('./ruler');
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
  html = minify(html, {
    collapseWhitespace: true,
  });

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
  var ruler = new Ruler(options.markup);

  var defaults = {
    ruler: ruler,
    blankParser: function (content, node) {
      return node.isBlock ? '\n\n' : '';
    },
    defaultParser: function (content, node) {
      return node.isBlock ? '\n\n' + content + '\n\n' : content;
    }
  };

  this.rulebook = new Rulebook(defaults);
}


HTML2Org.prototype = {
  fromString: function (string) {
    var doc = createDoc(string);
    var content = parseNode.call(this, doc);
    return util.forceSpacing(content);
  },

  fromPath: function (path) {
    var fs = require('fs');
    var basename = require('path').basename(path);

    if (!fs.existsSync(path)) {
      return Promise.reject('not exists file: ' + basename+'.');
    }

    var stat = fs.statSync(path);
    if (!!stat && stat.isDirectory()) {
      return Promise.reject(basename + ' is a directory.');
    }

    return new Promise(function (resolve, reject) {
      fs.readFile(path, function (err, data) {
        if (err) {
          reject(err.message);
          return;
        }
        var string = data.toString();
        if (!isHtml(string)) {
          reject(basename + ' is not a html file.');
          return;
        }
        resolve(createDoc(string));
      });
    }).then(function (dom) {
      var content = parseNode.call(this, dom);
      return util.forceSpacing(content);
    });
  }
};

function parse(node) {
  var self = this;
  var res = '';

  node.childNodes.forEach(function (childNode, index) {
    res += parseNode.call(self, new Node(childNode));
  });

  return res;
}

function parseNode(node) {
  var self = this;
  var res = '';

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  if (node.nodeType === 3) {
    // TEXT_NODE
    res = node.nodeValue;
  } else if (node.nodeType === 1) {
    // ELEMENT_NODE
    var rule = self.rulebook.forNode(node);
    var content = parse.call(self, node);
    res = rule.parser(content, node);
  }

  return res;
}

module.exports = HTML2Org;
