// Sliding Window — 7 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 3,
    "name": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "pattern": "Sliding Window",
    "trigger": [
      "longest/shortest substring with constraint",
      "constraint checkable as window grows/shrinks"
    ],
    "coreIdea": "Expand right pointer; on duplicate, jump left past the previous occurrence. Track max length.",
    "coreIdeaHinglish": "Window ko right se expand karte jao. Duplicate mile? Left ko us duplicate ke pichle index ke +1 pe jump karwao. Max length yaad rakho.",
    "approach": [
      "Map: char → last index seen",
      "Move right; if seen[c] exists AND seen[c] >= left: left = seen[c] + 1",
      "Update seen[c] = right",
      "ans = max(ans, right - left + 1)"
    ],
    "time": "O(n)",
    "space": "O(min(n, charset))",
    "pitfalls": [
      "Forgetting 'seen[c] >= left' — shrinks window when duplicate is OUTSIDE current window",
      "Off-by-one: length is right - left + 1, not right - left",
      "Setting left = seen[c] instead of seen[c] + 1"
    ],
    "code": "int left = 0, ans = 0;\nMap<Character, Integer> seen = new HashMap<>();\nfor (int right = 0; right < s.length(); right++) {\n    char c = s.charAt(right);\n    if (seen.containsKey(c) && seen.get(c) >= left)\n        left = seen.get(c) + 1;\n    seen.put(c, right);\n    ans = Math.max(ans, right - left + 1);\n}\nreturn ans;",
    "variants": [
      "Longest Substring with At Most K Distinct (LC 340)",
      "Minimum Window Substring (LC 76)"
    ],
    "animation": "slidingWindow",
    "summary": "Find the length of the longest substring that contains no repeated characters."
  },
  {
    "id": 424,
    "name": "Longest Repeating Character Replacement",
    "difficulty": "Medium",
    "pattern": "Sliding Window",
    "trigger": [
      "replace at most k characters to make substring all same",
      "longest substring where one char can dominate with k replacements"
    ],
    "coreIdea": "Track the most frequent char count in the window. If (window_size - maxFreq) > k, slide left. The window never shrinks below its historical maximum.",
    "coreIdeaHinglish": "Window me jo char sabse zyada baar aata hai, uski count track karo. Baaki sab replace karne padte hain — agar woh k se zyada hai, left badao. Window ka size kabhi pichle max se chhota nahi hota.",
    "approach": [
      "count[26] freq array, maxFreq = 0, left = 0",
      "Add s[right]: count[s[right]]++, update maxFreq",
      "If (right - left + 1) - maxFreq > k: count[s[left]]--, left++",
      "ans = max(ans, right - left + 1)"
    ],
    "time": "O(n)",
    "space": "O(1) — fixed 26-char array",
    "pitfalls": [
      "maxFreq never decreases — intentional; we only care about equal-or-larger windows",
      "Don't recompute maxFreq after shrinking — skip it, the window size won't grow unless a new max is found",
      "Characters are uppercase only — use ord(c) - ord('A') for index"
    ],
    "code": "int[] count = new int[26];\nint left = 0, maxFreq = 0, ans = 0;\nfor (int right = 0; right < s.length(); right++) {\n    maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']);\n    while ((right - left + 1) - maxFreq > k)\n        count[s.charAt(left++) - 'A']--;\n    ans = Math.max(ans, right - left + 1);\n}\nreturn ans;",
    "variants": [
      "Max Consecutive Ones III (LC 1004)",
      "Maximize the Confusion of an Exam (LC 2024)"
    ],
    "summary": "Find the longest substring containing the same letter you can get by replacing at most k characters."
  },
  {
    "id": 567,
    "name": "Permutation in String",
    "difficulty": "Medium",
    "pattern": "Sliding Window",
    "trigger": [
      "does any permutation of s1 appear as substring in s2?",
      "fixed-size window — size locked to len(s1)"
    ],
    "coreIdea": "Fixed window of size len(s1) slides over s2. Match frequency maps — equal maps mean a permutation exists at that position.",
    "coreIdeaHinglish": "Window ka size fix hai — len(s1). Ek char right se add, ek left se nikalo. Frequency map match hua? Permutation mil gayi.",
    "approach": [
      "need = Counter(s1), window = Counter(s2[:len(s1)])",
      "If need == window: return True",
      "For i in range(len(s1), len(s2)): add s2[i], remove s2[i - len(s1)]",
      "If need == window: return True after each slide"
    ],
    "time": "O(n)",
    "space": "O(1) — 26 distinct chars max",
    "pitfalls": [
      "Window size is FIXED at len(s1) — never let it grow or shrink",
      "Initialize window with first len(s1) chars BEFORE the loop, not inside it",
      "Delete keys with zero count from window (or use defaultdict) so equality check works correctly"
    ],
    "code": "int[] need = new int[26], window = new int[26];\nfor (char c : s1.toCharArray()) need[c - 'a']++;\nint left = 0;\nfor (int right = 0; right < s2.length(); right++) {\n    window[s2.charAt(right) - 'a']++;\n    if (right - left + 1 > s1.length())\n        window[s2.charAt(left++) - 'a']--;\n    if (Arrays.equals(need, window)) return true;\n}\nreturn false;",
    "variants": [
      "Find All Anagrams in a String (LC 438)",
      "Minimum Window Substring (LC 76)"
    ],
    "summary": "Determine whether any permutation of string p is a substring of string s."
  },
  {
    "id": 438,
    "name": "Find All Anagrams in a String",
    "difficulty": "Medium",
    "pattern": "Sliding Window",
    "trigger": [
      "find all starting indices where anagram of p exists in s",
      "fixed-size window — same length as the pattern"
    ],
    "coreIdea": "Identical to LC 567 — fixed window of len(p). Collect every start index where window freq matches p's freq instead of returning on first match.",
    "coreIdeaHinglish": "LC 567 ka hi chhota bhai. Fark sirf itna hai ki pehli match pe return nahi karna — saari positions collect karo list me.",
    "approach": [
      "need = Counter(p), window = Counter(s[:len(p)]), res = []",
      "Check index 0 before the loop",
      "Slide: window[s[i]] += 1; remove s[i - len(p)]; delete zero-count keys",
      "If need == window: res.append(i - len(p) + 1)"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "First window (index 0) must be checked before the loop starts, not inside it",
      "Start index of match is i - len(p) + 1, not i",
      "Same counter-deletion gotcha as LC 567 — always del key when count hits 0"
    ],
    "code": "Map<Character,Integer> need=new HashMap<>(), window=new HashMap<>();\nfor (char c : p.toCharArray()) need.merge(c,1,Integer::sum);\nList<Integer> res=new ArrayList<>();\nint left=0, formed=0;\nfor (int right=0; right<s.length(); right++) {\n    char c=s.charAt(right);\n    window.merge(c,1,Integer::sum);\n    if (need.containsKey(c) && window.get(c).equals(need.get(c))) formed++;\n    if (right-left+1==p.length()) {\n        if (formed==need.size()) res.add(left);\n        char l=s.charAt(left++);\n        if (need.containsKey(l) && window.get(l).equals(need.get(l))) formed--;\n        window.merge(l,-1,Integer::sum);\n    }\n}\nreturn res;",
    "variants": [
      "Permutation in String (LC 567)",
      "Minimum Window Substring (LC 76)"
    ],
    "summary": "Find all starting indices in string s where a substring is an anagram of string p."
  },
  {
    "id": 209,
    "name": "Minimum Size Subarray Sum",
    "difficulty": "Medium",
    "pattern": "Sliding Window",
    "trigger": [
      "minimum length subarray with sum >= target",
      "all positive integers — shrinking always reduces sum"
    ],
    "coreIdea": "Expand right until sum >= target, then shrink from left to find the smallest valid window. Positive integers guarantee shrinking always reduces the sum.",
    "coreIdeaHinglish": "Right se sum badhao jab tak target reach na ho. Pahuncha? Left se shrink karte jao — jab tak sum valid rahe, minimum length note karo.",
    "approach": [
      "left = curr = 0, ans = inf",
      "For each right: curr += nums[right]",
      "While curr >= target: ans = min(ans, right - left + 1); curr -= nums[left]; left++",
      "Return ans if ans != inf else 0"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Only works for positive numbers — negatives break the shrink assumption (sum can increase when shrinking)",
      "Use while NOT if to shrink: must keep shrinking as long as condition still holds",
      "Return 0 if ans is still inf — means no valid subarray exists"
    ],
    "code": "int left=0, sum=0, res=Integer.MAX_VALUE;\nfor (int right=0; right<nums.length; right++) {\n    sum+=nums[right];\n    while (sum>=target) { res=Math.min(res,right-left+1); sum-=nums[left++]; }\n}\nreturn res==Integer.MAX_VALUE ? 0 : res;",
    "variants": [
      "Shortest Subarray with Sum at Least K (LC 862) — negatives → monotonic deque",
      "Maximum Size Subarray Sum Equals K (LC 325)"
    ],
    "summary": "Find the minimum length of a contiguous subarray whose sum is at least target."
  },
  {
    "id": 1004,
    "name": "Max Consecutive Ones III",
    "difficulty": "Medium",
    "pattern": "Sliding Window",
    "trigger": [
      "max consecutive 1s with at most k zero flips",
      "longest window containing at most k zeros"
    ],
    "coreIdea": "Expand right freely; track zero count. When zeros > k, shrink from left, decrementing zero count if the dropped element was 0. Simpler cousin of LC 424.",
    "coreIdeaHinglish": "Window me zyada se zyada k zeros allow hain. Zeros zyada ho gaye? Left badao aur zero count ghata lo agar woh element 0 tha. Bas.",
    "approach": [
      "left = zeros = ans = 0",
      "For each right: if nums[right] == 0: zeros++",
      "While zeros > k: if nums[left] == 0: zeros--; left++",
      "ans = max(ans, right - left + 1)"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Use while not if to shrink — multiple zeros may need to exit before window is valid again",
      "Binary array only — generalizes to 'at most k of some element' for other problems",
      "Answer is window size (right - left + 1), not the count of zeros or ones"
    ],
    "code": "int left=0, zeros=0, ans=0;\nfor (int right=0; right<nums.length; right++) {\n    if (nums[right]==0) zeros++;\n    while (zeros>k) if (nums[left++]==0) zeros--;\n    ans=Math.max(ans,right-left+1);\n}\nreturn ans;",
    "variants": [
      "Longest Repeating Character Replacement (LC 424)",
      "Maximize the Confusion of an Exam (LC 2024)"
    ],
    "summary": "Find the maximum number of consecutive 1s in a binary array after flipping at most k 0s."
  },
  {
    "id": 76,
    "name": "Minimum Window Substring",
    "difficulty": "Hard",
    "pattern": "Sliding Window",
    "trigger": [
      "minimum window in s containing all chars of t",
      "shrink from left only when window is fully valid"
    ],
    "coreIdea": "Expand right until all t chars are covered (tracked by a `formed` counter). Then shrink left greedily to minimize. Record the smallest valid window.",
    "coreIdeaHinglish": "Pehle window ko bada karo jab tak t ke sab chars cover na ho. Phir left se shrink karo aur minimum note karo. `formed` counter batata hai ki window valid hai ya nahi.",
    "approach": [
      "need = Counter(t), have = {}, formed = 0, required = len(need)",
      "Expand right: have[c]++; if have[c] == need[c]: formed++",
      "While formed == required: update ans; shrink left: if have[s[left]] drops below need: formed--; left++"
    ],
    "time": "O(|s| + |t|)",
    "space": "O(|s| + |t|)",
    "pitfalls": [
      "`formed` only increments when have[c] reaches EXACTLY need[c] — not for every char added",
      "Decrement have[s[left]] BEFORE moving left past it (order matters for formed check)",
      "Return '' if no valid window found — don't forget this edge case"
    ],
    "code": "Map<Character, Integer> need = new HashMap<>(), window = new HashMap<>();\nfor (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);\nint left = 0, formed = 0, required = need.size();\nint[] ans = {-1, 0, 0};\nfor (int right = 0; right < s.length(); right++) {\n    char c = s.charAt(right);\n    window.merge(c, 1, Integer::sum);\n    if (need.containsKey(c) && window.get(c).equals(need.get(c))) formed++;\n    while (formed == required) {\n        if (ans[0] == -1 || right - left + 1 < ans[0]) ans = new int[]{right-left+1, left, right};\n        char l = s.charAt(left++);\n        window.merge(l, -1, Integer::sum);\n        if (need.containsKey(l) && window.get(l) < need.get(l)) formed--;\n    }\n}\nreturn ans[0] == -1 ? \"\" : s.substring(ans[1], ans[2]+1);",
    "variants": [
      "Permutation in String (LC 567)",
      "Smallest Range Covering Elements from K Lists (LC 632)"
    ],
    "summary": "Find the minimum-length substring of s that contains all characters of t (including duplicates)."
  }
]);
