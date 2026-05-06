// Backtracking — 9 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 78,
    "name": "Subsets",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all subsets of distinct integers (power set)",
      "every prefix of every recursive path is a valid subset"
    ],
    "coreIdea": "Backtrack: at each call, record the current subset. Then try each remaining element as the next inclusion. O(2^n) subsets, each O(n) to copy.",
    "coreIdeaHinglish": "Backtrack karo. Har call ke shuru me current subset result me add karo. Phir baaki elements me se ek ek choose karo aur recurse karo.",
    "approach": [
      "bt(i, curr): res.append(curr[:])",
      "For j in range(i, n): curr.append(nums[j]); bt(j+1, curr); curr.pop()"
    ],
    "time": "O(2ⁿ · n)",
    "space": "O(n) stack",
    "pitfalls": [
      "Append curr[:] (a copy) — not curr itself (the reference changes on pop)",
      "Append at the START of each call — not just at the leaf",
      "Iterative: for each element, double the result by adding element to every existing subset"
    ],
    "code": "List<List<Integer>> res = new ArrayList<>();\nvoid bt(int[] nums, int i, List<Integer> curr) {\n    res.add(new ArrayList<>(curr));\n    for (int j = i; j < nums.length; j++) {\n        curr.add(nums[j]);\n        bt(nums, j+1, curr);\n        curr.remove(curr.size()-1);\n    }\n}\nbt(nums, 0, new ArrayList<>());\nreturn res;",
    "variants": [
      "Subsets II (LC 90) — with duplicates",
      "Combination Sum (LC 39)"
    ],
    "animation": "subsetTree",
    "summary": "Generate all possible subsets (the power set) of a distinct integer array."
  },
  {
    "id": 39,
    "name": "Combination Sum",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all combinations summing to target, elements REUSABLE"
    ],
    "coreIdea": "Backtrack but recurse with i (NOT i+1) to allow reuse. Sort first to enable early break when running sum exceeds target.",
    "coreIdeaHinglish": "Same number bar bar use ho sakta hai, isliye recursion me i hi pass karo (i+1 nahi). Sort karke total > target hote hi break — fast.",
    "approach": [
      "Sort candidates",
      "bt(start, curr, total): if total == target: append, return",
      "For i in [start, n): if total + cand[i] > target: break; add, bt(i, ...), pop"
    ],
    "time": "O(N^(T/M))",
    "space": "O(T/M)",
    "pitfalls": [
      "Recurse with i (not i+1) — that's the reuse mechanic",
      "Sorting enables the early break when sum exceeds target",
      "Append curr[:] not curr — mutable list will be modified on backtrack"
    ],
    "code": "List<List<Integer>> res = new ArrayList<>();\nArrays.sort(candidates);\nvoid bt(int start, List<Integer> curr, int total) {\n    if (total == target) { res.add(new ArrayList<>(curr)); return; }\n    for (int i = start; i < candidates.length; i++) {\n        if (total + candidates[i] > target) break;\n        curr.add(candidates[i]);\n        bt(i, curr, total + candidates[i]);\n        curr.remove(curr.size()-1);\n    }\n}\nbt(0, new ArrayList<>(), 0);\nreturn res;",
    "variants": [
      "Combination Sum II (LC 40)",
      "Combination Sum III (LC 216)"
    ],
    "summary": "Find all unique combinations of candidates that sum to a target, where each number may be used unlimited times."
  },
  {
    "id": 79,
    "name": "Word Search",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "find if word exists as a connected path of adjacent cells in a 2D grid"
    ],
    "coreIdea": "DFS from each cell. At each step, match board[r][c] with word[i]. Mark the cell visited by overwriting with '#'. Restore after DFS (backtrack).",
    "coreIdeaHinglish": "Har cell se DFS shuru karo. board[r][c] == word[i]? Aage badho. Cell ko '#' se mark karo. DFS ke baad original char restore karo.",
    "approach": [
      "For each (r,c): try dfs(r, c, 0)",
      "dfs: if i==len(word): return True; bounds+visited+char check",
      "board[r][c]='#'; recurse 4 dirs; board[r][c]=word[i]; return res"
    ],
    "time": "O(M·N·4·3^(L-1))",
    "space": "O(L) recursion",
    "pitfalls": [
      "Mark BEFORE recursing, restore AFTER — prevents revisiting the same cell on one path",
      "Check char match BEFORE marking — fail fast",
      "Return early on first True — don't exhaustively search all paths"
    ],
    "code": "boolean dfs(char[][] board, String word, int r, int c, int i) {\n    if (i == word.length()) return true;\n    if (r<0||r>=board.length||c<0||c>=board[0].length||board[r][c]!=word.charAt(i)) return false;\n    char tmp = board[r][c]; board[r][c] = '#';\n    boolean found = dfs(board,word,r+1,c,i+1)||dfs(board,word,r-1,c,i+1)||dfs(board,word,r,c+1,i+1)||dfs(board,word,r,c-1,i+1);\n    board[r][c] = tmp;\n    return found;\n}\nfor (int r=0;r<board.length;r++) for (int c=0;c<board[0].length;c++) if(dfs(board,word,r,c,0)) return true;\nreturn false;",
    "variants": [
      "Word Search II (LC 212) — trie + DFS"
    ],
    "summary": "Determine if a word can be formed by sequentially adjacent cells in a character grid."
  },
  {
    "id": 90,
    "name": "Subsets II",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all unique subsets when input may have duplicates"
    ],
    "coreIdea": "Sort first. Same backtracking as LC 78, but skip duplicate elements at the same recursion depth: if j > i and nums[j] == nums[j-1], skip.",
    "coreIdeaHinglish": "Sort karo. LC 78 jaisa backtrack, par same depth pe agar nums[j] == nums[j-1] aur j > i, skip karo — duplicate subsets avoid hoti hain.",
    "approach": [
      "Sort nums",
      "bt(i, curr): append curr[:]",
      "For j in range(i, n): if j > i and nums[j]==nums[j-1]: continue; add/recurse/pop"
    ],
    "time": "O(2ⁿ · n)",
    "space": "O(n)",
    "pitfalls": [
      "Skip condition: j > i (not j > 0) — only skip AT THE SAME recursion level",
      "Duplicates at different levels form different subsets and are fine",
      "Sorting is mandatory — the skip check relies on equal elements being adjacent"
    ],
    "code": "Arrays.sort(nums);\nList<List<Integer>> res = new ArrayList<>();\nvoid bt(int i, List<Integer> curr) {\n    res.add(new ArrayList<>(curr));\n    for (int j=i; j<nums.length; j++) {\n        if (j>i && nums[j]==nums[j-1]) continue;\n        curr.add(nums[j]); bt(j+1, curr); curr.remove(curr.size()-1);\n    }\n}\nbt(0, new ArrayList<>());\nreturn res;",
    "variants": [
      "Subsets (LC 78)",
      "Combination Sum II (LC 40)"
    ],
    "summary": "Generate all possible subsets of an array with duplicates, with no duplicate subsets in the output."
  },
  {
    "id": 40,
    "name": "Combination Sum II",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all unique combinations summing to target; each element used at most once"
    ],
    "coreIdea": "Sort. Backtrack with i+1 (no reuse). Skip duplicates at the same depth (j > start and candidates[j] == candidates[j-1]).",
    "coreIdeaHinglish": "Sort karo. i+1 pass karo — no reuse. Same depth pe duplicates skip karo. LC 39 aur LC 90 ka fusion.",
    "approach": [
      "Sort candidates",
      "bt(start, curr, total): if total==target: append",
      "For i from start: if i>start and cand[i]==cand[i-1]: skip; if over: break; add/bt(i+1)/pop"
    ],
    "time": "O(2ⁿ · n)",
    "space": "O(n)",
    "pitfalls": [
      "i+1 in recursion (no reuse) — unlike LC 39 which passes i",
      "Skip condition i > start, not i > 0 (same-level dedup only)",
      "Sort + break when total+cand[i] > target for pruning"
    ],
    "code": "Arrays.sort(candidates);\nList<List<Integer>> res = new ArrayList<>();\nvoid bt(int start, List<Integer> curr, int total) {\n    if (total==target) { res.add(new ArrayList<>(curr)); return; }\n    for (int i=start; i<candidates.length; i++) {\n        if (i>start && candidates[i]==candidates[i-1]) continue;\n        if (total+candidates[i]>target) break;\n        curr.add(candidates[i]); bt(i+1, curr, total+candidates[i]); curr.remove(curr.size()-1);\n    }\n}\nbt(0, new ArrayList<>(), 0);\nreturn res;",
    "variants": [
      "Combination Sum (LC 39) — reusable elements",
      "Subsets II (LC 90)"
    ],
    "summary": "Find all unique combinations of candidates that sum to a target, where each number may be used at most once."
  },
  {
    "id": 46,
    "name": "Permutations",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all permutations of distinct integers",
      "every element can go in every position"
    ],
    "coreIdea": "Backtrack with a used set. At each step, pick any unused element, add it, recurse for the next position, then remove it.",
    "coreIdeaHinglish": "Used set rakho. Har position pe koi bhi unused element pick karo, mark karo, recurse karo, unmark karo. Jab sab use ho jaayein, permutation complete.",
    "approach": [
      "bt(curr): if len==n: append curr[:]",
      "For n in nums: if n in used: skip; used.add(n); curr.append(n); bt; remove"
    ],
    "time": "O(n! · n)",
    "space": "O(n)",
    "pitfalls": [
      "Append curr[:] not curr — list is mutable",
      "used tracks values, not indices — fine for distinct elements",
      "Swap-in-place variant avoids the used set but is harder to reason about"
    ],
    "code": "List<List<Integer>> res = new ArrayList<>();\nSet<Integer> used = new HashSet<>();\nvoid bt(List<Integer> curr) {\n    if (curr.size()==nums.length) { res.add(new ArrayList<>(curr)); return; }\n    for (int n : nums) {\n        if (used.contains(n)) continue;\n        used.add(n); curr.add(n); bt(curr); used.remove(n); curr.remove(curr.size()-1);\n    }\n}\nbt(new ArrayList<>());\nreturn res;",
    "variants": [
      "Permutations II (LC 47) — with duplicates",
      "Next Permutation (LC 31)"
    ],
    "summary": "Return all possible permutations of a distinct integer array."
  },
  {
    "id": 47,
    "name": "Permutations II",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all unique permutations when input may have duplicates",
      "sort + skip: don't use a duplicate before its earlier copy"
    ],
    "coreIdea": "Sort. Use a used[] boolean array. Skip element i if: (1) used[i] is True, OR (2) nums[i]==nums[i-1] AND NOT used[i-1]. Rule 2 ensures duplicates always appear in their original relative order.",
    "coreIdeaHinglish": "Sort karo. Used array rakho. Agar nums[i]==nums[i-1] aur nums[i-1] abhi used nahi, skip karo — yeh trick same value ke elements ko ek fixed order me rakhti hai, duplicate perms rokti hai.",
    "approach": [
      "Sort; used = [False]*n",
      "bt(curr): if full: append",
      "For i: if used[i]: skip; if i>0 and nums[i]==nums[i-1] and not used[i-1]: skip; use/recurse/unuse"
    ],
    "time": "O(n! · n)",
    "space": "O(n)",
    "pitfalls": [
      "The dedup condition is 'not used[i-1]' — ensures later duplicate is NEVER chosen before earlier one",
      "Sort is mandatory for this condition to work",
      "Used tracks by INDEX (not value) — needed since values can repeat"
    ],
    "code": "Arrays.sort(nums);\nList<List<Integer>> res = new ArrayList<>();\nboolean[] used = new boolean[nums.length];\nvoid bt(List<Integer> curr) {\n    if (curr.size()==nums.length) { res.add(new ArrayList<>(curr)); return; }\n    for (int i=0; i<nums.length; i++) {\n        if (used[i]) continue;\n        if (i>0 && nums[i]==nums[i-1] && !used[i-1]) continue;\n        used[i]=true; curr.add(nums[i]); bt(curr); used[i]=false; curr.remove(curr.size()-1);\n    }\n}\nbt(new ArrayList<>());\nreturn res;",
    "variants": [
      "Permutations (LC 46) — distinct elements",
      "Combination Sum II (LC 40)"
    ],
    "summary": "Return all distinct permutations of an integer array that may contain duplicates."
  },
  {
    "id": 131,
    "name": "Palindrome Partitioning",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all ways to partition string s into palindromic substrings"
    ],
    "coreIdea": "Backtrack with a start index. For each end position, if s[start:end] is a palindrome, add it to the current partition and recurse from end. When start reaches the end of s, record the partition.",
    "coreIdeaHinglish": "start se backtrack karo. Har end position pe check karo: s[start:end] palindrome hai? Hai to add karo aur recurse. start == n? Partition complete.",
    "approach": [
      "bt(start, curr): if start==n: append curr[:]",
      "For end in range(start+1, n+1): if is_pal(s[start:end]): curr.append; bt(end); curr.pop"
    ],
    "time": "O(n · 2ⁿ)",
    "space": "O(n)",
    "pitfalls": [
      "Check palindrome BEFORE recursing — don't backtrack into non-palindrome partitions",
      "s[start:end] not s[start:end+1] — Python slicing is exclusive at end",
      "Precompute a palindrome DP table for O(1) checks if optimizing"
    ],
    "code": "List<List<String>> res = new ArrayList<>();\nvoid bt(int start, List<String> curr) {\n    if (start==s.length()) { res.add(new ArrayList<>(curr)); return; }\n    for (int end=start+1; end<=s.length(); end++) {\n        String sub = s.substring(start, end);\n        if (isPal(sub)) { curr.add(sub); bt(end, curr); curr.remove(curr.size()-1); }\n    }\n}\nboolean isPal(String s) { int l=0,r=s.length()-1; while(l<r) if(s.charAt(l++)!=s.charAt(r--)) return false; return true; }\nbt(0, new ArrayList<>());\nreturn res;",
    "variants": [
      "Palindrome Partitioning II (LC 132) — min cuts"
    ],
    "summary": "Partition a string into all possible lists of palindromic substrings."
  },
  {
    "id": 17,
    "name": "Letter Combinations of a Phone Number",
    "difficulty": "Medium",
    "pattern": "Backtracking",
    "trigger": [
      "all letter combinations from phone keypad digits"
    ],
    "coreIdea": "Backtrack digit by digit. At position i, try each letter mapped to digits[i], then recurse to i+1. When all digits are consumed, record the combination.",
    "coreIdeaHinglish": "Digit ke saare letters try karo. Har letter ke baad next digit ke liye recurse karo. Jab sab digits use ho jaayein, combination complete.",
    "approach": [
      "phone = {'2':'abc', ..., '9':'wxyz'}",
      "bt(i, curr): if i==len(digits): append curr",
      "For c in phone[digits[i]]: bt(i+1, curr+c)"
    ],
    "time": "O(4ⁿ · n) where n = len(digits)",
    "space": "O(n)",
    "pitfalls": [
      "Return [] for empty input before building the phone map",
      "7 → 'pqrs' and 9 → 'wxyz' have 4 letters each — don't forget",
      "String concatenation (curr + c) avoids needing a separate pop step"
    ],
    "code": "if (digits.isEmpty()) return new ArrayList<>();\nMap<Character,String> phone = Map.of('2',\"abc\",'3',\"def\",'4',\"ghi\",'5',\"jkl\",'6',\"mno\",'7',\"pqrs\",'8',\"tuv\",'9',\"wxyz\");\nList<String> res = new ArrayList<>();\nvoid bt(int i, StringBuilder cur) {\n    if (i==digits.length()) { res.add(cur.toString()); return; }\n    for (char c : phone.get(digits.charAt(i)).toCharArray()) { cur.append(c); bt(i+1,cur); cur.deleteCharAt(cur.length()-1); }\n}\nbt(0, new StringBuilder());\nreturn res;",
    "variants": [
      "Generate Parentheses (LC 22)",
      "Combination Sum (LC 39)"
    ],
    "summary": "Given a digit string, return all possible letter combinations a phone keypad could represent."
  }
]);
