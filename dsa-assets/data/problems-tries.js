// Tries — 3 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 208,
    "name": "Implement Trie (Prefix Tree)",
    "difficulty": "Medium",
    "pattern": "Tries",
    "trigger": [
      "prefix-based string operations: insert, search, startsWith",
      "need O(m) per operation where m = word length"
    ],
    "coreIdea": "Each node has children[26] and an is_end flag. insert/search/startsWith walk the trie character by character, creating nodes as needed for insert.",
    "coreIdeaHinglish": "Har node me 26 children aur ek is_end flag. Insert me nodes banao. Search aur startsWith me walk karo — is_end flag batata hai word pura hai ya sirf prefix.",
    "approach": [
      "TrieNode: children = {}; is_end = False",
      "insert: for c in word: create node if missing; advance; mark is_end",
      "search: walk; return last node's is_end",
      "startsWith: walk; return True if walk completes"
    ],
    "time": "O(m) per op",
    "space": "O(n·m) total",
    "pitfalls": [
      "search checks is_end at the END — a prefix is in the trie but isn't a complete word",
      "startsWith returns True as long as the walk doesn't hit a missing child",
      "Using dict for children (not array[26]) handles non-lowercase-alpha chars too"
    ],
    "code": "class TrieNode { TrieNode[] ch = new TrieNode[26]; boolean end; }\nTrieNode root = new TrieNode();\n\nvoid insert(String word) {\n    TrieNode cur = root;\n    for (char c : word.toCharArray()) {\n        int i = c - 'a';\n        if (cur.ch[i] == null) cur.ch[i] = new TrieNode();\n        cur = cur.ch[i];\n    }\n    cur.end = true;\n}\nboolean search(String word) {\n    TrieNode cur = root;\n    for (char c : word.toCharArray()) {\n        int i = c - 'a';\n        if (cur.ch[i] == null) return false;\n        cur = cur.ch[i];\n    }\n    return cur.end;\n}\nboolean startsWith(String prefix) {\n    TrieNode cur = root;\n    for (char c : prefix.toCharArray()) {\n        int i = c - 'a';\n        if (cur.ch[i] == null) return false;\n        cur = cur.ch[i];\n    }\n    return true;\n}",
    "variants": [
      "Design Add and Search Words (LC 211)",
      "Word Search II (LC 212)"
    ],
    "summary": "Implement a prefix tree (trie) supporting insert, search, and startsWith."
  },
  {
    "id": 211,
    "name": "Design Add and Search Words Data Structure",
    "difficulty": "Medium",
    "pattern": "Tries",
    "trigger": [
      "word dictionary with wildcard '.' matching any single character",
      "trie + DFS for wildcard expansion"
    ],
    "coreIdea": "Trie for insert. Search uses DFS: for '.' try all 26 children; for a regular char, follow normally. Backtrack on dead ends.",
    "coreIdeaHinglish": "Insert normal trie. Search me DFS — '.' mila? Sabhi 26 children try karo. Normal char? Wahi path follow karo. Dead end? Backtrack.",
    "approach": [
      "addWord: standard trie insert",
      "search: DFS(node, i): if i==len(word): return node.is_end",
      "If word[i]=='.': try all children; else: follow word[i] if exists"
    ],
    "time": "O(m) best, O(26^m) worst with many wildcards",
    "space": "O(n·m)",
    "pitfalls": [
      "DFS must backtrack — don't return True on first '.' branch unless it actually succeeds",
      "word[i]=='.' expands to ALL existing children (not all 26 — skip missing ones)",
      "is_end check at end of word, not at the '.' itself"
    ],
    "code": "class TrieNode { TrieNode[] ch = new TrieNode[26]; boolean end; }\nTrieNode root = new TrieNode();\n\nvoid addWord(String word) {\n    TrieNode cur = root;\n    for (char c : word.toCharArray()) { int i=c-'a'; if(cur.ch[i]==null) cur.ch[i]=new TrieNode(); cur=cur.ch[i]; }\n    cur.end = true;\n}\nboolean search(String word) { return dfs(word, 0, root); }\nboolean dfs(String w, int i, TrieNode node) {\n    if (i == w.length()) return node.end;\n    char c = w.charAt(i);\n    if (c == '.') { for (TrieNode child : node.ch) if (child!=null && dfs(w,i+1,child)) return true; return false; }\n    if (node.ch[c-'a'] == null) return false;\n    return dfs(w, i+1, node.ch[c-'a']);\n}",
    "variants": [
      "Implement Trie (LC 208)",
      "Word Search II (LC 212)"
    ],
    "summary": "Design a word dictionary that supports adding words and searching with '.' as a wildcard for any letter."
  },
  {
    "id": 212,
    "name": "Word Search II",
    "difficulty": "Hard",
    "pattern": "Tries",
    "trigger": [
      "find all words from a list that exist in a 2D board (connected cells)",
      "trie + backtracking DFS — prune dead branches early"
    ],
    "coreIdea": "Build a trie from words. DFS the board, traversing the trie simultaneously. When a board path reaches a trie word end, record it. Prune: if no trie child for current cell, stop.",
    "coreIdeaHinglish": "Saare words ek trie me daal do. Board pe DFS karo aur trie me simultaneously chalo. Trie me path nahi? Prune karo. is_end mila? Word found.",
    "approach": [
      "Build trie from words",
      "DFS(r, c, node): if is_end: add to result",
      "Mark cell visited (board[r][c]='#'); explore 4 dirs if child in trie; restore"
    ],
    "time": "O(M·N·4·3^(L-1)) where L = word length",
    "space": "O(total word chars)",
    "pitfalls": [
      "Remove found words from trie to avoid duplicates (set node.word=None after adding to result)",
      "Mark visited cells in-place with '#' — restore after DFS returns",
      "Prune leaf trie nodes (no children, no end) during DFS to speed up future searches"
    ],
    "code": "// Build trie from words, then DFS grid\nclass TrieNode { TrieNode[] ch=new TrieNode[26]; String word; }\nTrieNode root = new TrieNode();\n// insert all words into trie ...\nList<String> res = new ArrayList<>();\nvoid dfs(char[][] board, int r, int c, TrieNode node) {\n    if (r<0||r>=board.length||c<0||c>=board[0].length||board[r][c]=='#') return;\n    char ch = board[r][c];\n    TrieNode next = node.ch[ch-'a'];\n    if (next==null) return;\n    if (next.word!=null) { res.add(next.word); next.word=null; }\n    board[r][c]='#';\n    dfs(board,r+1,c,next); dfs(board,r-1,c,next); dfs(board,r,c+1,next); dfs(board,r,c-1,next);\n    board[r][c]=ch;\n}",
    "variants": [
      "Word Search (LC 79)",
      "Design Add and Search Words (LC 211)"
    ],
    "summary": "Given a board of characters and a list of words, find all words that can be formed by adjacent cells."
  }
]);
