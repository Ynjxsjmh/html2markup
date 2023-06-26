const util = require('./util');
const Node = require('./node');
const Ruler = require('./ruler');
const Rulebook = require('./rulebook');


function parse(node) {
  var self = this;
  var res = '';

  node.childNodes.forEach(function (childNode, index) {
    res += parseNode.call(self, childNode);
  });

  return res;
}


function parseNode(node) {
  var self = this;
  var res = '';
  node = new Node(node);

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  if (node.nodeType === 3) {
    // TEXT_NODE
    res = node.nodeValue;
  } else if (node.nodeType === 1) {
    // ELEMENT_NODE
    var rule = self.rulebook.ruleFor(node);
    var content = parse.call(self, node);
    res = rule.parser(content, node);
  }

  return res;
}

function HTML2Markup(options) {
  ruler = new Ruler(options.markup);

  defaults = {
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

HTML2Markup.prototype = {
  fromString: function (string) {
    var doc = util.createDoc(string);
    var content = parseNode.call(this, doc);
    return util.postProcess(content);
  },

  fromPath: function (path) {
    const fs = require('fs');
    const basename = require('path').basename(path);

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
        if (!util.isHtml(string)) {
          reject(basename + ' is not a html file.');
          return;
        }
        resolve(util.createDoc(string));
      });
    }).then(function (dom) {
      var content = parseNode.call(this, dom);
      return util.postProcess(content);
    });
  }
};


function HTML2Orgmode(options) {
  const orgSyntax = require('./markup/org');
  const { Orgmode } = require("./parser");
  const markup = new Orgmode(orgSyntax);
  options.markup = markup;

  HTML2Markup.call(this, options);
}
util.extend(HTML2Orgmode, HTML2Markup);


module.exports = {
  HTML2Orgmode,
};
