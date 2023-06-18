
function extend(Child, Parent) {
  var F = function(){};
  F.prototype = Parent.prototype;

  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}

function Markup(syntax) {
  this.syntax = syntax;
}

Markup.prototype = {
  parseHeading: function (content, node) {
    var hLevel = parseInt(node.nodeName.charAt(1));

    return '\n\n' + this.syntax.heading.repeat(hLevel) + ' ' + content + '\n\n';
  },

  parseParagraph: function (content, node) {
    return '\n\n' + content + '\n\n';
  },

  parseHorizontalRule: function (content, node) {
    return '\n\n' + this.syntax.horizontalRule + '\n\n';
  },

  parsePreformattedText: function (content, node) {
    return this.syntax.codeBlock;
  },

  parseBlockQuote: function (content, node) {
    return ('\n\n' + this.syntax.blockquote + '\n' + content
            + '\n' + this.syntax.blockquote + '\n\n');
  },

  parseOrderedList: function (content, node) {
    throw 'No implementation';
  },

  parseUnorderedList: function (content, node) {
    throw 'No implementation';
  },

  parseListItem: function (content, node) {
    throw 'No implementation';
  },

  parseAnchor: function (content, node) {
    if (node.href) {
      return `${content}(${node.href})`;
    } else {
      return content;
    }
  },

  parseEmphasis: function (content, node) {
    return syntax.emphasis + content + syntax.emphasis;
  },

  parseStrong: function (content, node) {
    return syntax.strong + content + syntax.strong;
  },

  parseStrikethrough: function (content, node) {
    return syntax.strike + content + syntax.strike;
  },

  parseCitation: function (content, node) {
    throw 'No implementation';
  },

  parseInlineQuotation: function (content, node) {
    throw 'No implementation';
  },

  parseCode: function (content, node) {
    return syntax.code + content + syntax.code;
  },

  parseSubscript: function (content, node) {
    return syntax.sub + content + syntax.sub;
  },

  parseSuperscript: function (content, node) {
    return syntax.sup + content + syntax.sup;
  },

  parseUnderline: function (content, node) {
    return syntax.underline + content + syntax.underline;
  },

  parseSpan:  function (content, node) {
    return content;
  },

  parseLineBreak: function (content, node) {
    return '\n';
  },

  parseImage: function (content, node) {
    throw 'No implementation';
  },

  parseTable: function (content, node) {
    throw 'No implementation';
  },

  parse: function (content, node) {
    throw 'No implementation';
  },

};


function Orgmode(syntax) {
  this.syntax = syntax;
}
extend(Orgmode, Markup);

Object.assign(Orgmode.prototype, {

  parsePreformattedText : function (content, node) {
    var className = ((node.getAttribute('class') || '').trim() + ' '
                     + (node.firstChild.nodeName === 'CODE' ?
                        (node.firstChild.getAttribute('class') || '') : '').trim() + ' '
                     + (node.parentNode.getAttribute('class') || '')
                    );
    var langs = (Array.from(className.matchAll(/(src|language|lang|highlight-source)-(\S+)/g))
                   .map(match => match[2]));
    var lang  = langs.sort((a, b) => b.length - a.length)[0] || '';
    return ('\n\n' + this.syntax.preOpen + ` ${lang}` + '\n'
            + content.replace(/^\n|\n$/g, '') + '\n'
            + this.syntax.preClose + '\n\n');
  },

  parseList: function (content, node) {
    var parent = node.parentNode;
    if (parent.nodeName === 'LI') {
      // Line break for nested list
      return '\n' + content;
    } else {
      return '\n\n' + content + '\n\n';
    }
  },

  parseListItem: function (content, node) {
    content = (content
               //.replace(/^\n+/, '')       // remove leading newlines
               //.replace(/\n+$/, '\n')     // replace trailing newlines with just a single one
               .replace(/\n/gm, '\n  ')); // indent

    var prefix = '- ';
    var parent = node.parentNode;
    if (parent.nodeName === 'OL') {
      var start = parent.getAttribute('start');
      var index = Array.prototype.indexOf.call(parent.children, node);
      prefix = (start ? Number(start) + index : index + 1) + '. '
        + ((parent.firstElementChild === node) && start ? `[@${start}]` : '');
      content = content.replace(/\n/gm, '\n' + ' '.repeat(prefix > 9 ? 2 : 1));
    }
    return (
      prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
    );
  },

  parseTable: function (content, node) {
    return `\n\n${content}\n\n`;
  },

  parseCaption: function (content, node) {
    return `#+CAPTION: ${content}\n`;
  },

  parseTableSection: function (content, node) {
    if (node.nodeName == 'THEAD') {
      return this.parseTableHead(content, node);
    } else {
      return `${content}`;
    }
  },

  parseTableHead: function (content, node) {
    var thCount = node.querySelector('tr').querySelectorAll('th').length;
    return content + '|' + '-+'.repeat(thCount-1) + '-|\n';
  },

  parseTableRow: function (content, node) {
    return `${content}\n`;
  },

  parseTableCell: function (content, node) {
    if (node === node.parentNode.firstElementChild) {
      return `|${content}|`;
    } else {
      return `${content}|`;
    }
  },

  parse: function (content, node) {
    throw 'No implementation';
  },

  parse: function (content, node) {
    throw 'No implementation';
  },

});

module.exports = {
  Orgmode,
};
