function inspectNode (node) {
  console.log(JSON.stringify(node.innerHTML));
  console.log(node.innerHTML);
  console.log(JSON.stringify(stringifyNode(node), null, 2));
}

function stringifyNode (node) {
  var infoList = [];

  node.childNodes.forEach(function (childNode, index) {
    info = {
      'nodeName': childNode.nodeName,
      'nodeType': childNode.nodeType,
      'nodeValue': childNode.nodeValue,
      'childNodeNum': childNode.childNodes.length,
      'childNodes': stringifyNode(childNode),
    };
    infoList = infoList.concat(info);
  });

  return infoList;
}

module.exports= {
  inspectNode,
};
