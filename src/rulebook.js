
function Rulebook (options) {
  this.options = options;

  this.blankRule = {
    parser: options.blankParser
  };

  this.defaultRule = {
    parser: options.defaultParser
  };

  this.rules = [];
  for (var key in options.ruler.rules) {
    this.rules.push(options.ruler.rules[key]);
  }
}

Rulebook.prototype.forNode = function (node) {
  if (node.isBlank) return this.blankRule;
  var rule;

  if ((rule = findRule(this.rules, node, this.options))) return rule;

  return this.defaultRule;
};

function findRule (rules, node, options) {
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (filterValue(rule, node, options)) return rule;
  }
  return void 0;
}

function filterValue (rule, node, options) {
  var filter = rule.filter;

  if (typeof filter === 'string') {
    if (filter === node.nodeName.toLowerCase()) return true;
  } else if (Array.isArray(filter)) {
    if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true;
  } else if (typeof filter === 'function') {
    if (filter.call(rule, node, options)) return true;
  } else {
    throw new TypeError('`filter` needs to be a string, array, or function');
  }
}

module.exports = Rulebook;
