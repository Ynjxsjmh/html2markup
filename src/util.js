const jsdom = require('jsdom');
const minify = require('html-minifier').minify;

// var sectionElements = [
//   'BODY', 'ARTICLE', 'SECTION', 'NAV', 'ASIDE',
//   'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
//   'HGROUP', 'HEADER', 'FOOTER', 'ADDRESS',
// ];

// var groupingElements = [
//   'P', 'HR', 'PRE', 'BLOCKQUOTE', 'MENU',
//   'OL', 'UL', 'LI', 'DL', 'DT', 'DD',
//   'FIGURE', 'FIGCAPTION', 'MAIN', 'DIV',
// ];

// var textElements = [
//   'A', 'EM', 'STRONG', 'SMALL', 'S', 'CITE',  'Q',
//   'DFN', 'ABBR', 'RUBY', 'RT', 'RP', 'DATA', 'TIME',
//   'CODE', 'VAR', 'SAMP', 'KBD', 'SUB', 'SUP ', 'I',
//   'B', 'U', 'MARK', 'BDI', 'BDO', 'SPAN', 'BR', 'WBR',
// ];

function is (node, tagNames) {
  return tagNames.indexOf(node.nodeName) >= 0;
}

function has (node, tagNames) {
  return (
    node.getElementsByTagName &&
    tagNames.some(function (tagName) {
      return node.getElementsByTagName(tagName).length;
    })
  );
}

var blockElements = [
  'ADDRESS', 'ARTICLE', 'ASIDE', 'AUDIO', 'BLOCKQUOTE', 'BODY', 'CANVAS',
  'CENTER', 'DD', 'DIR', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE',
  'FOOTER', 'FORM', 'FRAMESET', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER',
  'HGROUP', 'HR', 'HTML', 'ISINDEX', 'LI', 'MAIN', 'MENU', 'NAV', 'NOFRAMES',
  'NOSCRIPT', 'OL', 'OUTPUT', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD',
  'TFOOT', 'TH', 'THEAD', 'TR', 'UL'
];

function isBlock (node) {
  return is(node, blockElements);
}

var voidElements = [
  'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
  'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
];

function isVoid (node) {
  return is(node, voidElements);
}

function hasVoid (node) {
  return has(node, voidElements);
}

var meaningfulWhenBlankElements = [
  'A', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TH', 'TD', 'IFRAME', 'SCRIPT',
  'AUDIO', 'VIDEO'
];

function isMeaningfulWhenBlank (node) {
  return is(node, meaningfulWhenBlankElements);
}

function hasMeaningfulWhenBlank (node) {
  return has(node, meaningfulWhenBlankElements);
}

function inspectNode (node) {
  console.log(JSON.stringify(node.innerHTML));
  console.log(node.innerHTML);
  console.log(JSON.stringify(stringifyNode(node), null, 2));
}

function stringifyNode (node) {
  var infoList = [];

  node.childNodes.forEach(function (childNode, index) {
    info = {
      'nodeName': childNode.nodeName,
      'nodeType': childNode.nodeType,
      'nodeValue': childNode.nodeValue,
      'childNodeNum': childNode.childNodes.length,
      'childNodes': stringifyNode(childNode),
    };
    infoList = infoList.concat(info);
  });

  return infoList;
}


function postProcess (content) {
  content = content.trim();
  return content.replace(/[\n]{2,}/gm, '\n\n');
}


var isBrowser = (() => !(typeof process === 'object'
                         && typeof process.versions === 'object'
                         && typeof process.versions.node !== 'undefined'))();


function isHtml (str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
  var match = quickExpr.exec(str);
  return !!(match && match[1]);
}


function createDoc (html) {
  html = minify(html, {
    collapseWhitespace: true,
    removeComments: true,
  });

  if (!isBrowser) {
    const dom = new jsdom.JSDOM(html);
    return dom.window.document.body;
  } else{
    var container = document.createElement('html');
    container.innerHTML = html;
    return container;
  }
}


function extend(Child, Parent) {
  var F = function(){};
  F.prototype = Parent.prototype;

  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}


module.exports= {
  isBlock,
  isVoid,
  hasVoid,
  isMeaningfulWhenBlank,
  hasMeaningfulWhenBlank,
  postProcess,
  inspectNode,
  extend,
  isHtml,
  createDoc,
};
