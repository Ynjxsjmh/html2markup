
// https://orgmode.org/org.html#Markup-for-Rich-Contents

var orgSyntax = {};

orgSyntax.strong = '*';
orgSyntax.code = '~';
orgSyntax.heading  = '*';
orgSyntax.emphasis = '/';
orgSyntax.delete = '+';
orgSyntax.verbatim = '=';
orgSyntax.insert = '_';
orgSyntax.horizontalRule = '-----';

orgSyntax.sub = (text) => `_{${text}}`;
orgSyntax.sup = (text) => `^{${text}}`;

orgSyntax.unorderedList = '-';
// Description list items are unordered list items,
// and contain the separator ‘::’ to distinguish the description term from the description.
orgSyntax.descriptionList = '::';

orgSyntax.link = (link, desc) => `[[${link}][${desc}]]`;
orgSyntax.image    = (image) => `[[${image}]]`;
orgSyntax.imageAlt = (image, alt) => `[[${image}][${alt}]]`;

orgSyntax.inlineCode = (lang, text) => `src_${lang}[:exports code]{${text}}`;
orgSyntax.inlineHTML = (html) => `@@html:${html}@@`;
orgSyntax.inlineHTMLOpen = '@@html:';
orgSyntax.inlineHTMLClose = '@@';
orgSyntax.preOpen    = '#+BEGIN_SRC';
orgSyntax.preClose   = '#+END_SRC';
orgSyntax.quoteOpen  = '#+BEGIN_QUOTE';
orgSyntax.quoteClose = '#+END_QUOTE';


module.exports = orgSyntax;
