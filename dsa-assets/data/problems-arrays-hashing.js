// Arrays & Hashing — 10 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 49,
    "name": "Group Anagrams",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "group strings that are anagrams of each other",
      "canonical key for any permutation of the same chars"
    ],
    "coreIdea": "Sorted form of a word is its canonical anagram key. Map sorted_word → [words]; all anagrams share the same key.",
    "coreIdeaHinglish": "Har word ko sort karo — anagram hone par sorted form same hogi. Yeh sorted form key hai, values list me daalo. Bas ek pass.",
    "approach": [
      "d = defaultdict(list)",
      "For each word: key = ''.join(sorted(word))",
      "d[key].append(word)",
      "Return list(d.values())"
    ],
    "time": "O(n·k·log k)",
    "space": "O(n·k)",
    "pitfalls": [
      "sorted() returns a list — must join to string (or use tuple) before using as dict key",
      "Alternative O(n·k) key: tuple of 26 char counts (avoids sort cost for large alphabets)",
      "Don't flatten the output — return the grouped lists as-is"
    ],
    "code": "Map<String, List<String>> map = new HashMap<>();\nfor (String s : strs) {\n    char[] arr = s.toCharArray(); Arrays.sort(arr);\n    map.computeIfAbsent(new String(arr), k -> new ArrayList<>()).add(s);\n}\nreturn new ArrayList<>(map.values());",
    "variants": [
      "Valid Anagram (LC 242)",
      "Find All Anagrams in a String (LC 438)"
    ],
    "summary": "Group an array of strings so that anagrams of each other are in the same group."
  },
  {
    "id": 347,
    "name": "Top K Frequent Elements",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "top k most frequent elements, better than O(n log n) sort",
      "frequency → index mapping"
    ],
    "coreIdea": "Bucket sort by frequency. buckets[freq] holds all numbers with that frequency. Collect from highest bucket down until k elements gathered. O(n) — beats heap.",
    "coreIdeaHinglish": "Bucket index = frequency. Sabse zyada frequent ke bucket se collect karo jab tak k elements na mile. Sort se fast, heap se simple.",
    "approach": [
      "count = Counter(nums)",
      "buckets = [[] for _ in range(len(nums) + 1)]",
      "For each num, freq: buckets[freq].append(num)",
      "Collect from buckets[n] down to buckets[1] until k elements"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Heap (nlargest) is O(n log k) — valid but not optimal; bucket sort is O(n)",
      "Bucket index goes up to len(nums) — allocate len+1 buckets",
      "A bucket can hold multiple numbers — flatten while collecting"
    ],
    "code": "Map<Integer, Integer> count = new HashMap<>();\nList<Integer>[] buckets = new List[nums.length + 1];\nfor (int n : nums) count.merge(n, 1, Integer::sum);\nfor (var e : count.entrySet()) {\n    int freq = e.getValue();\n    if (buckets[freq] == null) buckets[freq] = new ArrayList<>();\n    buckets[freq].add(e.getKey());\n}\nList<Integer> res = new ArrayList<>();\nfor (int i = buckets.length - 1; i >= 0 && res.size() < k; i--)\n    if (buckets[i] != null) res.addAll(buckets[i]);\nreturn res.stream().mapToInt(Integer::intValue).toArray();",
    "variants": [
      "Top K Frequent Words (LC 692)",
      "Sort Characters By Frequency (LC 451)"
    ],
    "summary": "Return the k most frequently occurring elements in an array."
  },
  {
    "id": 238,
    "name": "Product of Array Except Self",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "product of all elements except self, no division allowed",
      "O(n) time, O(1) extra space"
    ],
    "coreIdea": "Two passes. Left pass fills ans[i] with product of everything to the left. Right pass multiplies in the suffix product from the right. No division needed.",
    "coreIdeaHinglish": "Pehle left se prefix product bharo, phir right se suffix product multiply karo. Division use mat karo — do passes, ek array.",
    "approach": [
      "ans = [1]*n; prefix = 1",
      "Left pass (i=0 to n-1): ans[i] = prefix; prefix *= nums[i]",
      "Right pass (i=n-1 to 0): suffix=1; ans[i] *= suffix; suffix *= nums[i]"
    ],
    "time": "O(n)",
    "space": "O(1) extra (output array excluded)",
    "pitfalls": [
      "prefix starts at 1 (neutral element for multiply), not nums[0]",
      "Right pass: multiply THEN update suffix (order matters to exclude nums[i])",
      "Output array itself doesn't count toward space complexity per the problem"
    ],
    "code": "int n = nums.length;\nint[] res = new int[n];\nres[0] = 1;\nfor (int i = 1; i < n; i++) res[i] = res[i-1] * nums[i-1];\nint right = 1;\nfor (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }\nreturn res;",
    "variants": [
      "Find Pivot Index (LC 724)",
      "Trapping Rain Water (LC 42)"
    ],
    "summary": "Return an array where each element equals the product of all other elements, without using division."
  },
  {
    "id": 271,
    "name": "Encode and Decode Strings",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "serialize a list of strings over a channel with no forbidden chars",
      "length-prefix encoding to handle arbitrary characters"
    ],
    "coreIdea": "Encode each string as `len#content`. Decoder reads digits until '#', then slices exactly that many characters. Works even when strings contain '#' or other special chars.",
    "coreIdeaHinglish": "Har string ke aage uski length aur '#' daal do. Decode karte waqt digits padho jab tak '#' na mile, phir exactly utne chars lo — '#' string ke andar ho, tab bhi safe.",
    "approach": [
      "Encode: for s in strs: output += f'{len(s)}#{s}'",
      "Decode: while i < len(s): j = s.index('#', i); n = int(s[i:j]); word = s[j+1:j+1+n]; i = j+1+n"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Single delimiter like '|' fails if strings contain '|' — length prefix is the safe solution",
      "s.index('#', i) searches from i onward — avoids matching '#' inside a previous string",
      "Decode: i advances by j+1+n, not by n alone"
    ],
    "code": "// encode\nStringBuilder sb = new StringBuilder();\nfor (String s : strs) sb.append(s.length()).append('#').append(s);\nreturn sb.toString();\n\n// decode\nList<String> res = new ArrayList<>();\nint i = 0;\nwhile (i < s.length()) {\n    int j = s.indexOf('#', i);\n    int len = Integer.parseInt(s.substring(i, j));\n    res.add(s.substring(j+1, j+1+len));\n    i = j + 1 + len;\n}\nreturn res;",
    "variants": [
      "Serialize and Deserialize Binary Tree (LC 297)"
    ],
    "summary": "Design encode and decode functions to convert a list of strings to a single string and back."
  },
  {
    "id": 128,
    "name": "Longest Consecutive Sequence",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "longest streak of consecutive integers",
      "O(n) required — can't sort"
    ],
    "coreIdea": "Put all numbers in a set. For each number that is a sequence START (n-1 not in set), count the streak. Each number is visited at most twice total → O(n).",
    "coreIdeaHinglish": "Set me sab daal do. Sirf un numbers se streak shuru karo jinka (n-1) set me nahi hai — yeh sequence ka start hai. Streak count karo, max track karo.",
    "approach": [
      "num_set = set(nums)",
      "For n in num_set: if n-1 not in num_set (sequence start):",
      "Count streak: length = 0; while n+length in num_set: length++",
      "ans = max(ans, length)"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Must iterate over the SET (not nums) to avoid TLE from duplicate elements triggering multiple streak-counts",
      "Only start counting when n-1 is NOT in set — else you'd count from the middle of a streak",
      "Streak check uses the set, not index arithmetic — gaps between values don't matter"
    ],
    "code": "Set<Integer> set = new HashSet<>();\nfor (int n : nums) set.add(n);\nint best = 0;\nfor (int n : set) if (!set.contains(n - 1)) {\n    int len = 0, cur = n;\n    while (set.contains(cur++)) len++;\n    best = Math.max(best, len);\n}\nreturn best;",
    "variants": [
      "Longest Arithmetic Subsequence (LC 1027)",
      "Binary Tree Longest Consecutive Sequence (LC 298)"
    ],
    "summary": "Find the length of the longest sequence of consecutive integers in an unsorted array, in O(n)."
  },
  {
    "id": 36,
    "name": "Valid Sudoku",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "validate 9×9 board without solving it",
      "check rows, cols, and 3×3 sub-boxes for duplicates"
    ],
    "coreIdea": "One pass over the 81 cells. For each filled cell, check three sets: its row, its column, and its 3×3 box (indexed by (r//3)*3 + c//3). Reject on first duplicate.",
    "coreIdeaHinglish": "Ek pass me sab check karo — row, col, aur box (index = (r//3)*3 + c//3). Set me pehle se hai? Invalid. Nahi hai? Teeno sets me add karo.",
    "approach": [
      "rows[9], cols[9], boxes[9] — each a set",
      "For (r, c) where board[r][c] != '.': box = (r//3)*3 + c//3",
      "If digit in rows[r] or cols[c] or boxes[box]: return False",
      "Add digit to all three sets; return True"
    ],
    "time": "O(1) — always 81 cells",
    "space": "O(1) — bounded by 9×9",
    "pitfalls": [
      "Box index formula: (r//3)*3 + c//3 — not r*3+c (that gives wrong box)",
      "Board stores strings ('1'-'9'), not ints — compare as strings",
      "Skip '.' cells before any set check"
    ],
    "code": "Set<String> seen = new HashSet<>();\nfor (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {\n    char v = board[r][c];\n    if (v == '.') continue;\n    if (!seen.add(v + \" row\" + r) || !seen.add(v + \" col\" + c) || !seen.add(v + \" box\" + (r/3) + (c/3)))\n        return false;\n}\nreturn true;",
    "variants": [
      "Sudoku Solver (LC 37)"
    ],
    "summary": "Determine whether a partially filled 9×9 Sudoku board is valid."
  },
  {
    "id": 560,
    "name": "Subarray Sum Equals K",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "count subarrays with sum exactly k",
      "prefix sum + complement lookup (works with negatives)"
    ],
    "coreIdea": "prefix[i] - prefix[j] == k ↔ prefix[j] == prefix[i] - k. Maintain a running prefix sum and a count map of all prefix sums seen so far.",
    "coreIdeaHinglish": "Prefix sum track karo. Har jagah check karo ki (curr - k) pehle dikh chuka hai — agar haan, to woh ek valid subarray hai. HashMap me counts rakho.",
    "approach": [
      "prefix_count = {0: 1}, curr = 0, ans = 0",
      "For each n: curr += n",
      "ans += prefix_count.get(curr - k, 0)",
      "prefix_count[curr] += 1"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Initialize {0: 1} — handles subarrays starting at index 0 (sum == k from the beginning)",
      "Works with negatives (unlike sliding window which requires positive nums)",
      "Counts subarrays, not indices — don't try to reconstruct the subarray from this"
    ],
    "code": "Map<Integer,Integer> map=new HashMap<>();\nmap.put(0,1);\nint sum=0, count=0;\nfor (int n : nums) {\n    sum+=n;\n    count+=map.getOrDefault(sum-k,0);\n    map.merge(sum,1,Integer::sum);\n}\nreturn count;",
    "variants": [
      "Continuous Subarray Sum (LC 523)",
      "Subarray Sums Divisible by K (LC 974)"
    ],
    "summary": "Count the number of contiguous subarrays whose sum equals k."
  },
  {
    "id": 380,
    "name": "Insert Delete GetRandom O(1)",
    "difficulty": "Medium",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "O(1) insert, O(1) delete, AND O(1) getRandom on a set",
      "need index-based random access with fast deletion"
    ],
    "coreIdea": "ArrayList + HashMap (val → index). Deletion uses swap-with-last: move the last element into the deleted slot, update its map entry, pop the last. No gaps in the array.",
    "coreIdeaHinglish": "Random ke liye array chahiye (index se access). Delete ke liye swap trick — delete karne wale ko last se swap karo, phir last pop karo. Map me index update karo.",
    "approach": [
      "insert: if val in map: return False; map[val] = len(lst); lst.append(val)",
      "remove: idx = map[val]; swap lst[idx] with lst[-1]; map[lst[-1]] = idx; lst.pop(); del map[val]",
      "getRandom: random.choice(lst)"
    ],
    "time": "O(1) average all ops",
    "space": "O(n)",
    "pitfalls": [
      "In remove: update map for the SWAPPED element BEFORE deleting val from map (if val is last, both steps still work — it's a self-swap)",
      "Handle the case where val == last element: lst[idx] = last; map[last] = idx is a no-op but correct",
      "random.choice is O(1) only for arrays, not linked lists or sets"
    ],
    "code": "Map<Integer,Integer> valToIdx=new HashMap<>();\nList<Integer> list=new ArrayList<>();\nRandom rand=new Random();\n\nboolean insert(int val) {\n    if (valToIdx.containsKey(val)) return false;\n    valToIdx.put(val,list.size()); list.add(val); return true;\n}\nboolean remove(int val) {\n    if (!valToIdx.containsKey(val)) return false;\n    int idx=valToIdx.get(val), last=list.get(list.size()-1);\n    list.set(idx,last); valToIdx.put(last,idx);\n    list.remove(list.size()-1); valToIdx.remove(val); return true;\n}\nint getRandom() { return list.get(rand.nextInt(list.size())); }",
    "variants": [
      "Insert Delete GetRandom O(1) — Duplicates Allowed (LC 381)"
    ],
    "summary": "Design a set that supports insert, remove, and getRandom (uniform) all in O(1) average time."
  },
  {
    "id": 169,
    "name": "Majority Element",
    "difficulty": "Easy",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "element appearing more than n/2 times, guaranteed to exist",
      "O(1) space required"
    ],
    "coreIdea": "Boyer-Moore Voting. Maintain a candidate and count. When count hits 0, switch candidate. The majority element cancels all others and still has votes left at the end.",
    "coreIdeaHinglish": "Candidate aur count track karo. Count 0 hua? Candidate badlo. Akhir me jo bacha, wahi majority hai — kyunki woh baaki sab ko cancel karke bhi positive count me hai.",
    "approach": [
      "candidate = None, count = 0",
      "For each n: if count == 0: candidate = n",
      "count += 1 if n == candidate else -1",
      "Return candidate"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Only correct when majority element is GUARANTEED to exist (> n/2); add a verification pass if not guaranteed",
      "count can go negative temporarily — that's fine, it resets on next element",
      "Simpler approach (Counter.most_common) is O(n) time but O(n) space"
    ],
    "code": "int count=0, candidate=0;\nfor (int n : nums) {\n    if (count==0) candidate=n;\n    count+=(n==candidate) ? 1 : -1;\n}\nreturn candidate;",
    "variants": [
      "Majority Element II (LC 229) — Boyer-Moore with two candidates",
      "Check If a Number Is Majority Element (LC 1150)"
    ],
    "summary": "Find the element that appears more than ⌊n/2⌋ times in an array of size n."
  },
  {
    "id": 1,
    "name": "Two Sum",
    "difficulty": "Easy",
    "pattern": "Arrays & Hashing",
    "trigger": [
      "two numbers summing to target, return their indices",
      "unsorted array, exactly one solution"
    ],
    "coreIdea": "For each number, its complement is (target - num). Check if the complement is already in a seen map. If yes, return both indices. Otherwise store current number → index.",
    "coreIdeaHinglish": "Complement = target - current. Agar complement map me hai, dono indices return karo. Nahi hai? Current ko map me daalo aur aage badho.",
    "approach": [
      "seen = {}",
      "For i, n in enumerate(nums): complement = target - n",
      "If complement in seen: return [seen[complement], i]",
      "seen[n] = i"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Return INDICES, not the values themselves",
      "Can't use two pointers — array is unsorted; don't sort (indices change)",
      "One pass is sufficient — no need to pre-populate the map first"
    ],
    "code": "Map<Integer, Integer> map = new HashMap<>();\nfor (int i = 0; i < nums.length; i++) {\n    int comp = target - nums[i];\n    if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n    map.put(nums[i], i);\n}\nreturn new int[]{};",
    "variants": [
      "3Sum (LC 15)",
      "Two Sum II — Input Array Is Sorted (LC 167)"
    ],
    "summary": "Given an array of integers and a target, return the indices of the two numbers that add up to the target."
  }
]);
