var should = require("should");


var { HTML2Orgmode } = require("./../src/html2markup");
var html2org = new HTML2Orgmode({});

var namespace = "HTML2Org/";


describe(namespace + "basic", function () {

  describe(namespace + "basic/emphasis", function () {
    it("em", function () {
      (html2org.fromString('<em>test</em>')).should.eql('/test/');
    });
    it("i", function () {
      (html2org.fromString('<i>test</i>')).should.eql('/test/');
    });
    it("i in paragraph", function () {
      (html2org.fromString('<p>a<i>b</i>c</p>')).should.eql('a/b/c');
    });
  });

  describe(namespace + "basic/strong", function () {
    it("strong", function () {
      (html2org.fromString('<strong>test</strong>')).should.eql('*test*');
    });
    it("b", function () {
      (html2org.fromString('<b>test</b>')).should.eql('*test*');
    });
    it("b in paragraph", function () {
      (html2org.fromString('<p>a<b>b</b>c</p>')).should.eql('a*b*c');
    });
  });

  describe(namespace + "basic/edit", function () {
    it("del", function () {
      (html2org.fromString('<del>test</del>')).should.eql('+test+');
    });
    it("s", function () {
      (html2org.fromString('<s>test</s>')).should.eql('+test+');
    });
    it("ins", function () {
      (html2org.fromString('<ins>test</ins>')).should.eql('_test_');
    });
    it("u", function () {
      (html2org.fromString('<u>test</u>')).should.eql('_test_');
    });
  });

  describe(namespace + "basic/link", function () {
    it('a', function () {
      (html2org.fromString('<a href="http://example.com">An anchor</a>')).should.eql('[[http://example.com][An anchor]]');
    });
    it('a with title', function () {
      (html2org.fromString('<a href="http://example.com" title="Title for link">An anchor</a>')).should.eql('#+ATTR_HTML: :title Title for link\n[[http://example.com][An anchor]]');
    });
  });

  describe(namespace + "basic/subsup", function () {
    it("sub", function () {
      (html2org.fromString('H<sub>2</sub>O')).should.eql('H_{2}O');
    });
    it("sup", function () {
      (html2org.fromString('e<sup>iπ</sup>+1=0')).should.eql('e^{iπ}+1=0');
    });
  });

  describe(namespace + "basic/ruby", function () {
    it("ruby", function () {
      (html2org.fromString('<ruby>测<rt>cè</rt></ruby><ruby>试<rt>shì</rt></ruby>')).should.eql('@@html:<ruby>@@测@@html:<rt>@@cè@@html:</rt>@@@@html:</ruby>@@@@html:<ruby>@@试@@html:<rt>@@shì@@html:</rt>@@@@html:</ruby>@@');
    });
    it("ruby with rp", function () {
      (html2org.fromString('<ruby>测<rp>（</rp><rt>cè</rt><rp>）</rp>试<rp>（</rp><rt>shì</rt><rp>）</rp></ruby>')).should.eql('@@html:<ruby>@@测@@html:<rp>@@（@@html:</rp>@@@@html:<rt>@@cè@@html:</rt>@@@@html:<rp>@@）@@html:</rp>@@试@@html:<rp>@@（@@html:</rp>@@@@html:<rt>@@shì@@html:</rt>@@@@html:<rp>@@）@@html:</rp>@@@@html:</ruby>@@');
    });
  });

  describe(namespace + "basic/blockquote", function () {
    it("blockquote", function () {
      (html2org.fromString('<blockquote>test</blockquote>')).should.eql('#+BEGIN_QUOTE\ntest\n#+END_QUOTE');
    });
    it("paragraph in blockquote", function () {
      (html2org.fromString('<blockquote>\n  <p>test</p>\n  <p>test</p>\n</blockquote>')).should.eql('#+BEGIN_QUOTE\ntest\n\ntest\n#+END_QUOTE');
    });
  });

  describe(namespace + "basic/headings", function () {
    it("h1", function () {
      (html2org.fromString('<h1>Level One Heading</h1>')).should.eql('* Level One Heading');
    });
    it("h3", function () {
      (html2org.fromString('<h3>Level Three Heading</h3>')).should.eql('*** Level Three Heading');
    });
    it("h1 in div", function () {
      (html2org.fromString('<div>\n\t<h1>Level One Heading</h1>\n</div>')).should.eql('* Level One Heading');
    });
  });

  describe(namespace + "basic/horizontal rule", function () {
    it("hr", function () {
      (html2org.fromString('<hr>')).should.eql('-----');
    });

    it("hr with closing tag", function () {
      (html2org.fromString('<hr></hr>')).should.eql('-----');
    });
  });

  describe(namespace + "basic/table", function () {
    it("table", function () {

      const htmlTable = `
      <table>
        <caption>This is a title.</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Savings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>January</td>
            <td>$100</td>
          </tr>
          <tr>
            <td>February</td>
            <td>$80</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Sum</td>
            <td>$180</td>
          </tr>
        </tfoot>
      </table>
      `;

      const expectedOrgTable = `\
        #+CAPTION: This is a title.
        |Month|Savings|
        |-+-|
        |January|$100|
        |February|$80|
        |Sum|$180|`.replace(/^\s+/gm, '');

      (html2org.fromString(htmlTable)).should.eql(expectedOrgTable);
    });
  });

  describe(namespace + "basic/list", function () {

    it("unordered list", function () {
      const htmlList = `
      <ul>
        <li>Item</li>
        <li>Item</li>
      </ul>
      `;
      (html2org.fromString(htmlList)).should.eql('- Item\n- Item');
    });

    it("ordered list", function () {
      const htmlList = `
      <ol>
        <li>First item</li>
        <li>Second item</li>
      </ol>
      `;
      (html2org.fromString(htmlList)).should.eql('1. First item\n2. Second item');
    });

    it("unordered list nested with unordered list", function () {
      const htmlList = `
      <ul>
        <li>
          Item
          <ul>
            <li>SubItem</li>
            <li>SubItem</li>
          </ul>
        </li>
        <li>Item</li>
      </ul>`;
      (html2org.fromString(htmlList)).should.eql('- Item\n  - SubItem\n  - SubItem\n- Item');
    });

    it("complicated nested list", function () {
      const htmlList = `
      <ul>
        <li>
          Item
          <ul>
            <li>
              SubItem
              <ol>
                <li>First SubItem</li>
                <li>Second SubItem</li>
              </ol>
            </li>
            <li>SubItem</li>
          </ul>
        </li>
        <li>
          Item
          <ol>
            <li>
              First SubItem
              <ul>
                <li>
                  SubItem
                  <ol>
                    <li>
                      First SubItem
                      <ol>
                        <li>First SubItem</li>
                        <li>Second SubItem</li>
                      </ol>
                    </li>
                    <li>Second SubItem</li>
                  </ol>
                </li>
                <li>SubItem</li>
              </ul>
            </li>
            <li>Second SubItem</li>
          </ol>
        </li>
      </ul>`;

      (html2org.fromString(htmlList)).should.eql('- Item\n  - SubItem\n    1. First SubItem\n    2. Second SubItem\n  - SubItem\n- Item\n  1. First SubItem\n     - SubItem\n       1. First SubItem\n          1. First SubItem\n          2. Second SubItem\n       2. Second SubItem\n     - SubItem\n  2. Second SubItem');
    });

    it("unordered list nested with ordered list", function () {
      const htmlList = `
      <ul>
        <li>Item</li>
        <li>Item</li>
        <li>
          <ol>
            <li>First SubItem</li>
            <li>Second SubItem</li>
            <li>
              <ul>
                <li>SubItem</li>
                <li>SubItem</li>
                <li>SubItem</li>
              </ul>
            </li>
          </ol>
        </li>
        <li>Item</li>
      </ul>`;

      (html2org.fromString(htmlList)).should.eql('- Item\n- Item\n- \n  1. First SubItem\n  2. Second SubItem\n  3. \n     - SubItem\n     - SubItem\n     - SubItem\n- Item');
    });

    it("list spacing", function () {
      const htmlList = `
      <p>A paragraph.</p>
      <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
        <li>Ordered list item 3</li>
      </ol>
      <p>Another paragraph.</p>
      <ul>
        <li>Unordered list item 1</li>
        <li>Unordered list item 2</li>
        <li>Unordered list item 3</li>
      </ul>`;
      (html2org.fromString(htmlList)).should.eql('A paragraph.\n\n1. Ordered list item 1\n2. Ordered list item 2\n3. Ordered list item 3\n\nAnother paragraph.\n\n- Unordered list item 1\n- Unordered list item 2\n- Unordered list item 3');
    });

    it("description list", function () {
      const htmlList = `
      <dl>
        <dt>dt1</dt>
        <dd>dd1.1</dd>
        <dt>dt2</dt>
        <dd>dd2.1</dd>
      </dl>
      `;

      (html2org.fromString(htmlList)).should.eql('- dt1 :: dd1.1\n- dt2 :: dd2.1');
    });

    it("description list with multiple terms", function () {
      const htmlList = `
      <dl>
        <dt>dt1</dt>
        <dd>dd1.1</dd>  <!--前面是dt，后面是dd-->
        <dd>dd1.2</dd>  <!--前面是dd，后面是dd-->
        <dd>dd1.3</dd>  <!--前面是dd，后面是dt-->
        <dt>dt2</dt>
        <dd>dd2.1</dd>  <!--前面是dt，后面是dt-->
        <dt>dt3</dt>
        <dd>dd3.1</dd>  <!--前面是dt，后面是null-->
                        <!--前面是dd，后面是null-->
      </dl>
      `;

      (html2org.fromString(htmlList)).should.eql('- dt1 ::\n  - dd1.1\n  - dd1.2\n  - dd1.3\n- dt2 :: dd2.1\n- dt3 :: dd3.1');
    });

    it("description list with multiple terms", function () {
      const htmlList = `
      <ul>
        <li>
          Item 1
          <dl>
            <dt>DT 1
            <dd>DD
            <dt>DT 2
            <dd>DD 1
            <dd>DD 2
            <dt>DT 3
            <dd>DD
          </dl>
        </li>
        <li>Item 2</li>
      </ul>
      `;

      (html2org.fromString(htmlList)).should.eql('- Item 1\n  - DT 1 :: DD\n  - DT 2 ::\n    - DD 1\n    - DD 2\n  - DT 3 :: DD\n- Item 2');
    });

  });

  describe(namespace + "basic/code", function () {

    it("fromString('Text in the <code>code</code> and <code>verbatim</code> string is not processed for Org specific syntax; it is exported verbatim.') should be 'Text in the =code= and =verbatim= string is not processed for Org specific syntax; it is exported verbatim.'", function () {

      (html2org.fromString('Text in the <code>code</code> and <code>verbatim</code> string is not processed for Org specific syntax; it is exported verbatim.')).should.eql('Text in the =code= and =verbatim= string is not processed for Org specific syntax; it is exported verbatim.');
    });

    it("Orgmode export style", function () {
      (html2org.fromString('<pre class="src src-python">\n<span style="color: #859900; font-weight: bold;">import</span> pandas <span style="color: #859900; font-weight: bold;">as</span> pd\n\n<span style="color: #268bd2;">df</span> = pd.DataFrame({<span style="color: #2aa198;">"A"</span>: [5, 6, 7, 8, 9], <span style="color: #2aa198;">"B"</span>: [1, 2, 3, 4, 5]})\n</pre>')).should.eql('#+BEGIN_SRC python\nimport pandas as pd\n\ndf = pd.DataFrame({"A": [5, 6, 7, 8, 9], "B": [1, 2, 3, 4, 5]})\n#+END_SRC');
    });

    it("Github style", function () {
      const htmlPre = `
      <pre class="lang-py s-code-block"><code class="hljs language-python"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd

      df = pd.DataFrame({<span class="hljs-string">'A'</span>: [<span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>], <span class="hljs-string">'B'</span>: [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>]})
      </code></pre>`.replace(/^ +/gm, '');

      (html2org.fromString(htmlPre)).should.eql(`#+BEGIN_SRC python\nimport pandas as pd\n\ndf = pd.DataFrame({'A': [5, 6, 7, 8, 9], 'B': [1, 2, 3, 4, 5]})\n#+END_SRC`);
    });

  });

  describe(namespace + "basic/image", function () {
    it("img with no alt", function () {
      (html2org.fromString('<img src="http://example.com/logo.png" />')).should.eql('[[http://example.com/logo.png]]');
    });

    it("img with relative src", function () {
      (html2org.fromString('<img src="logo.png">')).should.eql('[[logo.png]]');
    });

    it("img with alt", function () {
      (html2org.fromString('<img src="logo.png" alt="img with alt">')).should.eql('[[logo.png][img with alt]]');
    });

  });

});
