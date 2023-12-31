const util = require('./util');


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

  parseAnchor: function (content, node) {
    var href  = node.getAttribute('href');
    var title = node.getAttribute('title');
    title = title ? `#+ATTR_HTML: :title ${title}\n` : '';
    return title + this.syntax.link(href, content);
  },

  parseEmphasis: function (content, node) {
    return this.syntax.emphasis + content + this.syntax.emphasis;
  },

  parseStrong: function (content, node) {
    return this.syntax.strong + content + this.syntax.strong;
  },

  parseDelete: function (content, node) {
    return this.syntax.delete + content + this.syntax.delete;
  },

  parseInsert: function (content, node) {
    return this.syntax.insert + content + this.syntax.insert;
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
    return this.syntax.sub + content + this.syntax.sub;
  },

  parseSuperscript: function (content, node) {
    return this.syntax.sup + content + this.syntax.sup;
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
util.extend(Orgmode, Markup);

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

  parseBlockQuote: function (content, node) {
    return ('\n\n' + this.syntax.quoteOpen + '\n'
            + content.replace(/^\n+|\n+$/g, '') + '\n'
            + this.syntax.quoteClose + '\n\n');
  },

  parseRuby: function (content, node) {
    var open = this.syntax.inlineHTMLOpen + `<${node.tagName.toLowerCase()}>` + this.syntax.inlineHTMLClose;
    var close = this.syntax.inlineHTMLOpen + `</${node.tagName.toLowerCase()}>` + this.syntax.inlineHTMLClose;
    return open + content + close;
  },

  parseCode: function (content, node) {
    var code = content.includes("~") ? this.syntax.verbatim : this.syntax.code;
    return code + content + code;
  },

  parseSubscript: function (content, node) {
    return this.syntax.sub(content);
  },

  parseSuperscript: function (content, node) {
    return this.syntax.sup(content);
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

  parseDescriptionTerm: function (content, node) {
    return `- ${content} ::`;
  },

  parseDescriptionDefinition: function (content, node) {
    if (node.previousSibling.nodeName === 'DT' && node.nextSibling && node.nextSibling.nodeName === 'DD') {
      return `\n  - ${content}`;
    } else if (node.previousSibling.nodeName === 'DD' && node.nextSibling && node.nextSibling.nodeName === 'DD') {
      return `\n  - ${content}`;
    } else if (node.previousSibling.nodeName === 'DD' && node.nextSibling === null) {
      return `\n  - ${content}`;
    } else if (node.previousSibling.nodeName === 'DD' && node.nextSibling.nodeName === 'DT') {
      return `\n  - ${content}\n`;
    } else if (node.previousSibling.nodeName === 'DT' && node.nextSibling === null) {
      return ` ${content}`;
    } else if (node.previousSibling.nodeName === 'DT' && node.nextSibling.nodeName === 'DT') {
      return ` ${content}\n`;
    } else {
      return `${content}`;
    }
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

  parseImage: function (content, node) {
    var alt = node.getAttribute('alt') || '';
    var src = node.getAttribute('src') || '';
    var title = node.getAttribute('title');

    var image = alt ? this.syntax.imageAlt(src, alt) : this.syntax.image(src);

    title = title ? `#+CAPTION: ${title}\n` : '';

    return title + image;
  },

  parse: function (content, node) {
    throw 'No implementation';
  },

});

module.exports = {
  Orgmode,
};
