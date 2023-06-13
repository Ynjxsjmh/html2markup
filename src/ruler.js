
function Ruler(markup) {
  this.markup = markup;

  this.rules = {};

  this.rules.paragraph = {
    match: 'p',
    parser: this.markup.parseParagraph.bind(this.markup),
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
