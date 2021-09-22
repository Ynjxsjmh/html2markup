var should = require("should");

var HTML2Org = require("./../src/html2org");
var html2org = new HTML2Org();

var namespace = "HTML2Org/";


describe(namespace + "basic", function () {

  describe(namespace + "basic/emphasis", function () {
    it("fromString('<em>test</em>') should be '/test/'", function () {
      (html2org.fromString('<em>test</em>').toString()).should.eql('/test/');
    });
    it("fromString('<i>test</i>') should be '/test/'", function () {
      (html2org.fromString('<i>test</i>').toString()).should.eql('/test/');
    });
    it("fromString('<p>a<i>b</i>c</p>') should be 'a/b/c'", function () {
      (html2org.fromString('<p>a<i>b</i>c</p>').toString()).should.eql('a/b/c');
    });
  });

  describe(namespace + "basic/strong", function () {
    it("fromString('<strong>test</strong>') should be '*test*'", function () {
      (html2org.fromString('<strong>test</strong>').toString()).should.eql('*test*');
    });
    it("fromString('<b>test</b>') should be '*test*'", function () {
      (html2org.fromString('<b>test</b>').toString()).should.eql('*test*');
    });
    it("fromString('<p>a<b>b</b>c</p>') should be 'a*b*c'", function () {
      (html2org.fromString('<p>a<b>b</b>c</p>').toString()).should.eql('a*b*c');
    });
  });

  describe(namespace + "basic/edit", function () {
    it("fromString('<del>test</del>') should be '+test+'", function () {
      (html2org.fromString('<del>test</del>').toString()).should.eql('+test+');
    });
    it("fromString('<ins>test</ins>') should be '_test_'", function () {
      (html2org.fromString('<ins>test</ins>').toString()).should.eql('_test_');
    });
  });

  describe(namespace + "basic/subsup", function () {
    it("fromString('H<sub>2</sub>O') should be 'H_{2}O'", function () {
      (html2org.fromString('H<sub>2</sub>O').toString()).should.eql('H_{2}O');
    });
    it("fromString('e<sup>iπ</sup>+1=0') should be 'e^{iπ}+1=0'", function () {
      (html2org.fromString('e<sup>iπ</sup>+1=0').toString()).should.eql('e^{iπ}+1=0');
    });
  });

  describe(namespace + "basic/ruby", function () {
    it("fromString('<ruby>测<rt>cè</rt></ruby><ruby>试<rt>shì</rt></ruby>') should be '@@html:<ruby>@@测@@html:<rt>@@cè@@html:</rt>@@@@html:</ruby>@@@@html:<ruby>@@试@@html:<rt>@@shì@@html:</rt>@@@@html:</ruby>@@'", function () {
      (html2org.fromString('<ruby>测<rt>cè</rt></ruby><ruby>试<rt>shì</rt></ruby>').toString()).should.eql('@@html:<ruby>@@测@@html:<rt>@@cè@@html:</rt>@@@@html:</ruby>@@@@html:<ruby>@@试@@html:<rt>@@shì@@html:</rt>@@@@html:</ruby>@@');
    });
    it("fromString('<ruby>测<rp>（</rp><rt>cè</rt><rp>）</rp>试<rp>（</rp><rt>shì</rt><rp>）</rp></ruby>') should be '@@html:<ruby>@@测@@html:<rp>@@（@@html:</rp>@@@@html:<rt>@@cè@@html:</rt>@@@@html:<rp>@@）@@html:</rp>@@试@@html:<rp>@@（@@html:</rp>@@@@html:<rt>@@shì@@html:</rt>@@@@html:<rp>@@）@@html:</rp>@@@@html:</ruby>@@'", function () {
      (html2org.fromString('<ruby>测<rp>（</rp><rt>cè</rt><rp>）</rp>试<rp>（</rp><rt>shì</rt><rp>）</rp></ruby>').toString()).should.eql('@@html:<ruby>@@测@@html:<rp>@@（@@html:</rp>@@@@html:<rt>@@cè@@html:</rt>@@@@html:<rp>@@）@@html:</rp>@@试@@html:<rp>@@（@@html:</rp>@@@@html:<rt>@@shì@@html:</rt>@@@@html:<rp>@@）@@html:</rp>@@@@html:</ruby>@@');
    });
  });

  describe(namespace + "basic/blockquote", function () {

    it("fromString('<blockquote>test</blockquote>') should be '#+BEGIN_QUOTE\\ntest\\n#+END_QUOTE'", function () {
      (html2org.fromString('<blockquote>test</blockquote>').toString()).should.eql('#+BEGIN_QUOTE\ntest\n#+END_QUOTE');
    });

    it("fromString('<blockquote>\\n  <p>test</p>\\n  <p>test</p>\\n</blockquote>') should be '#+BEGIN_QUOTE\\ntest\\n\\ntest\\n#+END_QUOTE'", function () {
      (html2org.fromString('<blockquote>\n  <p>test</p>\n  <p>test</p>\n</blockquote>').toString()).should.eql('#+BEGIN_QUOTE\ntest\n\ntest\n#+END_QUOTE');
    });
  });

  describe(namespace + "basic/headings", function () {
    it("fromString('<h1>test</h1>') should be '* test'", function () {
      (html2org.fromString('<h1>test</h1>').toString()).should.eql('* test');
    });
    it("fromString('<h3>test</h3>') should be '*** test'", function () {
      (html2org.fromString('<h3>test</h3>').toString()).should.eql('*** test');
    });
    it("fromString('<div>\\n\\t<h1>test</h1>\\n</div>') should be '* test'", function () {
      (html2org.fromString('<div>\n\t<h1>test</h1>\n</div>').toString()).should.eql('* test');
    });
  });

  describe(namespace + "basic/list", function () {

    // Unordered list
    it("fromString('<ul><li>Item</li><li>Item</li></ul>') should be '- Item\\n- Item'", function () {
      (html2org.fromString('<ul><li>Item</li><li>Item</li></ul>').toString()).should.eql('- Item\n- Item');
    });
    it("fromString('<ul>\\n<li>Item</li>\\n<li>Item</li>\\n</ul>') should be '- Item\\n- Item'", function () {
      (html2org.fromString('<ul>\n<li>Item</li>\n<li>Item</li>\n</ul>').toString()).should.eql('- Item\n- Item');
    });

    // Ordered list
    it("fromString('<ol><li>First item</li><li>Second item</li></ol>') should be '1. First item\\n2. Second item'", function () {
      (html2org.fromString('<ol><li>First item</li><li>Second item</li></ol>').toString()).should.eql('1. First item\n2. Second item');
    });
    it("fromString('<ol>\\n<li>First item</li>\\n<li>Second item</li>\\n</ol>') should be '1. First item\\n2. Second item'", function () {
      (html2org.fromString('<ol>\n<li>First item</li>\n<li>Second item</li>\n</ol>').toString()).should.eql('1. First item\n2. Second item');
    });

    it("Unordered list nested with unordered list", function () {
      (html2org.fromString('<ul>\n  <li>\n    Item\n    <ul>\n      <li>SubItem</li>\n      <li>SubItem</li>\n    </ul>\n  </li>\n  <li>Item</li>\n</ul>\n').toString()).should.eql('- Item\n  - SubItem\n  - SubItem\n- Item');
    });

    it("Complicated nested list", function () {
      (html2org.fromString('<ul>\n  <li>Item\n    <ul>\n      <li>SubItem\n        <ol>\n          <li>First SubItem</li>\n          <li>Second SubItem</li>\n        </ol>\n      </li>\n      <li>SubItem</li>\n    </ul>\n  </li>\n  <li>Item\n    <ol>\n      <li>First SubItem\n        <ul>\n          <li>SubItem\n            <ol>\n              <li>First SubItem\n                <ol>\n                  <li>First SubItem</li>\n                  <li>Second SubItem</li>\n                </ol>\n              </li>\n              <li>Second SubItem</li>\n            </ol>\n          </li>\n          <li>SubItem</li>\n        </ul>\n      </li>\n      <li>Second SubItem\n      </li>\n    </ol>\n  </li>\n</ul>').toString()).should.eql('- Item\n  - SubItem\n    1. First SubItem\n    2. Second SubItem\n  - SubItem\n- Item\n  1. First SubItem\n    - SubItem\n      1. First SubItem\n        1. First SubItem\n        2. Second SubItem\n      2. Second SubItem\n    - SubItem\n  2. Second SubItem');
    });
  });
});
