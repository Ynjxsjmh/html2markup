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
  });

  describe(namespace + "basic/strong", function () {
    it("fromString('<strong>test</strong>') should be '*test*'", function () {
      (html2org.fromString('<strong>test</strong>').toString()).should.eql('*test*');
    });
    it("fromString('<b>test</b>') should be '*test*'", function () {
      (html2org.fromString('<b>test</b>').toString()).should.eql('*test*');
    });
  });

  describe(namespace + "basic/list", function () {
    it("Unordered list", function () {
      (html2org.fromString('<ul>\n<li>Item</li>\n<li>Item</li>\n</ul>').toString()).should.eql('- Item\n- Item');
    });
    it("Ordered list", function () {
      (html2org.fromString('<ol>\n<li>First item</li>\n<li>Second item</li>\n</ol>').toString()).should.eql('1. First item\n2. Second item');
    });
  });
});
