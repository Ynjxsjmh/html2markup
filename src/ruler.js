
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

  this.rules.parseSpan = {
    match: 'span',
    parser: this.markup.parseSpan.bind(this.markup),
  };

  this.rules.list = {
    match: ['ul', 'ol'],
    parser: this.markup.parseList.bind(this.markup),
  };

  this.rules.listItem = {
    match: 'li',
    parser: this.markup.parseListItem.bind(this.markup),
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

};

module.exports = Ruler;
