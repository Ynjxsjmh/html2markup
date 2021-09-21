var should = require("should");

var HTML2Org = require("./../src/html2org");
var html2org = new HTML2Org();

var namespace = "HTML2Org/";


describe(namespace + "basic", function () {
  describe(namespace + "basic/emphasis", function () {
    it("fromString('<em>test</em>') should be '/test/'", function () {
      (html2org.fromString('<em>test</em>').toString()).should.eql('/test/');
    });
    it("fromString('<i>test</i>') should be '*test*'", function () {
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
  });
});
