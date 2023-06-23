
function Ruler(markup) {
  this.markup = markup;

  this.rules = {};

  this.rules.heading = {
    match: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    parser: this.markup.parseHeading.bind(this.markup),
  };

  this.rules.paragraph = {
    match: 'p',
    parser: this.markup.parseParagraph.bind(this.markup),
  };

  this.rules.horizontalRule = {
    match: 'hr',
    parser: this.markup.parseHorizontalRule.bind(this.markup),
  };

  this.rules.blockquote = {
    match: 'blockquote',
    parser: this.markup.parseBlockQuote.bind(this.markup),
  };

  this.rules.preformattedText = {
    match: 'pre',
    parser: this.markup.parsePreformattedText.bind(this.markup),
  };

  this.rules.anchor = {
    match: 'a',
    parser: this.markup.parseAnchor.bind(this.markup),
  };

  this.rules.emphasis = {
    match: ['em', 'i', 'var'],
    parser: this.markup.parseEmphasis.bind(this.markup),
  },

  this.rules.strong = {
    match: ['strong', 'b'],
    parser: this.markup.parseStrong.bind(this.markup),
  },

  this.rules.delete = {
    match: ['del', 's'],
    parser: this.markup.parseDelete.bind(this.markup),
  },

  this.rules.insert = {
    match: ['ins', 'u'],
    parser: this.markup.parseInsert.bind(this.markup),
  },

  this.rules.ruby = {
    match: ['ruby', 'rt', 'rp'],
    parser: this.markup.parseRuby.bind(this.markup),
  },

  this.rules.code = {
    match: function (node) {
      var hasSiblings = node.previousSibling || node.nextSibling;
      var isCodeBlock = (node.parentNode.nodeName === 'PRE') && !hasSiblings;

      return node.nodeName === 'CODE' && !isCodeBlock;
    },
    parser: this.markup.parseCode.bind(this.markup),
  };

  this.rules.subscript = {
    match: 'sub',
    parser: this.markup.parseSubscript.bind(this.markup),
  },

  this.rules.superscript = {
    match: 'sup',
    parser: this.markup.parseSuperscript.bind(this.markup),
  },

  this.rules.span = {
    match: 'span',
    parser: this.markup.parseSpan.bind(this.markup),
  };

  this.rules.lineBreak = {
    match: 'br',
    parser: this.markup.parseLineBreak.bind(this.markup),
  };

  this.rules.list = {
    match: ['ul', 'ol', 'dl'],
    parser: this.markup.parseList.bind(this.markup),
  };

  this.rules.listItem = {
    match: 'li',
    parser: this.markup.parseListItem.bind(this.markup),
  };

  this.rules.descriptionTerm = {
    match: 'dt',
    parser: this.markup.parseDescriptionTerm.bind(this.markup),
  };

  this.rules.descriptionDefinition = {
    match: 'dd',
    parser: this.markup.parseDescriptionDefinition.bind(this.markup),
  };

  this.rules.table = {
    match: 'table',
    parser: this.markup.parseTable.bind(this.markup),
  };

  this.rules.caption = {
    match: 'caption',
    parser: this.markup.parseCaption.bind(this.markup),
  };

  this.rules.tableSection = {
    match: ['thead', 'tbody', 'tfoot'],
    parser: this.markup.parseTableSection.bind(this.markup),
  };

  this.rules.tableRow = {
    match: 'tr',
    parser: this.markup.parseTableRow.bind(this.markup),
  };

  this.rules.tableCell = {
    match: ['th', 'td'],
    parser: this.markup.parseTableCell.bind(this.markup),
  };

  this.rules.image = {
    match: 'img',
    parser: this.markup.parseImage.bind(this.markup),
  };

};

module.exports = Ruler;
