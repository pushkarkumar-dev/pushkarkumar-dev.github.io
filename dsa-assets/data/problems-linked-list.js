// Linked List — 10 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 143,
    "name": "Reorder List",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "reorder L0→Ln→L1→Ln-1→... in-place",
      "split in half, reverse second half, merge alternately"
    ],
    "coreIdea": "Three steps: (1) find middle with slow/fast pointers, (2) reverse the second half, (3) merge the two halves alternately.",
    "coreIdeaHinglish": "Teen steps: pehle middle dhundo (slow/fast). Phir doosri half reverse karo. Phir dono ko alternate merge karo.",
    "approach": [
      "slow/fast to find mid; split: second = mid.next; mid.next = None",
      "Reverse second half in-place",
      "Merge: alternately take one from each half"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Null-terminate the first half (mid.next = None) before reversing second",
      "In merge loop: save next pointers before rewiring",
      "fast starts at head.next (not head) to get the left-center mid for even-length lists"
    ],
    "code": "// Find mid, reverse second half, merge\nListNode slow = head, fast = head;\nwhile (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }\nListNode second = slow.next; slow.next = null;\nListNode prev = null;\nwhile (second != null) { ListNode next=second.next; second.next=prev; prev=second; second=next; }\nListNode first = head; second = prev;\nwhile (second != null) {\n    ListNode t1=first.next, t2=second.next;\n    first.next=second; second.next=t1;\n    first=t1; second=t2;\n}",
    "variants": [
      "Reverse Linked List (LC 206)",
      "Palindrome Linked List (LC 234)"
    ],
    "summary": "Reorder a linked list in-place so nodes alternate: first, last, second, second-to-last, and so on."
  },
  {
    "id": 19,
    "name": "Remove Nth Node From End of List",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "remove the nth node from the end in one pass",
      "two pointers n apart"
    ],
    "coreIdea": "Two pointers starting at a dummy node. Advance fast n+1 steps ahead. Then move both until fast reaches None — slow is now just before the target node.",
    "coreIdeaHinglish": "Dummy node se dono pointers shuru karo. fast ko n+1 steps aage bhejo. Phir dono saath chalao jab tak fast None na ho jaye — slow target ke ek pehle hoga.",
    "approach": [
      "dummy → head; fast = slow = dummy",
      "Advance fast n+1 times",
      "While fast: fast = fast.next; slow = slow.next",
      "slow.next = slow.next.next"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Use a dummy node to handle removing the head cleanly",
      "Advance fast n+1 times (not n) so slow lands one before the target",
      "If n equals list length, removing head — dummy handles this without special case"
    ],
    "code": "ListNode dummy = new ListNode(0, head);\nListNode fast = dummy, slow = dummy;\nfor (int i = 0; i <= n; i++) fast = fast.next;\nwhile (fast != null) { fast = fast.next; slow = slow.next; }\nslow.next = slow.next.next;\nreturn dummy.next;",
    "variants": [
      "Reorder List (LC 143)",
      "Middle of the Linked List (LC 876)"
    ],
    "summary": "Remove the nth node from the end of a linked list and return the head."
  },
  {
    "id": 2,
    "name": "Add Two Numbers",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "add two numbers represented as reversed linked lists",
      "digit-by-digit addition with carry"
    ],
    "coreIdea": "Traverse both lists simultaneously. Sum each pair of digits + carry. Carry forward. Create new nodes for each digit of the result.",
    "coreIdeaHinglish": "Dono lists ek saath traverse karo. Har step pe dono digits + carry jodo. Result ka ek digit new node me daalo. Carry agle step me le jao.",
    "approach": [
      "dummy = ListNode(0), curr = dummy, carry = 0",
      "While l1 or l2 or carry: val = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry",
      "carry, digit = divmod(val, 10); curr.next = ListNode(digit); advance"
    ],
    "time": "O(max(m,n))",
    "space": "O(max(m,n))",
    "pitfalls": [
      "Continue loop while carry != 0 — final carry creates an extra node (e.g., 9+9+carry=19)",
      "Lists may have different lengths — use 0 when one is exhausted",
      "Lists are in reverse order (ones digit first) — no need to reverse"
    ],
    "code": "ListNode dummy = new ListNode(0);\nListNode cur = dummy;\nint carry = 0;\nwhile (l1 != null || l2 != null || carry != 0) {\n    int val = carry;\n    if (l1 != null) { val += l1.val; l1 = l1.next; }\n    if (l2 != null) { val += l2.val; l2 = l2.next; }\n    carry = val / 10;\n    cur.next = new ListNode(val % 10);\n    cur = cur.next;\n}\nreturn dummy.next;",
    "variants": [
      "Add Binary (LC 67)",
      "Multiply Strings (LC 43)"
    ],
    "summary": "Add two non-negative integers represented as reversed linked lists and return their sum the same way."
  },
  {
    "id": 287,
    "name": "Find the Duplicate Number",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "find duplicate in array of n+1 integers in [1,n], O(1) space",
      "Floyd's cycle detection — treat array as implicit linked list"
    ],
    "coreIdea": "Treat nums as a linked list: index → nums[index]. Duplicate creates a cycle. Floyd's slow/fast detects the cycle entry — that's the duplicate.",
    "coreIdeaHinglish": "Array ko linked list maan lo — index se nums[index] pe jao. Duplicate se cycle banti hai. Floyd's algorithm se cycle entry dhundo — wahi duplicate hai.",
    "approach": [
      "slow = fast = nums[0]",
      "Phase 1: slow=nums[slow], fast=nums[nums[fast]] until equal",
      "Phase 2: slow=nums[0]; both advance one step until equal",
      "Return slow"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Don't start both at 0 — start at nums[0] (element, not index)",
      "Phase 2: reset ONE pointer to start (nums[0]), advance BOTH by one",
      "Modifies nothing — read-only; can't sort or use HashSet (violates constraints)"
    ],
    "code": "int slow = nums[0], fast = nums[nums[0]];\nwhile (slow != fast) { slow = nums[slow]; fast = nums[nums[fast]]; }\nslow = 0;\nwhile (slow != fast) { slow = nums[slow]; fast = nums[fast]; }\nreturn slow;",
    "variants": [
      "Linked List Cycle II (LC 142)",
      "Missing Number (LC 268)"
    ],
    "summary": "Find the duplicate integer in an array of n+1 numbers in [1, n] without modifying the array."
  },
  {
    "id": 138,
    "name": "Copy List with Random Pointer",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "deep copy a linked list where each node has a random pointer",
      "two-pass or interleaving approach"
    ],
    "coreIdea": "HashMap: original node → copy node. First pass creates all copies. Second pass wires next and random pointers using the map.",
    "coreIdeaHinglish": "HashMap banao: original → copy. Pehle pass me saare copies banao. Doosre pass me next aur random pointers wire karo map ki help se.",
    "approach": [
      "old_to_new = {None: None}",
      "Pass 1: for each node: old_to_new[node] = Node(node.val)",
      "Pass 2: for each node: copy.next = map[node.next]; copy.random = map[node.random]"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Initialize map with {None: None} so random/next = None doesn't require special casing",
      "Two-pass approach is cleaner than interleaving (interleaving is O(1) space but complex)",
      "Deep copy means new nodes, not references to original"
    ],
    "code": "Map<Node, Node> map = new HashMap<>();\nNode cur = head;\nwhile (cur != null) { map.put(cur, new Node(cur.val)); cur = cur.next; }\ncur = head;\nwhile (cur != null) {\n    map.get(cur).next = map.get(cur.next);\n    map.get(cur).random = map.get(cur.random);\n    cur = cur.next;\n}\nreturn map.get(head);",
    "variants": [
      "Clone Graph (LC 133)"
    ],
    "summary": "Deep copy a linked list where each node has a next pointer and a random pointer to any node or null."
  },
  {
    "id": 92,
    "name": "Reverse Linked List II",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "reverse nodes from position left to right (1-indexed), in-place",
      "partial reversal with splice-in"
    ],
    "coreIdea": "Advance to node before position left. Then iteratively reverse the next (right-left) nodes using the insert-at-front technique. Use a dummy node to handle left=1.",
    "coreIdeaHinglish": "left se pehle wale node tak pauncho. Phir right-left baar ke liye 'insert at front of reversed section' technique use karo. Dummy node se left=1 ka edge case handle hota hai.",
    "approach": [
      "dummy → head; prev = dummy; advance prev to node before left",
      "curr = prev.next",
      "For _ in range(right-left): nxt=curr.next; curr.next=nxt.next; nxt.next=prev.next; prev.next=nxt"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Use dummy node to avoid special-casing left=1 (head changes)",
      "Don't advance curr in the reversal loop — curr stays as the tail of the reversed section",
      "right-left iterations (not right-left+1) — the loop body moves one node per iteration"
    ],
    "code": "ListNode dummy = new ListNode(0, head);\nListNode pre = dummy;\nfor (int i = 0; i < left - 1; i++) pre = pre.next;\nListNode cur = pre.next;\nfor (int i = 0; i < right - left; i++) {\n    ListNode nxt = cur.next;\n    cur.next = nxt.next;\n    nxt.next = pre.next;\n    pre.next = nxt;\n}\nreturn dummy.next;",
    "variants": [
      "Reverse Linked List (LC 206)",
      "Reverse Nodes in K-Group (LC 25)"
    ],
    "animation": "linkedListReverse",
    "summary": "Reverse the nodes of a linked list between positions left and right in one pass."
  },
  {
    "id": 146,
    "name": "LRU Cache",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "O(1) get and put with least-recently-used eviction",
      "doubly linked list + hash map"
    ],
    "coreIdea": "Doubly linked list (most recent at head, LRU at tail) + HashMap (key → node). On access: remove node and insert at head. On eviction: remove tail. O(1) all ops.",
    "coreIdeaHinglish": "Doubly linked list me most recent head pe, LRU tail pe. HashMap se node directly access. Access pe: remove and insert at head. Eviction: tail hata do.",
    "approach": [
      "Sentinel head and tail nodes (avoid null checks)",
      "get: if key in map: move to head, return val; else return -1",
      "put: if key in map: update and move to head; else insert at head; if over capacity: evict tail"
    ],
    "time": "O(1) all ops",
    "space": "O(capacity)",
    "pitfalls": [
      "Use sentinel dummy head/tail to avoid null pointer checks during insert/remove",
      "In put: update existing key BEFORE checking capacity (don't evict when just updating)",
      "Remove from map AND list on eviction"
    ],
    "code": "class LRUCache {\n    int cap; LinkedHashMap<Integer,Integer> cache=new LinkedHashMap<>();\n    LRUCache(int cap){ this.cap=cap; }\n    int get(int key){\n        if (!cache.containsKey(key)) return -1;\n        cache.put(key,cache.remove(key)); return cache.get(key);\n    }\n    void put(int key, int val){\n        cache.remove(key); cache.put(key,val);\n        if (cache.size()>cap) cache.remove(cache.keySet().iterator().next());\n    }\n}",
    "variants": [
      "LFU Cache (LC 460)",
      "Design In-Memory File System (LC 588)"
    ],
    "summary": "Design an LRU (Least Recently Used) cache with O(1) get and put."
  },
  {
    "id": 142,
    "name": "Linked List Cycle II",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "find start of cycle in a linked list, O(1) space",
      "Floyd's cycle detection — phase 2 finds entry"
    ],
    "coreIdea": "Floyd's: slow/fast meet inside cycle. Reset slow to head. Advance both one step at a time — they meet at the cycle entry point. Mathematical proof: distance to entry equals distance from meeting point to entry.",
    "coreIdeaHinglish": "Phase 1: slow aur fast milte hain cycle ke andar. Phase 2: slow ko head pe reset karo. Dono ek step me chalao — jahan milein, woh cycle ka start hai.",
    "approach": [
      "Phase 1: slow=head, fast=head; advance until slow==fast",
      "Phase 2: slow=head; advance both by 1 until slow==fast",
      "Return slow"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Phase 1: if fast or fast.next is None → no cycle, return None",
      "Phase 2: reset slow to HEAD (not to meeting point); advance ONE step at a time (not two)",
      "Don't return head — return the meeting point in phase 2"
    ],
    "code": "ListNode slow=head, fast=head;\nwhile (fast!=null && fast.next!=null) {\n    slow=slow.next; fast=fast.next.next;\n    if (slow==fast) break;\n}\nif (fast==null || fast.next==null) return null;\nslow=head;\nwhile (slow!=fast) { slow=slow.next; fast=fast.next; }\nreturn slow;",
    "variants": [
      "Find the Duplicate Number (LC 287)",
      "Linked List Cycle (LC 141)"
    ],
    "summary": "Find the node where a cycle begins in a linked list, or return null if no cycle exists."
  },
  {
    "id": 24,
    "name": "Swap Nodes in Pairs",
    "difficulty": "Medium",
    "pattern": "Linked List",
    "trigger": [
      "swap every two adjacent nodes in-place",
      "dummy node + pointer rewiring"
    ],
    "coreIdea": "Use a dummy node. For each pair (first, second): rewire dummy → second → first → rest. Advance to next pair.",
    "coreIdeaHinglish": "Dummy node se shuru karo. Har pair ke liye: prev→second, second→first, first→aage wala pair. Advance karo.",
    "approach": [
      "dummy → head; prev = dummy",
      "While prev.next and prev.next.next: first=prev.next, second=prev.next.next",
      "first.next=second.next; second.next=first; prev.next=second; prev=first"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Save first.next BEFORE rewiring (it becomes the head of the next pair)",
      "After swap, first is the tail of the pair — prev = first for next iteration",
      "Dummy node handles the case where head itself is swapped"
    ],
    "code": "ListNode dummy=new ListNode(0,head), prev=dummy;\nwhile (prev.next!=null && prev.next.next!=null) {\n    ListNode a=prev.next, b=prev.next.next;\n    prev.next=b; a.next=b.next; b.next=a; prev=a;\n}\nreturn dummy.next;",
    "variants": [
      "Reverse Nodes in K-Group (LC 25)",
      "Reverse Linked List II (LC 92)"
    ],
    "summary": "Swap every two adjacent nodes in a linked list and return the new head."
  },
  {
    "id": 25,
    "name": "Reverse Nodes in K-Group",
    "difficulty": "Hard",
    "pattern": "Linked List",
    "trigger": [
      "reverse every k nodes in a linked list, in-place",
      "check k nodes exist before reversing"
    ],
    "coreIdea": "Count k nodes ahead. If fewer than k remain, leave as-is. Otherwise reverse the group and recursively (or iteratively) handle the rest.",
    "coreIdeaHinglish": "K nodes aage count karo. K se kam hain? Waise hi rehne do. K hain? Reverse karo, phir remaining ke liye recursively same karo.",
    "approach": [
      "Check if k nodes exist from current position",
      "Reverse k nodes iteratively; tail of reversed group connects to recursive result",
      "Return new head of reversed group"
    ],
    "time": "O(n)",
    "space": "O(n/k) recursion stack",
    "pitfalls": [
      "Check k nodes BEFORE reversing — partial groups stay unchanged",
      "After reversal, the original head becomes the tail — connect it to the next group",
      "Iterative approach uses a dummy node and pointer gymnastics for O(1) space"
    ],
    "code": "ListNode dummy=new ListNode(0,head), groupPrev=dummy;\nwhile (true) {\n    ListNode kth=getKth(groupPrev,k);\n    if (kth==null) break;\n    ListNode groupNext=kth.next;\n    ListNode prev=groupNext, cur=groupPrev.next;\n    while (cur!=groupNext) { ListNode nxt=cur.next; cur.next=prev; prev=cur; cur=nxt; }\n    ListNode tmp=groupPrev.next; groupPrev.next=kth; groupPrev=tmp;\n}\nreturn dummy.next;\n\nListNode getKth(ListNode cur, int k) { while(cur!=null&&k-->0) cur=cur.next; return cur; }",
    "variants": [
      "Swap Nodes in Pairs (LC 24)",
      "Reverse Linked List II (LC 92)"
    ],
    "summary": "Reverse the nodes of a linked list in groups of k at a time."
  }
]);
