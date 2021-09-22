
// https://orgmode.org/org.html#Markup-for-Rich-Contents

var orgElem = {};

orgElem.bold = '*';
orgElem.code = '~';
orgElem.header = '*';
orgElem.italic = '/';
orgElem.strike = '+';
orgElem.verbatim = '=';
orgElem.underlined = '_';
orgElem.horizontalLine = '-----';

orgElem.sub = (text) => `_{${text}}`;
orgElem.sup = (text) => `^{${text}}`;

orgElem.unorderedList = '-';
// Description list items are unordered list items,
// and contain the separator ‘::’ to distinguish the description term from the description.
orgElem.descriptionList = '::';

orgElem.inlineCode = (lang, text) => `src_${lang}[:exports code]{${text}}`;
orgElem.inlineHTMLOpen = '@@html:';
orgElem.inlineHTMLClose = '@@';
orgElem.preOpen = '#+BEGIN_SRC';
orgElem.preClose = '#+END_SRC';
orgElem.quoteOpen = '#+BEGIN_QUOTE';
orgElem.quoteClose = '#+END_QUOTE';

module.exports = orgElem;
