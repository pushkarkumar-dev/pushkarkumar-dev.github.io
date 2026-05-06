// Trees — 13 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 98,
    "name": "Validate Binary Search Tree",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "verify BST property holds for ALL descendants, not just direct children",
      "pass min/max bounds down recursively"
    ],
    "coreIdea": "Each node must be strictly within (min, max) bounds inherited from its ancestors. Left subtree tightens the upper bound; right subtree tightens the lower bound.",
    "coreIdeaHinglish": "Har node ko sirf apne children se compare mat karo — ancestors se aayi bounds bhi check karo. Left jao? Upper bound tighten. Right jao? Lower bound tighten.",
    "approach": [
      "validate(node, min_val, max_val): if not node: return True",
      "if node.val <= min_val or node.val >= max_val: return False",
      "return validate(left, min_val, node.val) and validate(right, node.val, max_val)"
    ],
    "time": "O(n)",
    "space": "O(h)",
    "pitfalls": [
      "Checking node.val vs children only is WRONG — a deeper node can violate BST across subtrees",
      "Bounds are STRICT inequalities (left < root < right, no equals)",
      "Initialize with (-inf, inf) at root"
    ],
    "code": "boolean valid(TreeNode node, long min, long max) {\n    if (node == null) return true;\n    if (node.val <= min || node.val >= max) return false;\n    return valid(node.left, min, node.val) && valid(node.right, node.val, max);\n}\nreturn valid(root, Long.MIN_VALUE, Long.MAX_VALUE);",
    "variants": [
      "Kth Smallest Element in BST (LC 230)",
      "Recover Binary Search Tree (LC 99)"
    ],
    "summary": "Determine if a binary tree satisfies the Binary Search Tree property for all nodes."
  },
  {
    "id": 102,
    "name": "Binary Tree Level Order Traversal",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "process tree level by level",
      "BFS with a queue, capture each level's snapshot"
    ],
    "coreIdea": "BFS with a queue. At the start of each level, snapshot the current queue size — that's how many nodes belong to this level. Process exactly that many before moving to the next.",
    "coreIdeaHinglish": "Queue se BFS karo. Har level ke start pe queue ka size note karo — utne hi nodes iss level ke hain. Exactly utne process karo, phir next level.",
    "approach": [
      "queue = deque([root]); res = []",
      "While queue: level = []; for _ in range(len(queue)): node=pop left; add to level; push children",
      "res.append(level)"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Snapshot len(queue) at the START of each level loop — it changes as you push children",
      "Use collections.deque for O(1) popleft (list.pop(0) is O(n))",
      "Handle null root before adding to queue"
    ],
    "code": "if (root == null) return new ArrayList<>();\nList<List<Integer>> res = new ArrayList<>();\nQueue<TreeNode> q = new LinkedList<>();\nq.add(root);\nwhile (!q.isEmpty()) {\n    List<Integer> level = new ArrayList<>();\n    for (int i = q.size(); i > 0; i--) {\n        TreeNode node = q.poll();\n        level.add(node.val);\n        if (node.left != null) q.add(node.left);\n        if (node.right != null) q.add(node.right);\n    }\n    res.add(level);\n}\nreturn res;",
    "variants": [
      "Binary Tree Right Side View (LC 199)",
      "Binary Tree Zigzag Level Order (LC 103)"
    ],
    "animation": "bfsLevels",
    "summary": "Return the values of each row of a binary tree grouped by level, from top to bottom."
  },
  {
    "id": 199,
    "name": "Binary Tree Right Side View",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "nodes visible from the right side of the tree",
      "last node of each BFS level"
    ],
    "coreIdea": "Level-order BFS. At each level, the last node processed is the rightmost visible one. Append it to the result.",
    "coreIdeaHinglish": "Level order BFS karo. Har level ka last node right side se visible hota hai. Uss node ka value result me add karo.",
    "approach": [
      "BFS same as LC 102",
      "Instead of collecting full level, just record the last node's val each level"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Track the last node of each level, not just the rightmost child in the tree",
      "A left child can be the rightmost visible if the right subtree is missing",
      "DFS with right-first traversal also works (track depth, update seen[depth] = val)"
    ],
    "code": "List<Integer> res = new ArrayList<>();\nQueue<TreeNode> q = new LinkedList<>();\nif (root != null) q.add(root);\nwhile (!q.isEmpty()) {\n    TreeNode last = null;\n    for (int i = q.size(); i > 0; i--) {\n        last = q.poll();\n        if (last.left != null) q.add(last.left);\n        if (last.right != null) q.add(last.right);\n    }\n    res.add(last.val);\n}\nreturn res;",
    "variants": [
      "Binary Tree Level Order Traversal (LC 102)",
      "Populating Next Right Pointers (LC 116)"
    ],
    "summary": "Return the value of the rightmost node at each level of a binary tree."
  },
  {
    "id": 235,
    "name": "Lowest Common Ancestor of BST",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "LCA in a BST — exploit BST ordering",
      "both p and q are in the tree"
    ],
    "coreIdea": "In a BST, the LCA is the first node where p and q split directions. If both < root → go left. Both > root → go right. Otherwise current node is LCA.",
    "coreIdeaHinglish": "BST me LCA wo pehla node hai jahan p aur q alag directions me jaate hain. Dono left me? Left jao. Dono right me? Right jao. Ek left, ek right? Current node LCA hai.",
    "approach": [
      "While True: if p.val < root.val and q.val < root.val: root = root.left",
      "Elif p.val > root.val and q.val > root.val: root = root.right",
      "Else: return root"
    ],
    "time": "O(h)",
    "space": "O(1) iterative",
    "pitfalls": [
      "BST property makes this O(h) — don't use the general tree LCA approach",
      "If one of p, q IS the root → root is the LCA (the else branch handles it)",
      "Iterative version is O(1) space — no recursion stack"
    ],
    "code": "while (root != null) {\n    if (p.val < root.val && q.val < root.val) root = root.left;\n    else if (p.val > root.val && q.val > root.val) root = root.right;\n    else return root;\n}\nreturn root;",
    "variants": [
      "Lowest Common Ancestor of Binary Tree (LC 236)",
      "Kth Smallest in BST (LC 230)"
    ],
    "summary": "Find the lowest common ancestor of two nodes in a Binary Search Tree."
  },
  {
    "id": 230,
    "name": "Kth Smallest Element in BST",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "kth smallest in BST",
      "in-order traversal yields sorted order"
    ],
    "coreIdea": "In-order traversal (left → root → right) of a BST yields elements in ascending order. The kth element visited is the answer.",
    "coreIdeaHinglish": "BST ka in-order traversal ascending order deta hai. k-waan element milna hai? Count karte jao, k-waan pe return karo.",
    "approach": [
      "Iterative with stack, or recursive with counter",
      "In-order: push left spine; pop and count; push right",
      "Return node.val when count == k"
    ],
    "time": "O(h + k)",
    "space": "O(h)",
    "pitfalls": [
      "Don't convert to full array then index — early exit at kth element is more efficient",
      "Iterative in-order avoids recursion limit for deep trees",
      "k is 1-indexed — decrement count AFTER visiting each node"
    ],
    "code": "int[] cnt = {0};\nint[] res = {0};\nvoid inorder(TreeNode node) {\n    if (node == null) return;\n    inorder(node.left);\n    if (++cnt[0] == k) res[0] = node.val;\n    inorder(node.right);\n}\ninorder(root);\nreturn res[0];",
    "variants": [
      "Validate Binary Search Tree (LC 98)",
      "Binary Search Tree Iterator (LC 173)"
    ],
    "summary": "Find the kth smallest value in a Binary Search Tree."
  },
  {
    "id": 236,
    "name": "Lowest Common Ancestor of Binary Tree",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "LCA in a general binary tree (not BST)",
      "post-order DFS — find p and q in subtrees"
    ],
    "coreIdea": "Post-order DFS. If current node is p or q, return it. If both children return non-null, current node is the LCA. Otherwise propagate the non-null child upward.",
    "coreIdeaHinglish": "Post-order DFS karo. Agar node p ya q hai, return karo. Dono children non-null return karte hain? Current node LCA hai. Warna jo non-null hai use propagate karo.",
    "approach": [
      "If not node or node is p or node is q: return node",
      "left = lca(node.left); right = lca(node.right)",
      "If left and right: return node",
      "Return left or right"
    ],
    "time": "O(n)",
    "space": "O(h)",
    "pitfalls": [
      "Both p and q are GUARANTEED to be in the tree — no need to handle 'not found'",
      "If one of p/q is an ancestor of the other, the ancestor is returned first and propagated up",
      "Don't compare by value — compare by reference (node is p)"
    ],
    "code": "if (root==null||root==p||root==q) return root;\nTreeNode left=lowestCommonAncestor(root.left,p,q);\nTreeNode right=lowestCommonAncestor(root.right,p,q);\nreturn left!=null&&right!=null ? root : (left!=null ? left : right);",
    "variants": [
      "Lowest Common Ancestor of BST (LC 235)",
      "LCA of Deepest Leaves (LC 1123)"
    ],
    "summary": "Find the lowest common ancestor of two given nodes in a binary tree (not necessarily a BST)."
  },
  {
    "id": 105,
    "name": "Construct Binary Tree from Preorder and Inorder Traversal",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "reconstruct tree from preorder + inorder arrays",
      "preorder[0] is always the root"
    ],
    "coreIdea": "preorder[0] is root. Find it in inorder → elements to its left are left subtree, right are right subtree. Recurse, slicing both arrays accordingly.",
    "coreIdeaHinglish": "preorder[0] hamesha root hai. Usse inorder me dhundo — left wale left subtree, right wale right subtree. Dono arrays slice karo aur recurse karo.",
    "approach": [
      "root = TreeNode(preorder[0])",
      "mid = inorder.index(root.val)",
      "root.left = build(preorder[1:mid+1], inorder[:mid])",
      "root.right = build(preorder[mid+1:], inorder[mid+1:])"
    ],
    "time": "O(n²) naive; O(n) with index map",
    "space": "O(n)",
    "pitfalls": [
      "Use a hashmap for inorder indices to avoid O(n) .index() calls per level",
      "Slice sizes: left subtree has 'mid' nodes → preorder[1:mid+1]",
      "Base case: if not preorder or not inorder: return None"
    ],
    "code": "Map<Integer, Integer> idx = new HashMap<>();\nfor (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);\nint[] pre = {0};\nTreeNode build(int l, int r) {\n    if (l > r) return null;\n    TreeNode node = new TreeNode(preorder[pre[0]++]);\n    int m = idx.get(node.val);\n    node.left = build(l, m - 1);\n    node.right = build(m + 1, r);\n    return node;\n}\nreturn build(0, inorder.length - 1);",
    "variants": [
      "Construct from Postorder and Inorder (LC 106)",
      "Serialize and Deserialize Binary Tree (LC 297)"
    ],
    "summary": "Reconstruct a binary tree from its preorder and inorder traversal arrays."
  },
  {
    "id": 1448,
    "name": "Count Good Nodes in Binary Tree",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "count nodes where no value on root-to-node path is greater",
      "pass max-so-far down the recursion"
    ],
    "coreIdea": "DFS tracking the maximum value seen on the path from root to current node. A node is 'good' if its value ≥ the running max.",
    "coreIdeaHinglish": "DFS karo aur root se current node tak ka max value track karo. Agar current node ka value >= max hai, woh 'good' node hai.",
    "approach": [
      "dfs(node, max_so_far): if not node: return 0",
      "good = 1 if node.val >= max_so_far else 0",
      "max_so_far = max(max_so_far, node.val)",
      "return good + dfs(left, max_so_far) + dfs(right, max_so_far)"
    ],
    "time": "O(n)",
    "space": "O(h)",
    "pitfalls": [
      "Root is always good (no elements before it on path)",
      "Update max_so_far BEFORE recursing into children",
      "Count the current node as good before recursing — don't double-count"
    ],
    "code": "int dfs(TreeNode node, int cnt) {\n    if (node == null) return 0;\n    int good = node.val >= cnt ? 1 : 0;\n    int newMax = Math.max(cnt, node.val);\n    return good + dfs(node.left, newMax) + dfs(node.right, newMax);\n}\nreturn dfs(root, Integer.MIN_VALUE);",
    "variants": [
      "Path Sum (LC 112)",
      "Path Sum II (LC 113)"
    ],
    "summary": "Count nodes in a binary tree that are greater than every ancestor on the path from the root."
  },
  {
    "id": 103,
    "name": "Binary Tree Zigzag Level Order Traversal",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "level order but alternating left-to-right and right-to-left",
      "BFS + direction toggle per level"
    ],
    "coreIdea": "Standard BFS level order. After collecting each level, reverse it if the level index is odd (right-to-left). Toggle direction each level.",
    "coreIdeaHinglish": "Normal BFS lo. Har level collect karo. Odd level hai? Reverse karo. Even? Waise hi rakho. Direction toggle karo.",
    "approach": [
      "BFS as in LC 102; left_to_right = True",
      "After collecting level: if not left_to_right: level.reverse()",
      "left_to_right = not left_to_right; res.append(level)"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Reversing the collected level is simpler than changing the queue order",
      "Track direction with a boolean, not level index (avoids off-by-one)",
      "Level 0 (root) is left-to-right"
    ],
    "code": "List<List<Integer>> res=new ArrayList<>();\nDeque<TreeNode> q=new ArrayDeque<>();\nif (root!=null) q.add(root);\nboolean leftToRight=true;\nwhile (!q.isEmpty()) {\n    int sz=q.size(); List<Integer> level=new ArrayList<>();\n    for (int i=0;i<sz;i++) {\n        TreeNode node=q.poll();\n        level.add(node.val);\n        if (node.left!=null) q.add(node.left);\n        if (node.right!=null) q.add(node.right);\n    }\n    if (!leftToRight) Collections.reverse(level);\n    res.add(level); leftToRight=!leftToRight;\n}\nreturn res;",
    "variants": [
      "Binary Tree Level Order Traversal (LC 102)",
      "Binary Tree Right Side View (LC 199)"
    ],
    "summary": "Return node values of each level of a binary tree alternating left-to-right and right-to-left."
  },
  {
    "id": 437,
    "name": "Path Sum III",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "count paths summing to target (any start/end, must go downward)",
      "prefix sum on tree paths"
    ],
    "coreIdea": "DFS with a running prefix sum. At each node, check how many previous prefix sums equal (current_sum - target) — those form valid paths ending here. Same idea as LC 560.",
    "coreIdeaHinglish": "DFS karte waqt prefix sum track karo. Har node pe check karo: (current_sum - target) pehle kisi jagah tha? Agar haan, woh path valid hai. LC 560 ka tree version.",
    "approach": [
      "prefix_count = {0: 1}, curr_sum = 0",
      "DFS: curr_sum += node.val; count += prefix_count.get(curr_sum - target, 0)",
      "prefix_count[curr_sum]++; recurse; prefix_count[curr_sum]-- (backtrack)"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "MUST backtrack the prefix_count after visiting a subtree — different root-to-node paths are independent",
      "Initialize {0: 1} as in LC 560 to handle paths starting at root",
      "curr_sum is cumulative from root — not reset per path"
    ],
    "code": "Map<Long,Integer> prefix=new HashMap<>();\nprefix.put(0L,1);\nint[] res={0};\nvoid dfs(TreeNode node, long cur) {\n    if (node==null) return;\n    cur+=node.val;\n    res[0]+=prefix.getOrDefault(cur-targetSum,0);\n    prefix.merge(cur,1,Integer::sum);\n    dfs(node.left,cur); dfs(node.right,cur);\n    prefix.merge(cur,-1,Integer::sum);\n}\ndfs(root,0L);\nreturn res[0];",
    "variants": [
      "Subarray Sum Equals K (LC 560)",
      "Path Sum II (LC 113)"
    ],
    "summary": "Count the number of downward paths in a binary tree whose node values sum to a target."
  },
  {
    "id": 124,
    "name": "Binary Tree Maximum Path Sum",
    "difficulty": "Hard",
    "pattern": "Trees",
    "trigger": [
      "maximum sum path between any two nodes (path needn't pass through root)",
      "post-order DFS — combine left/right gains"
    ],
    "coreIdea": "Post-order DFS. Each node returns the max gain it contributes to its parent (only one branch). At each node, compute the candidate path sum through it (left_gain + node.val + right_gain) and update global max.",
    "coreIdeaHinglish": "Post-order DFS. Har node parent ko sirf ek branch return karta hai (max gain). Par khud ke liye dono branches combine karke global max update karo.",
    "approach": [
      "gain(node): if not node: return 0",
      "left_gain = max(gain(left), 0); right_gain = max(gain(right), 0)",
      "Update ans = max(ans, node.val + left_gain + right_gain)",
      "Return node.val + max(left_gain, right_gain)"
    ],
    "time": "O(n)",
    "space": "O(h)",
    "pitfalls": [
      "Clamp negative gains to 0 — a negative branch is never worth including",
      "The local answer (through current node) may use BOTH branches, but the return value uses only ONE",
      "ans must be a nonlocal/global variable — it persists across the full DFS"
    ],
    "code": "int[] ans={Integer.MIN_VALUE};\nint dfs(TreeNode node) {\n    if (node==null) return 0;\n    int left=Math.max(0,dfs(node.left)), right=Math.max(0,dfs(node.right));\n    ans[0]=Math.max(ans[0],node.val+left+right);\n    return node.val+Math.max(left,right);\n}\ndfs(root);\nreturn ans[0];",
    "variants": [
      "Path Sum III (LC 437)",
      "Diameter of Binary Tree (LC 543)"
    ],
    "summary": "Find the maximum sum of any path in a binary tree; a path connects any two nodes going through edges."
  },
  {
    "id": 297,
    "name": "Serialize and Deserialize Binary Tree",
    "difficulty": "Hard",
    "pattern": "Trees",
    "trigger": [
      "convert binary tree to/from string representation",
      "encode null markers to reconstruct uniquely"
    ],
    "coreIdea": "BFS or pre-order DFS serialization with explicit 'null' markers. Deserialization reconstructs by processing the same sequence — null markers tell you where subtrees end.",
    "coreIdeaHinglish": "Pre-order DFS se serialize karo, null markers daalo. Deserialize karte waqt same sequence follow karo — null markers batate hain ki subtree kahan khatam hua.",
    "approach": [
      "serialize: pre-order DFS; null → 'N'; comma-separated",
      "deserialize: split by comma; use an index or deque; recursively build: if 'N' return None"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Must encode null children explicitly — can't reconstruct without them",
      "Pre-order + nulls uniquely determines the tree (post-order also works; in-order alone does not)",
      "Use an iterator/deque for deserialization so state carries across recursive calls"
    ],
    "code": "// Serialize: BFS with null markers\nString serialize(TreeNode root) {\n    StringBuilder sb=new StringBuilder();\n    Queue<TreeNode> q=new LinkedList<>(); q.add(root);\n    while (!q.isEmpty()) {\n        TreeNode n=q.poll();\n        if (n==null) sb.append(\"null,\");\n        else { sb.append(n.val).append(','); q.add(n.left); q.add(n.right); }\n    }\n    return sb.toString();\n}\nTreeNode deserialize(String data) {\n    String[] vals=data.split(\",\"); if(vals[0].equals(\"null\")) return null;\n    TreeNode root=new TreeNode(Integer.parseInt(vals[0]));\n    Queue<TreeNode> q=new LinkedList<>(); q.add(root); int i=1;\n    while (!q.isEmpty()) {\n        TreeNode n=q.poll();\n        if (!vals[i].equals(\"null\")){ n.left=new TreeNode(Integer.parseInt(vals[i])); q.add(n.left); } i++;\n        if (!vals[i].equals(\"null\")){ n.right=new TreeNode(Integer.parseInt(vals[i])); q.add(n.right); } i++;\n    }\n    return root;\n}",
    "variants": [
      "Serialize and Deserialize BST (LC 449)",
      "Construct Binary Tree from Preorder/Inorder (LC 105)"
    ],
    "summary": "Design serialize and deserialize functions that can convert a binary tree to a string and back."
  },
  {
    "id": 116,
    "name": "Populating Next Right Pointers in Each Node",
    "difficulty": "Medium",
    "pattern": "Trees",
    "trigger": [
      "connect each node to its next right node at the same level",
      "perfect binary tree — use existing next pointers to link the next level"
    ],
    "coreIdea": "Level by level using the already-connected previous level. For each connected node on level k, link its children on level k+1 using next pointers.",
    "coreIdeaHinglish": "Pichle level ke next pointers use karo agle level ko connect karne ke liye. Har node ke children ko connect karo — same parent ke, phir across to next parent.",
    "approach": [
      "leftmost = root",
      "While leftmost.left: curr = leftmost",
      "While curr: curr.left.next = curr.right; if curr.next: curr.right.next = curr.next.left; curr = curr.next",
      "leftmost = leftmost.left"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Perfect binary tree guarantee means every non-leaf has exactly two children",
      "Link across parents: curr.right.next = curr.next.left (uses next pointer of current level)",
      "O(1) space — don't use BFS queue; use the previously-connected level as a linked list"
    ],
    "code": "if (root==null) return root;\nif (root.left!=null) {\n    root.left.next=root.right;\n    if (root.next!=null) root.right.next=root.next.left;\n    connect(root.left); connect(root.right);\n}\nreturn root;",
    "variants": [
      "Populating Next Right Pointers II (LC 117) — non-perfect tree"
    ],
    "summary": "Fill each node's next pointer to the node immediately to its right at the same level in a perfect binary tree."
  }
]);
