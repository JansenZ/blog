
// hi, hello, hex, hox, help
// 输入h，输出以上
// 输入he 输出hello, hex, help

function TrieNode(data) {
    this.data = data;
    this.isEndingChar = false;
    this.children = {};
}

var root = new TrieNode('/');
function insert(text) {
    let p = root;
    for (let i = 0; i < text.length; i++) {
      if (p.children[text.charAt(i)] == null) {
        let newNode = new TrieNode(text[i]);
        p.children[text.charAt(i)] = newNode;
      }
      p = p.children[text.charAt(i)];
    }
    p.isEndingChar = true;
}

function find(pattern) {
    let p = root;
    for (let i = 0; i < pattern.length; i++) {
      if (p.children[pattern.charAt(i)] == null) {
        return false; // 不存在pattern
      }
      p = p.children[pattern.charAt(i)];
    }
    if (p.isEndingChar == false) return false; // 不能完全匹配，只是前缀
    else return true; // 找到pattern
}

function match(str, maxLen) {
    let p = root;
    for (let i = 0; i < str.length; i++) {
      if (p.children[str.charAt(i)] == null) {
        return false; // 不存在pattern
      }
      p = p.children[str.charAt(i)];
    }
    let res = [];
    if(p.isEndingChar) {
        res.push(str);
    }
    searchStr(res, str, p, maxLen);
    return res;
}

function searchStr(res, str, node, maxLen) {
    let childs = node.children;
    for(let k in childs) {
        if (res.length >= maxLen) {
            return;
        }
        if(childs[k].isEndingChar) {
            res.push(str + childs[k].data);
        }
        searchStr(res, str + childs[k].data, childs[k], maxLen)
    }
}