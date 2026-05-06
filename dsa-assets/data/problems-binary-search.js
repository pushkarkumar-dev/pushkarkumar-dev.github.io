// Binary Search — 8 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 153,
    "name": "Find Minimum in Rotated Sorted Array",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "minimum element in a rotated sorted array",
      "no duplicates — use mid vs right comparison"
    ],
    "coreIdea": "Binary search by comparing mid to right. If nums[mid] > nums[right], minimum is in right half. Otherwise it's in left half (including mid).",
    "coreIdeaHinglish": "Mid ko right se compare karo. nums[mid] > nums[right]? Minimum right me hai. Warna left me hai (mid bhi include ho sakta hai).",
    "approach": [
      "left = 0, right = n-1",
      "While left < right: mid = (left+right)//2",
      "If nums[mid] > nums[right]: left = mid+1",
      "Else: right = mid"
    ],
    "time": "O(log n)",
    "space": "O(1)",
    "pitfalls": [
      "Compare mid with RIGHT (not left) — cleaner invariant for rotation",
      "right = mid (not mid-1) when nums[mid] <= nums[right] — mid could be the answer",
      "Loop ends when left == right — that's the minimum"
    ],
    "code": "int l = 0, r = nums.length - 1;\nwhile (l < r) {\n    int m = l + (r - l) / 2;\n    if (nums[m] > nums[r]) l = m + 1; else r = m;\n}\nreturn nums[l];",
    "variants": [
      "Search in Rotated Sorted Array (LC 33)",
      "Find Minimum in Rotated Sorted Array II (LC 154) — with duplicates"
    ],
    "summary": "Find the minimum element in a sorted array that has been rotated at an unknown pivot."
  },
  {
    "id": 33,
    "name": "Search in Rotated Sorted Array",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "search target in rotated sorted array",
      "determine which half is sorted, then narrow search"
    ],
    "coreIdea": "One of the two halves is always sorted. Check which half is sorted, then decide if target falls in it. Narrow accordingly.",
    "coreIdeaHinglish": "Do halves me se ek hamesha sorted hogi. Dekho kaunsi sorted hai, phir check karo target us half me hai ya nahi. Accordingly search narrow karo.",
    "approach": [
      "While left <= right: mid = (l+r)//2; if found: return mid",
      "If left half sorted (nums[l] <= nums[mid]): if l <= target < mid: r=mid-1 else: l=mid+1",
      "Else right half sorted: if mid < target <= r: l=mid+1 else: r=mid-1"
    ],
    "time": "O(log n)",
    "space": "O(1)",
    "pitfalls": [
      "Check nums[left] <= nums[mid] (not < ) to identify sorted left half — equal handles edge case",
      "Boundary conditions for target range: target in [nums[l], nums[mid]) for left-sorted half",
      "Doesn't work with duplicates (see LC 81)"
    ],
    "code": "int l = 0, r = nums.length - 1;\nwhile (l <= r) {\n    int m = l + (r - l) / 2;\n    if (nums[m] == target) return m;\n    if (nums[l] <= nums[m]) {\n        if (nums[l] <= target && target < nums[m]) r = m - 1; else l = m + 1;\n    } else {\n        if (nums[m] < target && target <= nums[r]) l = m + 1; else r = m - 1;\n    }\n}\nreturn -1;",
    "variants": [
      "Find Minimum in Rotated Sorted Array (LC 153)",
      "Search in Rotated Sorted Array II (LC 81) — with duplicates"
    ],
    "animation": "binarySearch",
    "summary": "Search for a target in a sorted array rotated at an unknown pivot; return its index or -1."
  },
  {
    "id": 875,
    "name": "Koko Eating Bananas",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "minimum rate/capacity satisfying a constraint within h hours",
      "binary search on the answer space"
    ],
    "coreIdea": "Binary search on the eating speed (1 to max(piles)). For each candidate speed, check if Koko can finish within h hours. Minimize the valid speed.",
    "coreIdeaHinglish": "Speed pe binary search karo (1 se max pile tak). Har candidate speed ke liye check karo ki h hours me khatam hoga ya nahi. Valid speed me minimum dhundo.",
    "approach": [
      "left = 1, right = max(piles)",
      "While left < right: mid = (l+r)//2",
      "hours = sum(ceil(p/mid) for p in piles)",
      "If hours <= h: right = mid else: left = mid+1"
    ],
    "time": "O(n log m) where m = max(piles)",
    "space": "O(1)",
    "pitfalls": [
      "Use ceil(p/mid) = (p + mid - 1) // mid (avoid floating point)",
      "right = mid (not mid-1) on success — mid itself could be the answer",
      "Search space is [1, max(piles)], not [0, sum(piles)]"
    ],
    "code": "int l = 1, r = Arrays.stream(piles).max().getAsInt();\nwhile (l < r) {\n    int m = l + (r - l) / 2;\n    long hours = 0;\n    for (int p : piles) hours += (p + m - 1) / m;\n    if (hours <= h) r = m; else l = m + 1;\n}\nreturn l;",
    "variants": [
      "Capacity to Ship Packages (LC 1011)",
      "Minimum Number of Days to Make m Bouquets (LC 1482)"
    ],
    "summary": "Find the minimum eating speed (bananas/hour) for Koko to finish all piles within h hours."
  },
  {
    "id": 74,
    "name": "Search a 2D Matrix",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "search in matrix where rows are sorted and first element of each row > last of previous",
      "treat 2D matrix as a flat sorted array"
    ],
    "coreIdea": "The matrix is a flat sorted array. Map index i → (i//cols, i%cols). Binary search on [0, rows*cols - 1].",
    "coreIdeaHinglish": "Matrix ko flat sorted array maan lo. Index i = row * cols + col. Ulta bhi karo: row = i//cols, col = i%cols. Phir normal binary search.",
    "approach": [
      "left = 0, right = rows*cols - 1",
      "mid = (l+r)//2; val = matrix[mid//cols][mid%cols]",
      "If val == target: return True; elif < target: left=mid+1; else: right=mid-1"
    ],
    "time": "O(log(m·n))",
    "space": "O(1)",
    "pitfalls": [
      "Index mapping: row = mid // cols, col = mid % cols",
      "Prerequisite: first element of each row > last element of previous row (strictly increasing globally)",
      "Different from LC 240 (Search a 2D Matrix II) where only rows and columns are sorted"
    ],
    "code": "int l = 0, r = matrix.length * matrix[0].length - 1;\nwhile (l <= r) {\n    int m = l + (r - l) / 2, cols = matrix[0].length;\n    int val = matrix[m / cols][m % cols];\n    if (val == target) return true;\n    if (val < target) l = m + 1; else r = m - 1;\n}\nreturn false;",
    "variants": [
      "Search a 2D Matrix II (LC 240) — rows and cols sorted separately"
    ],
    "summary": "Determine if a target value exists in an m×n matrix where each row and column is sorted."
  },
  {
    "id": 981,
    "name": "Time Based Key-Value Store",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "key-value store with timestamps — get latest value at or before a given time",
      "binary search on sorted timestamp list"
    ],
    "coreIdea": "Store values as list of (timestamp, value) per key. On get, binary search for the largest timestamp ≤ given time. Return its value (or '' if none).",
    "coreIdeaHinglish": "Har key ke liye (timestamp, value) list rakho. get pe binary search karo — uss time se chhota ya barabar sabse bada timestamp dhundo. Wahi return karo.",
    "approach": [
      "store = defaultdict(list)",
      "set: store[key].append((timestamp, value))",
      "get: binary search store[key] for largest ts <= timestamp; bisect_right(ts_list, timestamp) - 1"
    ],
    "time": "O(log n) get, O(1) set",
    "space": "O(n)",
    "pitfalls": [
      "Timestamps for a key are already in ascending order (per problem guarantee) — no explicit sorting needed",
      "bisect_right on timestamps list, then check index-1 exists",
      "Return '' if index-1 < 0 (no valid timestamp)"
    ],
    "code": "Map<String, TreeMap<Integer, String>> map = new HashMap<>();\nvoid set(String key, String value, int timestamp) {\n    map.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);\n}\nString get(String key, int timestamp) {\n    if (!map.containsKey(key)) return \"\";\n    var entry = map.get(key).floorEntry(timestamp);\n    return entry == null ? \"\" : entry.getValue();\n}",
    "variants": [
      "Design an Ordered Stream (LC 1656)"
    ],
    "summary": "Design a key-value store supporting set(key, value, timestamp) and get(key, timestamp) queries."
  },
  {
    "id": 162,
    "name": "Find Peak Element",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "find any peak element (greater than neighbors) in O(log n)",
      "nums[-1] = nums[n] = -inf guarantees a peak exists"
    ],
    "coreIdea": "Binary search: if nums[mid] < nums[mid+1], peak is to the right (ascending slope). Otherwise peak is at mid or to the left. Converge to any peak.",
    "coreIdeaHinglish": "Mid ke right neighbor se compare karo. nums[mid] < nums[mid+1]? Peak right me hai (slope upar ja rahi hai). Warna peak mid me ya left me hai.",
    "approach": [
      "left = 0, right = n-1",
      "While left < right: mid = (l+r)//2",
      "If nums[mid] < nums[mid+1]: left = mid+1",
      "Else: right = mid"
    ],
    "time": "O(log n)",
    "space": "O(1)",
    "pitfalls": [
      "Any peak is valid — not necessarily the global maximum",
      "right = mid (not mid-1) when nums[mid] >= nums[mid+1] — mid could be the peak",
      "Boundary nums[-1] and nums[n] are treated as -inf by the problem — no bounds check needed"
    ],
    "code": "int l=0, r=nums.length-1;\nwhile (l<r) {\n    int m=l+(r-l)/2;\n    if (nums[m]>nums[m+1]) r=m; else l=m+1;\n}\nreturn l;",
    "variants": [
      "Find Peak in Mountain Array (LC 852)",
      "Peak Index in a Mountain Array (LC 852)"
    ],
    "summary": "Find any peak element — one strictly greater than its neighbors — in O(log n)."
  },
  {
    "id": 540,
    "name": "Single Element in a Sorted Array",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "find the element that appears only once in a sorted array of pairs",
      "O(log n) — binary search on even indices"
    ],
    "coreIdea": "Before the single element, pairs occupy (even, odd) index positions. After it, pairs shift to (odd, even). Binary search on even indices: if nums[mid] == nums[mid+1], single is to the right; otherwise to the left.",
    "coreIdeaHinglish": "Single element se pehle pairs (even, odd) me hain. Baad me shift ho jaate hain. Mid ko mid+1 se compare karo — same hai? Single right me hai. Alag hai? Single mid ya left me hai.",
    "approach": [
      "left = 0, right = n-1 (keep both even by moving to even indices)",
      "mid = (l+r)//2; if mid is odd: mid--",
      "If nums[mid] == nums[mid+1]: left = mid+2 else: right = mid"
    ],
    "time": "O(log n)",
    "space": "O(1)",
    "pitfalls": [
      "Force mid to even index (mid -= 1 if mid%2 == 1) to maintain the invariant",
      "right = mid (not mid-1) when nums[mid] != nums[mid+1] — mid could be the answer",
      "Loop ends at left == right — that's the single element"
    ],
    "code": "int l = 0, r = nums.length - 1;\nwhile (l < r) {\n    int m = l + (r - l) / 2;\n    if (m % 2 == 1) m--;\n    if (nums[m] == nums[m+1]) l = m + 2; else r = m;\n}\nreturn nums[l];",
    "variants": [
      "Single Number (LC 136) — XOR approach O(n)",
      "Single Number II (LC 137)"
    ],
    "summary": "Find the single element in a sorted array where every other element appears exactly twice."
  },
  {
    "id": 1011,
    "name": "Capacity to Ship Packages Within D Days",
    "difficulty": "Medium",
    "pattern": "Binary Search",
    "trigger": [
      "minimum capacity to complete task within d days",
      "binary search on answer space (capacity)"
    ],
    "coreIdea": "Binary search on capacity [max(weights), sum(weights)]. For each candidate capacity, simulate shipping greedily — check if all packages fit within D days.",
    "coreIdeaHinglish": "Capacity pe binary search karo. Har candidate capacity ke liye simulate karo — greedy ship karo aur dekho D days me khatam hoga ya nahi. Valid capacity me minimum dhundo.",
    "approach": [
      "left = max(weights), right = sum(weights)",
      "While left < right: mid = (l+r)//2",
      "Simulate: days needed with capacity mid",
      "If days <= D: right = mid else: left = mid+1"
    ],
    "time": "O(n log S) where S = sum(weights)",
    "space": "O(1)",
    "pitfalls": [
      "left starts at max(weights) — ship must carry each package individually at minimum",
      "Simulation: new day when adding next weight would exceed capacity",
      "right = mid on success (mid itself could be the minimum valid capacity)"
    ],
    "code": "int l=Arrays.stream(weights).max().getAsInt(), r=Arrays.stream(weights).sum();\nwhile (l<r) {\n    int m=l+(r-l)/2, days=1, cap=0;\n    for (int w:weights) { if (cap+w>m){days++;cap=0;} cap+=w; }\n    if (days<=D) r=m; else l=m+1;\n}\nreturn l;",
    "variants": [
      "Koko Eating Bananas (LC 875)",
      "Split Array Largest Sum (LC 410)"
    ],
    "summary": "Find the minimum ship weight capacity to ship all packages in order within d days."
  }
]);
