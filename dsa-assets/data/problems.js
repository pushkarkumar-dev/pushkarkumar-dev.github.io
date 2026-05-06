window.PROBLEMS = [
  {
    id: 3,
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    pattern: "Sliding Window",
    trigger: [
      "longest/shortest substring with constraint",
      "constraint checkable as window grows/shrinks"
    ],
    coreIdea: "Expand right pointer; on duplicate, jump left past the previous occurrence. Track max length.",
    coreIdeaHinglish: "Window ko right se expand karte jao. Duplicate mile? Left ko us duplicate ke pichle index ke +1 pe jump karwao. Max length yaad rakho.",
    approach: [
      "Map: char → last index seen",
      "Move right; if seen[c] exists AND seen[c] >= left: left = seen[c] + 1",
      "Update seen[c] = right",
      "ans = max(ans, right - left + 1)"
    ],
    time: "O(n)",
    space: "O(min(n, charset))",
    pitfalls: [
      "Forgetting 'seen[c] >= left' — shrinks window when duplicate is OUTSIDE current window",
      "Off-by-one: length is right - left + 1, not right - left",
      "Setting left = seen[c] instead of seen[c] + 1"
    ],
    code: `left = ans = 0
seen = {}
for right, c in enumerate(s):
    if c in seen and seen[c] >= left:
        left = seen[c] + 1
    seen[c] = right
    ans = max(ans, right - left + 1)
return ans`,
    variants: [
      "Longest Substring with At Most K Distinct (LC 340)",
      "Minimum Window Substring (LC 76)"
    ],
    animation: "slidingWindow"
  },
  {
    id: 424,
    name: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    pattern: "Sliding Window",
    trigger: [
      "replace at most k characters to make substring all same",
      "longest substring where one char can dominate with k replacements"
    ],
    coreIdea: "Track the most frequent char count in the window. If (window_size - maxFreq) > k, slide left. The window never shrinks below its historical maximum.",
    coreIdeaHinglish: "Window me jo char sabse zyada baar aata hai, uski count track karo. Baaki sab replace karne padte hain — agar woh k se zyada hai, left badao. Window ka size kabhi pichle max se chhota nahi hota.",
    approach: [
      "count[26] freq array, maxFreq = 0, left = 0",
      "Add s[right]: count[s[right]]++, update maxFreq",
      "If (right - left + 1) - maxFreq > k: count[s[left]]--, left++",
      "ans = max(ans, right - left + 1)"
    ],
    time: "O(n)",
    space: "O(1) — fixed 26-char array",
    pitfalls: [
      "maxFreq never decreases — intentional; we only care about equal-or-larger windows",
      "Don't recompute maxFreq after shrinking — skip it, the window size won't grow unless a new max is found",
      "Characters are uppercase only — use ord(c) - ord('A') for index"
    ],
    code: `count = [0] * 26
left = maxFreq = ans = 0
for right, c in enumerate(s):
    count[ord(c) - ord('A')] += 1
    maxFreq = max(maxFreq, count[ord(c) - ord('A')])
    if (right - left + 1) - maxFreq > k:
        count[ord(s[left]) - ord('A')] -= 1
        left += 1
    ans = max(ans, right - left + 1)
return ans`,
    variants: [
      "Max Consecutive Ones III (LC 1004)",
      "Maximize the Confusion of an Exam (LC 2024)"
    ]
  },
  {
    id: 567,
    name: "Permutation in String",
    difficulty: "Medium",
    pattern: "Sliding Window",
    trigger: [
      "does any permutation of s1 appear as substring in s2?",
      "fixed-size window — size locked to len(s1)"
    ],
    coreIdea: "Fixed window of size len(s1) slides over s2. Match frequency maps — equal maps mean a permutation exists at that position.",
    coreIdeaHinglish: "Window ka size fix hai — len(s1). Ek char right se add, ek left se nikalo. Frequency map match hua? Permutation mil gayi.",
    approach: [
      "need = Counter(s1), window = Counter(s2[:len(s1)])",
      "If need == window: return True",
      "For i in range(len(s1), len(s2)): add s2[i], remove s2[i - len(s1)]",
      "If need == window: return True after each slide"
    ],
    time: "O(n)",
    space: "O(1) — 26 distinct chars max",
    pitfalls: [
      "Window size is FIXED at len(s1) — never let it grow or shrink",
      "Initialize window with first len(s1) chars BEFORE the loop, not inside it",
      "Delete keys with zero count from window (or use defaultdict) so equality check works correctly"
    ],
    code: `from collections import Counter
need = Counter(s1)
window = Counter(s2[:len(s1)])
if need == window: return True
for i in range(len(s1), len(s2)):
    window[s2[i]] += 1
    old = s2[i - len(s1)]
    window[old] -= 1
    if window[old] == 0:
        del window[old]
    if need == window:
        return True
return False`,
    variants: [
      "Find All Anagrams in a String (LC 438)",
      "Minimum Window Substring (LC 76)"
    ]
  },
  {
    id: 438,
    name: "Find All Anagrams in a String",
    difficulty: "Medium",
    pattern: "Sliding Window",
    trigger: [
      "find all starting indices where anagram of p exists in s",
      "fixed-size window — same length as the pattern"
    ],
    coreIdea: "Identical to LC 567 — fixed window of len(p). Collect every start index where window freq matches p's freq instead of returning on first match.",
    coreIdeaHinglish: "LC 567 ka hi chhota bhai. Fark sirf itna hai ki pehli match pe return nahi karna — saari positions collect karo list me.",
    approach: [
      "need = Counter(p), window = Counter(s[:len(p)]), res = []",
      "Check index 0 before the loop",
      "Slide: window[s[i]] += 1; remove s[i - len(p)]; delete zero-count keys",
      "If need == window: res.append(i - len(p) + 1)"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "First window (index 0) must be checked before the loop starts, not inside it",
      "Start index of match is i - len(p) + 1, not i",
      "Same counter-deletion gotcha as LC 567 — always del key when count hits 0"
    ],
    code: `from collections import Counter
need = Counter(p)
window = Counter(s[:len(p)])
res = []
if need == window: res.append(0)
for i in range(len(p), len(s)):
    window[s[i]] += 1
    old = s[i - len(p)]
    window[old] -= 1
    if window[old] == 0:
        del window[old]
    if need == window:
        res.append(i - len(p) + 1)
return res`,
    variants: [
      "Permutation in String (LC 567)",
      "Minimum Window Substring (LC 76)"
    ]
  },
  {
    id: 209,
    name: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    pattern: "Sliding Window",
    trigger: [
      "minimum length subarray with sum >= target",
      "all positive integers — shrinking always reduces sum"
    ],
    coreIdea: "Expand right until sum >= target, then shrink from left to find the smallest valid window. Positive integers guarantee shrinking always reduces the sum.",
    coreIdeaHinglish: "Right se sum badhao jab tak target reach na ho. Pahuncha? Left se shrink karte jao — jab tak sum valid rahe, minimum length note karo.",
    approach: [
      "left = curr = 0, ans = inf",
      "For each right: curr += nums[right]",
      "While curr >= target: ans = min(ans, right - left + 1); curr -= nums[left]; left++",
      "Return ans if ans != inf else 0"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Only works for positive numbers — negatives break the shrink assumption (sum can increase when shrinking)",
      "Use while NOT if to shrink: must keep shrinking as long as condition still holds",
      "Return 0 if ans is still inf — means no valid subarray exists"
    ],
    code: `left = curr = 0
ans = float('inf')
for right, v in enumerate(nums):
    curr += v
    while curr >= target:
        ans = min(ans, right - left + 1)
        curr -= nums[left]
        left += 1
return ans if ans != float('inf') else 0`,
    variants: [
      "Shortest Subarray with Sum at Least K (LC 862) — negatives → monotonic deque",
      "Maximum Size Subarray Sum Equals K (LC 325)"
    ]
  },

  // ── Sliding Window (remaining) ───────────────────────────────

  {
    id: 1004,
    name: "Max Consecutive Ones III",
    difficulty: "Medium",
    pattern: "Sliding Window",
    trigger: [
      "max consecutive 1s with at most k zero flips",
      "longest window containing at most k zeros"
    ],
    coreIdea: "Expand right freely; track zero count. When zeros > k, shrink from left, decrementing zero count if the dropped element was 0. Simpler cousin of LC 424.",
    coreIdeaHinglish: "Window me zyada se zyada k zeros allow hain. Zeros zyada ho gaye? Left badao aur zero count ghata lo agar woh element 0 tha. Bas.",
    approach: [
      "left = zeros = ans = 0",
      "For each right: if nums[right] == 0: zeros++",
      "While zeros > k: if nums[left] == 0: zeros--; left++",
      "ans = max(ans, right - left + 1)"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Use while not if to shrink — multiple zeros may need to exit before window is valid again",
      "Binary array only — generalizes to 'at most k of some element' for other problems",
      "Answer is window size (right - left + 1), not the count of zeros or ones"
    ],
    code: `left = zeros = ans = 0
for right, v in enumerate(nums):
    if v == 0: zeros += 1
    while zeros > k:
        if nums[left] == 0: zeros -= 1
        left += 1
    ans = max(ans, right - left + 1)
return ans`,
    variants: [
      "Longest Repeating Character Replacement (LC 424)",
      "Maximize the Confusion of an Exam (LC 2024)"
    ]
  },

  {
    id: 76,
    name: "Minimum Window Substring",
    difficulty: "Hard",
    pattern: "Sliding Window",
    trigger: [
      "minimum window in s containing all chars of t",
      "shrink from left only when window is fully valid"
    ],
    coreIdea: "Expand right until all t chars are covered (tracked by a `formed` counter). Then shrink left greedily to minimize. Record the smallest valid window.",
    coreIdeaHinglish: "Pehle window ko bada karo jab tak t ke sab chars cover na ho. Phir left se shrink karo aur minimum note karo. `formed` counter batata hai ki window valid hai ya nahi.",
    approach: [
      "need = Counter(t), have = {}, formed = 0, required = len(need)",
      "Expand right: have[c]++; if have[c] == need[c]: formed++",
      "While formed == required: update ans; shrink left: if have[s[left]] drops below need: formed--; left++"
    ],
    time: "O(|s| + |t|)",
    space: "O(|s| + |t|)",
    pitfalls: [
      "`formed` only increments when have[c] reaches EXACTLY need[c] — not for every char added",
      "Decrement have[s[left]] BEFORE moving left past it (order matters for formed check)",
      "Return '' if no valid window found — don't forget this edge case"
    ],
    code: `from collections import Counter
need = Counter(t)
have, formed = {}, 0
required = len(need)
left = ans_len = 0
res = ""
for right, c in enumerate(s):
    have[c] = have.get(c, 0) + 1
    if have[c] == need.get(c, 0): formed += 1
    while formed == required:
        if not res or right - left + 1 < ans_len:
            res = s[left:right + 1]
            ans_len = right - left + 1
        lc = s[left]
        have[lc] -= 1
        if have[lc] < need.get(lc, 0): formed -= 1
        left += 1
return res`,
    variants: [
      "Permutation in String (LC 567)",
      "Smallest Range Covering Elements from K Lists (LC 632)"
    ]
  },

  // ── Arrays & Hashing ────────────────────────────────────────

  {
    id: 49,
    name: "Group Anagrams",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "group strings that are anagrams of each other",
      "canonical key for any permutation of the same chars"
    ],
    coreIdea: "Sorted form of a word is its canonical anagram key. Map sorted_word → [words]; all anagrams share the same key.",
    coreIdeaHinglish: "Har word ko sort karo — anagram hone par sorted form same hogi. Yeh sorted form key hai, values list me daalo. Bas ek pass.",
    approach: [
      "d = defaultdict(list)",
      "For each word: key = ''.join(sorted(word))",
      "d[key].append(word)",
      "Return list(d.values())"
    ],
    time: "O(n·k·log k)",
    space: "O(n·k)",
    pitfalls: [
      "sorted() returns a list — must join to string (or use tuple) before using as dict key",
      "Alternative O(n·k) key: tuple of 26 char counts (avoids sort cost for large alphabets)",
      "Don't flatten the output — return the grouped lists as-is"
    ],
    code: `from collections import defaultdict
d = defaultdict(list)
for word in strs:
    key = ''.join(sorted(word))
    d[key].append(word)
return list(d.values())`,
    variants: [
      "Valid Anagram (LC 242)",
      "Find All Anagrams in a String (LC 438)"
    ]
  },

  {
    id: 347,
    name: "Top K Frequent Elements",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "top k most frequent elements, better than O(n log n) sort",
      "frequency → index mapping"
    ],
    coreIdea: "Bucket sort by frequency. buckets[freq] holds all numbers with that frequency. Collect from highest bucket down until k elements gathered. O(n) — beats heap.",
    coreIdeaHinglish: "Bucket index = frequency. Sabse zyada frequent ke bucket se collect karo jab tak k elements na mile. Sort se fast, heap se simple.",
    approach: [
      "count = Counter(nums)",
      "buckets = [[] for _ in range(len(nums) + 1)]",
      "For each num, freq: buckets[freq].append(num)",
      "Collect from buckets[n] down to buckets[1] until k elements"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Heap (nlargest) is O(n log k) — valid but not optimal; bucket sort is O(n)",
      "Bucket index goes up to len(nums) — allocate len+1 buckets",
      "A bucket can hold multiple numbers — flatten while collecting"
    ],
    code: `from collections import Counter
count = Counter(nums)
buckets = [[] for _ in range(len(nums) + 1)]
for num, freq in count.items():
    buckets[freq].append(num)
res = []
for i in range(len(buckets) - 1, 0, -1):
    for num in buckets[i]:
        res.append(num)
        if len(res) == k: return res`,
    variants: [
      "Top K Frequent Words (LC 692)",
      "Sort Characters By Frequency (LC 451)"
    ]
  },

  {
    id: 238,
    name: "Product of Array Except Self",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "product of all elements except self, no division allowed",
      "O(n) time, O(1) extra space"
    ],
    coreIdea: "Two passes. Left pass fills ans[i] with product of everything to the left. Right pass multiplies in the suffix product from the right. No division needed.",
    coreIdeaHinglish: "Pehle left se prefix product bharo, phir right se suffix product multiply karo. Division use mat karo — do passes, ek array.",
    approach: [
      "ans = [1]*n; prefix = 1",
      "Left pass (i=0 to n-1): ans[i] = prefix; prefix *= nums[i]",
      "Right pass (i=n-1 to 0): suffix=1; ans[i] *= suffix; suffix *= nums[i]"
    ],
    time: "O(n)",
    space: "O(1) extra (output array excluded)",
    pitfalls: [
      "prefix starts at 1 (neutral element for multiply), not nums[0]",
      "Right pass: multiply THEN update suffix (order matters to exclude nums[i])",
      "Output array itself doesn't count toward space complexity per the problem"
    ],
    code: `n = len(nums)
ans = [1] * n
prefix = 1
for i in range(n):
    ans[i] = prefix
    prefix *= nums[i]
suffix = 1
for i in range(n - 1, -1, -1):
    ans[i] *= suffix
    suffix *= nums[i]
return ans`,
    variants: [
      "Find Pivot Index (LC 724)",
      "Trapping Rain Water (LC 42)"
    ]
  },

  {
    id: 271,
    name: "Encode and Decode Strings",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "serialize a list of strings over a channel with no forbidden chars",
      "length-prefix encoding to handle arbitrary characters"
    ],
    coreIdea: "Encode each string as `len#content`. Decoder reads digits until '#', then slices exactly that many characters. Works even when strings contain '#' or other special chars.",
    coreIdeaHinglish: "Har string ke aage uski length aur '#' daal do. Decode karte waqt digits padho jab tak '#' na mile, phir exactly utne chars lo — '#' string ke andar ho, tab bhi safe.",
    approach: [
      "Encode: for s in strs: output += f'{len(s)}#{s}'",
      "Decode: while i < len(s): j = s.index('#', i); n = int(s[i:j]); word = s[j+1:j+1+n]; i = j+1+n"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Single delimiter like '|' fails if strings contain '|' — length prefix is the safe solution",
      "s.index('#', i) searches from i onward — avoids matching '#' inside a previous string",
      "Decode: i advances by j+1+n, not by n alone"
    ],
    code: `def encode(strs):
    return ''.join(f"{len(s)}#{s}" for s in strs)

def decode(s):
    res, i = [], 0
    while i < len(s):
        j = s.index('#', i)
        n = int(s[i:j])
        i = j + 1
        res.append(s[i:i + n])
        i += n
    return res`,
    variants: [
      "Serialize and Deserialize Binary Tree (LC 297)"
    ]
  },

  {
    id: 128,
    name: "Longest Consecutive Sequence",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "longest streak of consecutive integers",
      "O(n) required — can't sort"
    ],
    coreIdea: "Put all numbers in a set. For each number that is a sequence START (n-1 not in set), count the streak. Each number is visited at most twice total → O(n).",
    coreIdeaHinglish: "Set me sab daal do. Sirf un numbers se streak shuru karo jinka (n-1) set me nahi hai — yeh sequence ka start hai. Streak count karo, max track karo.",
    approach: [
      "num_set = set(nums)",
      "For n in num_set: if n-1 not in num_set (sequence start):",
      "Count streak: length = 0; while n+length in num_set: length++",
      "ans = max(ans, length)"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Must iterate over the SET (not nums) to avoid TLE from duplicate elements triggering multiple streak-counts",
      "Only start counting when n-1 is NOT in set — else you'd count from the middle of a streak",
      "Streak check uses the set, not index arithmetic — gaps between values don't matter"
    ],
    code: `num_set = set(nums)
ans = 0
for n in num_set:
    if n - 1 not in num_set:
        length = 0
        while n + length in num_set:
            length += 1
        ans = max(ans, length)
return ans`,
    variants: [
      "Longest Arithmetic Subsequence (LC 1027)",
      "Binary Tree Longest Consecutive Sequence (LC 298)"
    ]
  },

  {
    id: 36,
    name: "Valid Sudoku",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "validate 9×9 board without solving it",
      "check rows, cols, and 3×3 sub-boxes for duplicates"
    ],
    coreIdea: "One pass over the 81 cells. For each filled cell, check three sets: its row, its column, and its 3×3 box (indexed by (r//3)*3 + c//3). Reject on first duplicate.",
    coreIdeaHinglish: "Ek pass me sab check karo — row, col, aur box (index = (r//3)*3 + c//3). Set me pehle se hai? Invalid. Nahi hai? Teeno sets me add karo.",
    approach: [
      "rows[9], cols[9], boxes[9] — each a set",
      "For (r, c) where board[r][c] != '.': box = (r//3)*3 + c//3",
      "If digit in rows[r] or cols[c] or boxes[box]: return False",
      "Add digit to all three sets; return True"
    ],
    time: "O(1) — always 81 cells",
    space: "O(1) — bounded by 9×9",
    pitfalls: [
      "Box index formula: (r//3)*3 + c//3 — not r*3+c (that gives wrong box)",
      "Board stores strings ('1'-'9'), not ints — compare as strings",
      "Skip '.' cells before any set check"
    ],
    code: `from collections import defaultdict
rows  = defaultdict(set)
cols  = defaultdict(set)
boxes = defaultdict(set)
for r in range(9):
    for c in range(9):
        v = board[r][c]
        if v == '.': continue
        box = (r // 3) * 3 + c // 3
        if v in rows[r] or v in cols[c] or v in boxes[box]:
            return False
        rows[r].add(v); cols[c].add(v); boxes[box].add(v)
return True`,
    variants: [
      "Sudoku Solver (LC 37)"
    ]
  },

  {
    id: 560,
    name: "Subarray Sum Equals K",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "count subarrays with sum exactly k",
      "prefix sum + complement lookup (works with negatives)"
    ],
    coreIdea: "prefix[i] - prefix[j] == k ↔ prefix[j] == prefix[i] - k. Maintain a running prefix sum and a count map of all prefix sums seen so far.",
    coreIdeaHinglish: "Prefix sum track karo. Har jagah check karo ki (curr - k) pehle dikh chuka hai — agar haan, to woh ek valid subarray hai. HashMap me counts rakho.",
    approach: [
      "prefix_count = {0: 1}, curr = 0, ans = 0",
      "For each n: curr += n",
      "ans += prefix_count.get(curr - k, 0)",
      "prefix_count[curr] += 1"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Initialize {0: 1} — handles subarrays starting at index 0 (sum == k from the beginning)",
      "Works with negatives (unlike sliding window which requires positive nums)",
      "Counts subarrays, not indices — don't try to reconstruct the subarray from this"
    ],
    code: `from collections import defaultdict
prefix_count = defaultdict(int)
prefix_count[0] = 1
curr = ans = 0
for n in nums:
    curr += n
    ans += prefix_count[curr - k]
    prefix_count[curr] += 1
return ans`,
    variants: [
      "Continuous Subarray Sum (LC 523)",
      "Subarray Sums Divisible by K (LC 974)"
    ]
  },

  {
    id: 380,
    name: "Insert Delete GetRandom O(1)",
    difficulty: "Medium",
    pattern: "Arrays & Hashing",
    trigger: [
      "O(1) insert, O(1) delete, AND O(1) getRandom on a set",
      "need index-based random access with fast deletion"
    ],
    coreIdea: "ArrayList + HashMap (val → index). Deletion uses swap-with-last: move the last element into the deleted slot, update its map entry, pop the last. No gaps in the array.",
    coreIdeaHinglish: "Random ke liye array chahiye (index se access). Delete ke liye swap trick — delete karne wale ko last se swap karo, phir last pop karo. Map me index update karo.",
    approach: [
      "insert: if val in map: return False; map[val] = len(lst); lst.append(val)",
      "remove: idx = map[val]; swap lst[idx] with lst[-1]; map[lst[-1]] = idx; lst.pop(); del map[val]",
      "getRandom: random.choice(lst)"
    ],
    time: "O(1) average all ops",
    space: "O(n)",
    pitfalls: [
      "In remove: update map for the SWAPPED element BEFORE deleting val from map (if val is last, both steps still work — it's a self-swap)",
      "Handle the case where val == last element: lst[idx] = last; map[last] = idx is a no-op but correct",
      "random.choice is O(1) only for arrays, not linked lists or sets"
    ],
    code: `import random
class RandomizedSet:
    def __init__(self):
        self.lst, self.map = [], {}
    def insert(self, val):
        if val in self.map: return False
        self.map[val] = len(self.lst)
        self.lst.append(val)
        return True
    def remove(self, val):
        if val not in self.map: return False
        idx, last = self.map[val], self.lst[-1]
        self.lst[idx] = last
        self.map[last] = idx
        self.lst.pop()
        del self.map[val]
        return True
    def getRandom(self):
        return random.choice(self.lst)`,
    variants: [
      "Insert Delete GetRandom O(1) — Duplicates Allowed (LC 381)"
    ]
  },

  {
    id: 169,
    name: "Majority Element",
    difficulty: "Easy",
    pattern: "Arrays & Hashing",
    trigger: [
      "element appearing more than n/2 times, guaranteed to exist",
      "O(1) space required"
    ],
    coreIdea: "Boyer-Moore Voting. Maintain a candidate and count. When count hits 0, switch candidate. The majority element cancels all others and still has votes left at the end.",
    coreIdeaHinglish: "Candidate aur count track karo. Count 0 hua? Candidate badlo. Akhir me jo bacha, wahi majority hai — kyunki woh baaki sab ko cancel karke bhi positive count me hai.",
    approach: [
      "candidate = None, count = 0",
      "For each n: if count == 0: candidate = n",
      "count += 1 if n == candidate else -1",
      "Return candidate"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Only correct when majority element is GUARANTEED to exist (> n/2); add a verification pass if not guaranteed",
      "count can go negative temporarily — that's fine, it resets on next element",
      "Simpler approach (Counter.most_common) is O(n) time but O(n) space"
    ],
    code: `candidate = count = 0
for n in nums:
    if count == 0:
        candidate = n
    count += 1 if n == candidate else -1
return candidate`,
    variants: [
      "Majority Element II (LC 229) — Boyer-Moore with two candidates",
      "Check If a Number Is Majority Element (LC 1150)"
    ]
  },

  {
    id: 1,
    name: "Two Sum",
    difficulty: "Easy",
    pattern: "Arrays & Hashing",
    trigger: [
      "two numbers summing to target, return their indices",
      "unsorted array, exactly one solution"
    ],
    coreIdea: "For each number, its complement is (target - num). Check if the complement is already in a seen map. If yes, return both indices. Otherwise store current number → index.",
    coreIdeaHinglish: "Complement = target - current. Agar complement map me hai, dono indices return karo. Nahi hai? Current ko map me daalo aur aage badho.",
    approach: [
      "seen = {}",
      "For i, n in enumerate(nums): complement = target - n",
      "If complement in seen: return [seen[complement], i]",
      "seen[n] = i"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Return INDICES, not the values themselves",
      "Can't use two pointers — array is unsorted; don't sort (indices change)",
      "One pass is sufficient — no need to pre-populate the map first"
    ],
    code: `seen = {}
for i, n in enumerate(nums):
    complement = target - n
    if complement in seen:
        return [seen[complement], i]
    seen[n] = i`,
    variants: [
      "3Sum (LC 15)",
      "Two Sum II — Input Array Is Sorted (LC 167)"
    ]
  },

  // ── Two Pointers ────────────────────────────────────────────

  {
    id: 15,
    name: "3Sum",
    difficulty: "Medium",
    pattern: "Two Pointers",
    trigger: [
      "all unique triplets summing to zero",
      "fix one element + two-pointer on the rest"
    ],
    coreIdea: "Sort, then fix nums[i] with an outer loop and two-pointer the remaining window. Skip duplicates at all three levels to avoid repeated triplets.",
    coreIdeaHinglish: "Sort karo. Ek element fix karo outer loop se. Baaki do ke liye two pointers. Duplicates teeno jagah skip karo — i pe, left pe, aur right pe.",
    approach: [
      "Sort nums",
      "For i: if nums[i] > 0: break; if duplicate: skip",
      "left = i+1, right = n-1; two-pointer searching for -nums[i]",
      "On match: skip equal neighbors before moving both pointers"
    ],
    time: "O(n²)",
    space: "O(1) extra",
    pitfalls: [
      "Skip duplicates for i (if i>0 and nums[i]==nums[i-1]: continue)",
      "After a match, skip duplicates for BOTH left and right before advancing them",
      "nums[i] > 0 → break early (sorted, remaining elements can only be larger)"
    ],
    code: `nums.sort()
res = []
for i in range(len(nums) - 2):
    if nums[i] > 0: break
    if i > 0 and nums[i] == nums[i - 1]: continue
    left, right = i + 1, len(nums) - 1
    while left < right:
        s = nums[i] + nums[left] + nums[right]
        if s == 0:
            res.append([nums[i], nums[left], nums[right]])
            while left < right and nums[left] == nums[left + 1]: left += 1
            while left < right and nums[right] == nums[right - 1]: right -= 1
            left += 1; right -= 1
        elif s < 0: left += 1
        else: right -= 1
return res`,
    variants: [
      "4Sum (LC 18)",
      "3Sum Closest (LC 16)"
    ]
  },

  {
    id: 11,
    name: "Container With Most Water",
    difficulty: "Medium",
    pattern: "Two Pointers",
    trigger: [
      "maximum area between two vertical lines in height array",
      "two pointers converging from ends"
    ],
    coreIdea: "Two pointers at the ends. Area = min(h[l], h[r]) × (r-l). Always move the SHORTER side inward — moving the taller side can only shrink width without increasing the min height.",
    coreIdeaHinglish: "Left aur right se start karo. Area = min height × width. Jo side chhoti hai usse andar la do — tall side ko move karne se area kabhi nahi badh sakta.",
    approach: [
      "left = 0, right = n-1, ans = 0",
      "While left < right: ans = max(ans, min(h[l], h[r]) * (r-l))",
      "If h[l] < h[r]: left++ else: right--"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Move the SHORTER pointer — moving the taller one can't increase the area",
      "If heights equal, move either side (both are equally limiting)",
      "Don't confuse with Trapping Rain Water (LC 42) — different problem"
    ],
    code: `left, right = 0, len(height) - 1
ans = 0
while left < right:
    ans = max(ans, min(height[left], height[right]) * (right - left))
    if height[left] < height[right]:
        left += 1
    else:
        right -= 1
return ans`,
    variants: [
      "Trapping Rain Water (LC 42)"
    ]
  },

  {
    id: 167,
    name: "Two Sum II — Input Array Is Sorted",
    difficulty: "Medium",
    pattern: "Two Pointers",
    trigger: [
      "two numbers summing to target in a SORTED array",
      "O(1) space — no hash map, leverage sorted order"
    ],
    coreIdea: "Two pointers at start and end. Sum too small → move left right. Sum too large → move right left. Exactly one solution guaranteed.",
    coreIdeaHinglish: "Array sorted hai isliye two pointer chalte hain. Sum chota? Left badao. Sum bada? Right ghatao. Ek hi solution hai, zaroor milega.",
    approach: [
      "left = 0, right = n-1",
      "s = numbers[left] + numbers[right]",
      "If s == target: return [left+1, right+1]; elif s < target: left++; else: right--"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Return 1-indexed: [left+1, right+1]",
      "Same element can't be used twice — left < right always holds",
      "Don't use a hash map — problem specifically tests O(1) space"
    ],
    code: `left, right = 0, len(numbers) - 1
while left < right:
    s = numbers[left] + numbers[right]
    if s == target:
        return [left + 1, right + 1]
    elif s < target:
        left += 1
    else:
        right -= 1`,
    variants: [
      "Two Sum (LC 1) — unsorted → hash map",
      "3Sum (LC 15)"
    ]
  },

  {
    id: 75,
    name: "Sort Colors",
    difficulty: "Medium",
    pattern: "Two Pointers",
    trigger: [
      "sort array of only 0, 1, 2 in-place, one pass",
      "Dutch National Flag algorithm"
    ],
    coreIdea: "Three pointers: low, mid, high. mid scans left to right. 0 → swap with low, advance both. 2 → swap with high, shrink high (don't advance mid). 1 → advance mid only.",
    coreIdeaHinglish: "Teen pointers: low, mid, high. 0 mila? low se swap, dono aage. 2 mila? high se swap, high peeche — mid wahi rahe (woh element abhi unprocessed hai). 1 mila? mid aage.",
    approach: [
      "low = mid = 0, high = n-1",
      "While mid <= high: if nums[mid]==0: swap(low,mid), low++, mid++",
      "Elif nums[mid]==2: swap(mid,high), high--",
      "Else: mid++"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "On swap with high: DON'T advance mid — element swapped in from high is unprocessed",
      "On swap with low: advance BOTH — element from low is always 1 by invariant",
      "Loop condition: mid <= high (not mid < high)"
    ],
    code: `low = mid = 0
high = len(nums) - 1
while mid <= high:
    if nums[mid] == 0:
        nums[low], nums[mid] = nums[mid], nums[low]
        low += 1; mid += 1
    elif nums[mid] == 2:
        nums[mid], nums[high] = nums[high], nums[mid]
        high -= 1
    else:
        mid += 1`,
    variants: [
      "Partition Array According to Given Pivot (LC 2161)"
    ]
  },

  {
    id: 31,
    name: "Next Permutation",
    difficulty: "Medium",
    pattern: "Two Pointers",
    trigger: [
      "rearrange to next lexicographically larger permutation, in-place",
      "find rightmost descent, swap with next-greater, reverse suffix"
    ],
    coreIdea: "Find the rightmost index i where nums[i] < nums[i+1]. Swap nums[i] with the smallest element to its right that's larger. Reverse everything after i.",
    coreIdeaHinglish: "Right se wo jagah dhundo jahan nums[i] < nums[i+1]. Phir right me se nums[i] se bada sabse chhota element dhundo, swap karo. Phir right portion reverse karo.",
    approach: [
      "i = n-2; scan right while nums[i] >= nums[i+1]",
      "If i >= 0: j = n-1; scan right while nums[j] <= nums[i]; swap i and j",
      "Reverse nums[i+1:]"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "If no descent (fully descending) → reverse whole array (last → first permutation)",
      "j scan goes right-to-left — nearest element > nums[i] from the right",
      "Reverse the suffix (don't sort) — it's already descending after the swap"
    ],
    code: `n = len(nums)
i = n - 2
while i >= 0 and nums[i] >= nums[i + 1]:
    i -= 1
if i >= 0:
    j = n - 1
    while nums[j] <= nums[i]:
        j -= 1
    nums[i], nums[j] = nums[j], nums[i]
nums[i + 1:] = reversed(nums[i + 1:])`,
    variants: [
      "Permutation Sequence (LC 60)",
      "Permutations (LC 46)"
    ]
  },

  {
    id: 189,
    name: "Rotate Array",
    difficulty: "Medium",
    pattern: "Two Pointers",
    trigger: [
      "rotate array right by k steps, in-place, O(1) space",
      "three reverses"
    ],
    coreIdea: "Three reverses: reverse all → reverse first k → reverse the rest. Net effect is a right rotation by k positions.",
    coreIdeaHinglish: "Teen baar reverse karo — pehle pura array, phir pehle k elements, phir baaki. Teen reverse milke rotation deta hai. Extra array nahi chahiye.",
    approach: [
      "k %= len(nums)",
      "Reverse all nums[0..n-1]",
      "Reverse nums[0..k-1]",
      "Reverse nums[k..n-1]"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "k %= n first — k > n would rotate past itself",
      "If k == 0 after mod: no-op (still correct)",
      "Slice assignment (nums[:] = ...) uses O(n) space; use in-place swap loop for strict O(1)"
    ],
    code: `def rev(l, r):
    while l < r:
        nums[l], nums[r] = nums[r], nums[l]
        l += 1; r -= 1
n = len(nums)
k %= n
rev(0, n - 1)
rev(0, k - 1)
rev(k, n - 1)`,
    variants: [
      "Rotate List (LC 61)",
      "Rotate Image (LC 48)"
    ]
  },

  {
    id: 5,
    name: "Longest Palindromic Substring",
    difficulty: "Medium",
    pattern: "Two Pointers",
    trigger: [
      "longest palindromic substring (contiguous, not subsequence)",
      "expand around center"
    ],
    coreIdea: "Expand around each center. Two cases per index: odd-length (center at i) and even-length (center between i and i+1). Expand while characters match, track the longest.",
    coreIdeaHinglish: "Har index ko center maan ke expand karo — odd aur even dono try karo. l aur r same hain? Dono bahar jao. Max expansion track karo.",
    approach: [
      "For each i: try (l=i, r=i) for odd and (l=i, r=i+1) for even",
      "While l>=0 and r<n and s[l]==s[r]: if r-l+1 > len(res): res=s[l:r+1]; l--; r++"
    ],
    time: "O(n²)",
    space: "O(1)",
    pitfalls: [
      "After expansion loop, palindrome is s[l+1:r] — l and r are one past the valid boundary",
      "Two separate expand calls per index (odd + even) — don't skip the even case",
      "Manacher's is O(n) but expand-around-center is accepted in interviews"
    ],
    code: `res = ""
for i in range(len(s)):
    for l, r in [(i, i), (i, i + 1)]:
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > len(res):
                res = s[l:r + 1]
            l -= 1; r += 1
return res`,
    variants: [
      "Palindromic Substrings (LC 647) — count instead of longest",
      "Longest Palindromic Subsequence (LC 516)"
    ]
  },

  // ── Stack ────────────────────────────────────────────────────

  {
    id: 739,
    name: "Daily Temperatures",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "next warmer day for each index",
      "monotonic decreasing stack"
    ],
    coreIdea: "Monotonic decreasing stack of (temp, index). When a warmer day arrives, pop all colder days — their wait time is now known (current index - stored index).",
    coreIdeaHinglish: "Stack me (temp, index) rakho. Warmer day mila? Sab colder elements pop karo aur unka answer fill karo. Stack sirf un elements ka hai jinka answer abhi pata nahi.",
    approach: [
      "ans = [0]*n, stack = []",
      "For i, t: while stack and t > stack[-1][0]: _, i0 = pop; ans[i0] = i - i0",
      "stack.append((t, i))"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Store INDEX in the stack — needed to compute the distance",
      "Initialize ans = [0]*n — remaining zeros correctly mean 'no warmer day'",
      "Strictly greater (t > top): equal temperature is NOT warmer"
    ],
    code: `ans = [0] * len(temperatures)
stack = []  # (temp, index)
for i, t in enumerate(temperatures):
    while stack and t > stack[-1][0]:
        _, i0 = stack.pop()
        ans[i0] = i - i0
    stack.append((t, i))
return ans`,
    variants: [
      "Next Greater Element I (LC 496)",
      "Online Stock Span (LC 901)"
    ]
  },

  {
    id: 22,
    name: "Generate Parentheses",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "all valid combinations of n pairs of parentheses",
      "backtracking with open/close count constraints"
    ],
    coreIdea: "Backtrack with two rules: add '(' only when open < n; add ')' only when close < open. When both reach n, record the string.",
    coreIdeaHinglish: "Backtrack karo. '(' tabhi add karo jab open < n. ')' tabhi add karo jab close < open — kyunki close kabhi open se aage nahi ja sakta. Dono n ho gaye? Result me daalo.",
    approach: [
      "bt(open, close, curr): if open == close == n: append; return",
      "If open < n: bt(open+1, close, curr+'(')",
      "If close < open: bt(open, close+1, curr+')')"
    ],
    time: "O(4ⁿ / √n) — Catalan number",
    space: "O(n) stack depth",
    pitfalls: [
      "close < open (not <=) — closing bracket can't precede a matching open bracket",
      "n is number of PAIRS — total string length is 2n",
      "No explicit validity check needed — constraints guarantee validity"
    ],
    code: `res = []
def bt(open, close, cur):
    if open == close == n:
        res.append(cur); return
    if open < n: bt(open + 1, close, cur + '(')
    if close < open: bt(open, close + 1, cur + ')')
bt(0, 0, "")
return res`,
    variants: [
      "Letter Combinations of a Phone Number (LC 17)",
      "Valid Parentheses (LC 20)"
    ]
  },

  {
    id: 150,
    name: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "evaluate postfix (RPN) expression",
      "operators applied to the last two stack elements"
    ],
    coreIdea: "Stack. Numbers → push. Operator → pop b then a, compute a op b, push result. Order matters: b is popped first.",
    coreIdeaHinglish: "Number mila? Push. Operator mila? Do pop karo — pehla pop b, doosra pop a. a op b compute karo aur push. Note karo: b pehle nikalta hai, a baad me.",
    approach: [
      "For each token: if operator: b = pop, a = pop; push(a op b)",
      "Else: push(int(token))",
      "Return stack[0]"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Pop order: b = stack.pop() first, then a — compute a-b and a/b, not b-a",
      "Division truncates toward zero: use int(a/b), NOT a//b (Python floor-divides negatives differently)",
      "Check token in a SET {'+','-','*','/'} to avoid catching negative number strings"
    ],
    code: `stack = []
for tok in tokens:
    if tok in {'+', '-', '*', '/'}:
        b, a = stack.pop(), stack.pop()
        if tok == '+': stack.append(a + b)
        elif tok == '-': stack.append(a - b)
        elif tok == '*': stack.append(a * b)
        else: stack.append(int(a / b))
    else:
        stack.append(int(tok))
return stack[0]`,
    variants: [
      "Basic Calculator (LC 224)",
      "Basic Calculator II (LC 227)"
    ]
  },

  {
    id: 853,
    name: "Car Fleet",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "count fleets reaching destination — cars that can't overtake merge",
      "sort by position + monotonic stack of arrival times"
    ],
    coreIdea: "Sort cars by position descending (closest to target first). Compute time-to-destination per car. If a car's time ≤ the fleet ahead's time, it merges. Stack tracks distinct fleet times.",
    coreIdeaHinglish: "Position se descending sort karo. Har car ka time = (target - pos) / speed. Agar time ≤ pichle fleet ka time hai, woh merge ho jaati hai — push mat karo. Stack ka size = fleet count.",
    approach: [
      "Sort (position, speed) by -position",
      "For each car: t = (target - pos) / speed",
      "If stack and t <= stack[-1]: skip (merged)",
      "Else: stack.append(t); return len(stack)"
    ],
    time: "O(n log n)",
    space: "O(n)",
    pitfalls: [
      "Sort DESCENDING by position — process cars closest to target first",
      "Merge when time ≤ (not <) stack top — equal arrival = simultaneous = same fleet",
      "Answer is len(stack), not any other count"
    ],
    code: `cars = sorted(zip(position, speed), key=lambda x: -x[0])
stack = []
for pos, spd in cars:
    t = (target - pos) / spd
    if stack and t <= stack[-1]:
        continue
    stack.append(t)
return len(stack)`,
    variants: [
      "Car Fleet II (LC 1776)"
    ]
  },

  {
    id: 71,
    name: "Simplify Path",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "simplify Unix path: handle '..', '.', and multiple consecutive slashes"
    ],
    coreIdea: "Split on '/'. For each part: '..' → pop stack (if non-empty); '.' or '' → skip; else → push. Rejoin with '/' and prepend '/'.",
    coreIdeaHinglish: "Path ko '/' pe split karo. '..' mila? Stack se pop. '.' ya empty string? Skip. Baaki sab push. Akhir me '/' + '/'.join(stack) return karo.",
    approach: [
      "stack = []",
      "For part in path.split('/'): if '..': pop if stack; elif '' or '.': skip; else: push",
      "Return '/' + '/'.join(stack)"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Multiple slashes produce empty strings from split — skip '' tokens",
      "'..' on empty stack → do nothing (already at root)",
      "Always prepend '/' — root is always present in an absolute path"
    ],
    code: `stack = []
for part in path.split('/'):
    if part == '..':
        if stack: stack.pop()
    elif part and part != '.':
        stack.append(part)
return '/' + '/'.join(stack)`,
    variants: [
      "Longest Absolute File Path (LC 388)"
    ]
  },

  {
    id: 394,
    name: "Decode String",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "decode nested k[encoded_string] format",
      "brackets can be nested — stack handles depth"
    ],
    coreIdea: "Two stacks: multipliers and strings. On '[': push state and reset. On ']': pop previous string and repeat current k times, prepend.",
    coreIdeaHinglish: "Do stacks — ek multipliers ke liye, ek strings ke liye. '[' mila? Dono push karo, reset. ']' mila? Pop karo, current string ko k baar repeat karo aur pehle wali string se jodo.",
    approach: [
      "count_stack, str_stack, curr='', k=0",
      "Digit: k = k*10 + int(c)",
      "'[': push k, curr; reset curr='', k=0",
      "']': curr = str_stack.pop() + count_stack.pop() * curr"
    ],
    time: "O(n × max_k)",
    space: "O(n)",
    pitfalls: [
      "k can be multi-digit: k = k*10 + int(c), not just int(c)",
      "On ']': old string PREPENDS — curr = old_str + k * curr (order matters)",
      "Letters outside brackets accumulate naturally into curr"
    ],
    code: `count_stack, str_stack = [], []
curr, k = "", 0
for c in s:
    if c.isdigit():
        k = k * 10 + int(c)
    elif c == '[':
        count_stack.append(k)
        str_stack.append(curr)
        curr, k = "", 0
    elif c == ']':
        curr = str_stack.pop() + count_stack.pop() * curr
    else:
        curr += c
return curr`,
    variants: [
      "Number of Atoms (LC 726)",
      "Basic Calculator (LC 224)"
    ]
  },

  {
    id: 901,
    name: "Online Stock Span",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "consecutive days (including today) where price ≤ today (streaming)",
      "monotonic decreasing stack with span accumulation"
    ],
    coreIdea: "Stack of (price, span). When today's price ≥ top, pop and add its span to today's. O(1) amortized — each element is pushed and popped exactly once.",
    coreIdeaHinglish: "Stack me (price, span) rakho. Aaj ka price pichle se bada ya barabar? Pop karo aur unka span accumulate karo. Sirf decreasing prices stack me rehte hain.",
    approach: [
      "self.stack = []  # (price, span)",
      "next(price): span = 1",
      "While stack and price >= stack[-1][0]: span += stack.pop()[1]",
      "stack.append((price, span)); return span"
    ],
    time: "O(1) amortized",
    space: "O(n)",
    pitfalls: [
      "Store SPAN in stack, not index — spans accumulate across pops",
      "Pop when price >= top (equal prices count as continuation of span)",
      "Reset span = 1 at start of each next() call, then accumulate popped spans"
    ],
    code: `class StockSpanner:
    def __init__(self):
        self.stack = []  # (price, span)
    def next(self, price):
        span = 1
        while self.stack and price >= self.stack[-1][0]:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`,
    variants: [
      "Daily Temperatures (LC 739)",
      "Next Greater Element II (LC 503)"
    ]
  },

  {
    id: 402,
    name: "Remove K Digits",
    difficulty: "Medium",
    pattern: "Stack",
    trigger: [
      "remove k digits to form the smallest possible number",
      "monotonic increasing stack — greedily remove larger leading digits"
    ],
    coreIdea: "Build a monotonic increasing stack. When a new digit is smaller than the top, pop (one removal). After k removals, append remaining as-is. Strip leading zeros.",
    coreIdeaHinglish: "Monotonic increasing stack banao. Naya digit top se chota hai? Pop karo — woh ek removal hai. k removals ke baad ruk jao. Leading zeros hatao. Agar k bache, end se katao.",
    approach: [
      "stack = [], k_rem = k",
      "For d: while k_rem and stack and d < stack[-1]: pop, k_rem--; push d",
      "If k_rem: stack = stack[:-k_rem]",
      "Return ''.join(stack).lstrip('0') or '0'"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "After loop: if k_rem > 0, remove last k_rem digits (they're the largest remaining)",
      "Strip leading zeros then return '0' if string is empty",
      "Use strict < for pop — equal digits stay in order (preserves smallest)"
    ],
    code: `stack, k_rem = [], k
for d in num:
    while k_rem and stack and d < stack[-1]:
        stack.pop()
        k_rem -= 1
    stack.append(d)
if k_rem:
    stack = stack[:-k_rem]
return ''.join(stack).lstrip('0') or '0'`,
    variants: [
      "Remove Duplicate Letters (LC 316)",
      "Find the Most Competitive Subsequence (LC 1673)"
    ]
  },

  // ── Binary Search ────────────────────────────────────────────

  {
    id: 153,
    name: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "minimum element in a rotated sorted array",
      "no duplicates — use mid vs right comparison"
    ],
    coreIdea: "Binary search by comparing mid to right. If nums[mid] > nums[right], minimum is in right half. Otherwise it's in left half (including mid).",
    coreIdeaHinglish: "Mid ko right se compare karo. nums[mid] > nums[right]? Minimum right me hai. Warna left me hai (mid bhi include ho sakta hai).",
    approach: [
      "left = 0, right = n-1",
      "While left < right: mid = (left+right)//2",
      "If nums[mid] > nums[right]: left = mid+1",
      "Else: right = mid"
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: [
      "Compare mid with RIGHT (not left) — cleaner invariant for rotation",
      "right = mid (not mid-1) when nums[mid] <= nums[right] — mid could be the answer",
      "Loop ends when left == right — that's the minimum"
    ],
    code: `left, right = 0, len(nums) - 1
while left < right:
    mid = (left + right) // 2
    if nums[mid] > nums[right]:
        left = mid + 1
    else:
        right = mid
return nums[left]`,
    variants: [
      "Search in Rotated Sorted Array (LC 33)",
      "Find Minimum in Rotated Sorted Array II (LC 154) — with duplicates"
    ]
  },

  {
    id: 33,
    name: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "search target in rotated sorted array",
      "determine which half is sorted, then narrow search"
    ],
    coreIdea: "One of the two halves is always sorted. Check which half is sorted, then decide if target falls in it. Narrow accordingly.",
    coreIdeaHinglish: "Do halves me se ek hamesha sorted hogi. Dekho kaunsi sorted hai, phir check karo target us half me hai ya nahi. Accordingly search narrow karo.",
    approach: [
      "While left <= right: mid = (l+r)//2; if found: return mid",
      "If left half sorted (nums[l] <= nums[mid]): if l <= target < mid: r=mid-1 else: l=mid+1",
      "Else right half sorted: if mid < target <= r: l=mid+1 else: r=mid-1"
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: [
      "Check nums[left] <= nums[mid] (not < ) to identify sorted left half — equal handles edge case",
      "Boundary conditions for target range: target in [nums[l], nums[mid]) for left-sorted half",
      "Doesn't work with duplicates (see LC 81)"
    ],
    code: `left, right = 0, len(nums) - 1
while left <= right:
    mid = (left + right) // 2
    if nums[mid] == target: return mid
    if nums[left] <= nums[mid]:  # left half sorted
        if nums[left] <= target < nums[mid]:
            right = mid - 1
        else:
            left = mid + 1
    else:  # right half sorted
        if nums[mid] < target <= nums[right]:
            left = mid + 1
        else:
            right = mid - 1
return -1`,
    variants: [
      "Find Minimum in Rotated Sorted Array (LC 153)",
      "Search in Rotated Sorted Array II (LC 81) — with duplicates"
    ]
  },

  {
    id: 875,
    name: "Koko Eating Bananas",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "minimum rate/capacity satisfying a constraint within h hours",
      "binary search on the answer space"
    ],
    coreIdea: "Binary search on the eating speed (1 to max(piles)). For each candidate speed, check if Koko can finish within h hours. Minimize the valid speed.",
    coreIdeaHinglish: "Speed pe binary search karo (1 se max pile tak). Har candidate speed ke liye check karo ki h hours me khatam hoga ya nahi. Valid speed me minimum dhundo.",
    approach: [
      "left = 1, right = max(piles)",
      "While left < right: mid = (l+r)//2",
      "hours = sum(ceil(p/mid) for p in piles)",
      "If hours <= h: right = mid else: left = mid+1"
    ],
    time: "O(n log m) where m = max(piles)",
    space: "O(1)",
    pitfalls: [
      "Use ceil(p/mid) = (p + mid - 1) // mid (avoid floating point)",
      "right = mid (not mid-1) on success — mid itself could be the answer",
      "Search space is [1, max(piles)], not [0, sum(piles)]"
    ],
    code: `import math
left, right = 1, max(piles)
while left < right:
    mid = (left + right) // 2
    hours = sum(math.ceil(p / mid) for p in piles)
    if hours <= h:
        right = mid
    else:
        left = mid + 1
return left`,
    variants: [
      "Capacity to Ship Packages (LC 1011)",
      "Minimum Number of Days to Make m Bouquets (LC 1482)"
    ]
  },

  {
    id: 74,
    name: "Search a 2D Matrix",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "search in matrix where rows are sorted and first element of each row > last of previous",
      "treat 2D matrix as a flat sorted array"
    ],
    coreIdea: "The matrix is a flat sorted array. Map index i → (i//cols, i%cols). Binary search on [0, rows*cols - 1].",
    coreIdeaHinglish: "Matrix ko flat sorted array maan lo. Index i = row * cols + col. Ulta bhi karo: row = i//cols, col = i%cols. Phir normal binary search.",
    approach: [
      "left = 0, right = rows*cols - 1",
      "mid = (l+r)//2; val = matrix[mid//cols][mid%cols]",
      "If val == target: return True; elif < target: left=mid+1; else: right=mid-1"
    ],
    time: "O(log(m·n))",
    space: "O(1)",
    pitfalls: [
      "Index mapping: row = mid // cols, col = mid % cols",
      "Prerequisite: first element of each row > last element of previous row (strictly increasing globally)",
      "Different from LC 240 (Search a 2D Matrix II) where only rows and columns are sorted"
    ],
    code: `rows, cols = len(matrix), len(matrix[0])
left, right = 0, rows * cols - 1
while left <= right:
    mid = (left + right) // 2
    val = matrix[mid // cols][mid % cols]
    if val == target: return True
    elif val < target: left = mid + 1
    else: right = mid - 1
return False`,
    variants: [
      "Search a 2D Matrix II (LC 240) — rows and cols sorted separately"
    ]
  },

  {
    id: 981,
    name: "Time Based Key-Value Store",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "key-value store with timestamps — get latest value at or before a given time",
      "binary search on sorted timestamp list"
    ],
    coreIdea: "Store values as list of (timestamp, value) per key. On get, binary search for the largest timestamp ≤ given time. Return its value (or '' if none).",
    coreIdeaHinglish: "Har key ke liye (timestamp, value) list rakho. get pe binary search karo — uss time se chhota ya barabar sabse bada timestamp dhundo. Wahi return karo.",
    approach: [
      "store = defaultdict(list)",
      "set: store[key].append((timestamp, value))",
      "get: binary search store[key] for largest ts <= timestamp; bisect_right(ts_list, timestamp) - 1"
    ],
    time: "O(log n) get, O(1) set",
    space: "O(n)",
    pitfalls: [
      "Timestamps for a key are already in ascending order (per problem guarantee) — no explicit sorting needed",
      "bisect_right on timestamps list, then check index-1 exists",
      "Return '' if index-1 < 0 (no valid timestamp)"
    ],
    code: `from collections import defaultdict
import bisect
class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)
    def set(self, key, value, timestamp):
        self.store[key].append((timestamp, value))
    def get(self, key, timestamp):
        vals = self.store[key]
        i = bisect.bisect_right(vals, (timestamp, chr(127))) - 1
        return vals[i][1] if i >= 0 else ""`,
    variants: [
      "Design an Ordered Stream (LC 1656)"
    ]
  },

  {
    id: 162,
    name: "Find Peak Element",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "find any peak element (greater than neighbors) in O(log n)",
      "nums[-1] = nums[n] = -inf guarantees a peak exists"
    ],
    coreIdea: "Binary search: if nums[mid] < nums[mid+1], peak is to the right (ascending slope). Otherwise peak is at mid or to the left. Converge to any peak.",
    coreIdeaHinglish: "Mid ke right neighbor se compare karo. nums[mid] < nums[mid+1]? Peak right me hai (slope upar ja rahi hai). Warna peak mid me ya left me hai.",
    approach: [
      "left = 0, right = n-1",
      "While left < right: mid = (l+r)//2",
      "If nums[mid] < nums[mid+1]: left = mid+1",
      "Else: right = mid"
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: [
      "Any peak is valid — not necessarily the global maximum",
      "right = mid (not mid-1) when nums[mid] >= nums[mid+1] — mid could be the peak",
      "Boundary nums[-1] and nums[n] are treated as -inf by the problem — no bounds check needed"
    ],
    code: `left, right = 0, len(nums) - 1
while left < right:
    mid = (left + right) // 2
    if nums[mid] < nums[mid + 1]:
        left = mid + 1
    else:
        right = mid
return left`,
    variants: [
      "Find Peak in Mountain Array (LC 852)",
      "Peak Index in a Mountain Array (LC 852)"
    ]
  },

  {
    id: 540,
    name: "Single Element in a Sorted Array",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "find the element that appears only once in a sorted array of pairs",
      "O(log n) — binary search on even indices"
    ],
    coreIdea: "Before the single element, pairs occupy (even, odd) index positions. After it, pairs shift to (odd, even). Binary search on even indices: if nums[mid] == nums[mid+1], single is to the right; otherwise to the left.",
    coreIdeaHinglish: "Single element se pehle pairs (even, odd) me hain. Baad me shift ho jaate hain. Mid ko mid+1 se compare karo — same hai? Single right me hai. Alag hai? Single mid ya left me hai.",
    approach: [
      "left = 0, right = n-1 (keep both even by moving to even indices)",
      "mid = (l+r)//2; if mid is odd: mid--",
      "If nums[mid] == nums[mid+1]: left = mid+2 else: right = mid"
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: [
      "Force mid to even index (mid -= 1 if mid%2 == 1) to maintain the invariant",
      "right = mid (not mid-1) when nums[mid] != nums[mid+1] — mid could be the answer",
      "Loop ends at left == right — that's the single element"
    ],
    code: `left, right = 0, len(nums) - 1
while left < right:
    mid = (left + right) // 2
    if mid % 2 == 1:
        mid -= 1
    if nums[mid] == nums[mid + 1]:
        left = mid + 2
    else:
        right = mid
return nums[left]`,
    variants: [
      "Single Number (LC 136) — XOR approach O(n)",
      "Single Number II (LC 137)"
    ]
  },

  {
    id: 1011,
    name: "Capacity to Ship Packages Within D Days",
    difficulty: "Medium",
    pattern: "Binary Search",
    trigger: [
      "minimum capacity to complete task within d days",
      "binary search on answer space (capacity)"
    ],
    coreIdea: "Binary search on capacity [max(weights), sum(weights)]. For each candidate capacity, simulate shipping greedily — check if all packages fit within D days.",
    coreIdeaHinglish: "Capacity pe binary search karo. Har candidate capacity ke liye simulate karo — greedy ship karo aur dekho D days me khatam hoga ya nahi. Valid capacity me minimum dhundo.",
    approach: [
      "left = max(weights), right = sum(weights)",
      "While left < right: mid = (l+r)//2",
      "Simulate: days needed with capacity mid",
      "If days <= D: right = mid else: left = mid+1"
    ],
    time: "O(n log S) where S = sum(weights)",
    space: "O(1)",
    pitfalls: [
      "left starts at max(weights) — ship must carry each package individually at minimum",
      "Simulation: new day when adding next weight would exceed capacity",
      "right = mid on success (mid itself could be the minimum valid capacity)"
    ],
    code: `left, right = max(weights), sum(weights)
while left < right:
    mid = (left + right) // 2
    days = curr = 1
    for w in weights:
        if curr + w > mid:
            days += 1; curr = 0
        curr += w
    if days <= D:
        right = mid
    else:
        left = mid + 1
return left`,
    variants: [
      "Koko Eating Bananas (LC 875)",
      "Split Array Largest Sum (LC 410)"
    ]
  },

  // ── Linked List ──────────────────────────────────────────────

  {
    id: 143,
    name: "Reorder List",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "reorder L0→Ln→L1→Ln-1→... in-place",
      "split in half, reverse second half, merge alternately"
    ],
    coreIdea: "Three steps: (1) find middle with slow/fast pointers, (2) reverse the second half, (3) merge the two halves alternately.",
    coreIdeaHinglish: "Teen steps: pehle middle dhundo (slow/fast). Phir doosri half reverse karo. Phir dono ko alternate merge karo.",
    approach: [
      "slow/fast to find mid; split: second = mid.next; mid.next = None",
      "Reverse second half in-place",
      "Merge: alternately take one from each half"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Null-terminate the first half (mid.next = None) before reversing second",
      "In merge loop: save next pointers before rewiring",
      "fast starts at head.next (not head) to get the left-center mid for even-length lists"
    ],
    code: `slow, fast = head, head.next
while fast and fast.next:
    slow = slow.next; fast = fast.next.next
second = slow.next; slow.next = None
# Reverse second half
prev = None
while second:
    nxt = second.next; second.next = prev
    prev = second; second = nxt
# Merge
first, second = head, prev
while second:
    tmp1, tmp2 = first.next, second.next
    first.next = second; second.next = tmp1
    first = tmp1; second = tmp2`,
    variants: [
      "Reverse Linked List (LC 206)",
      "Palindrome Linked List (LC 234)"
    ]
  },

  {
    id: 19,
    name: "Remove Nth Node From End of List",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "remove the nth node from the end in one pass",
      "two pointers n apart"
    ],
    coreIdea: "Two pointers starting at a dummy node. Advance fast n+1 steps ahead. Then move both until fast reaches None — slow is now just before the target node.",
    coreIdeaHinglish: "Dummy node se dono pointers shuru karo. fast ko n+1 steps aage bhejo. Phir dono saath chalao jab tak fast None na ho jaye — slow target ke ek pehle hoga.",
    approach: [
      "dummy → head; fast = slow = dummy",
      "Advance fast n+1 times",
      "While fast: fast = fast.next; slow = slow.next",
      "slow.next = slow.next.next"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Use a dummy node to handle removing the head cleanly",
      "Advance fast n+1 times (not n) so slow lands one before the target",
      "If n equals list length, removing head — dummy handles this without special case"
    ],
    code: `dummy = ListNode(0, head)
fast = slow = dummy
for _ in range(n + 1):
    fast = fast.next
while fast:
    fast = fast.next
    slow = slow.next
slow.next = slow.next.next
return dummy.next`,
    variants: [
      "Reorder List (LC 143)",
      "Middle of the Linked List (LC 876)"
    ]
  },

  {
    id: 2,
    name: "Add Two Numbers",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "add two numbers represented as reversed linked lists",
      "digit-by-digit addition with carry"
    ],
    coreIdea: "Traverse both lists simultaneously. Sum each pair of digits + carry. Carry forward. Create new nodes for each digit of the result.",
    coreIdeaHinglish: "Dono lists ek saath traverse karo. Har step pe dono digits + carry jodo. Result ka ek digit new node me daalo. Carry agle step me le jao.",
    approach: [
      "dummy = ListNode(0), curr = dummy, carry = 0",
      "While l1 or l2 or carry: val = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry",
      "carry, digit = divmod(val, 10); curr.next = ListNode(digit); advance"
    ],
    time: "O(max(m,n))",
    space: "O(max(m,n))",
    pitfalls: [
      "Continue loop while carry != 0 — final carry creates an extra node (e.g., 9+9+carry=19)",
      "Lists may have different lengths — use 0 when one is exhausted",
      "Lists are in reverse order (ones digit first) — no need to reverse"
    ],
    code: `dummy = ListNode(0)
curr = dummy
carry = 0
while l1 or l2 or carry:
    v1 = l1.val if l1 else 0
    v2 = l2.val if l2 else 0
    carry, digit = divmod(v1 + v2 + carry, 10)
    curr.next = ListNode(digit)
    curr = curr.next
    if l1: l1 = l1.next
    if l2: l2 = l2.next
return dummy.next`,
    variants: [
      "Add Binary (LC 67)",
      "Multiply Strings (LC 43)"
    ]
  },

  {
    id: 287,
    name: "Find the Duplicate Number",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "find duplicate in array of n+1 integers in [1,n], O(1) space",
      "Floyd's cycle detection — treat array as implicit linked list"
    ],
    coreIdea: "Treat nums as a linked list: index → nums[index]. Duplicate creates a cycle. Floyd's slow/fast detects the cycle entry — that's the duplicate.",
    coreIdeaHinglish: "Array ko linked list maan lo — index se nums[index] pe jao. Duplicate se cycle banti hai. Floyd's algorithm se cycle entry dhundo — wahi duplicate hai.",
    approach: [
      "slow = fast = nums[0]",
      "Phase 1: slow=nums[slow], fast=nums[nums[fast]] until equal",
      "Phase 2: slow=nums[0]; both advance one step until equal",
      "Return slow"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Don't start both at 0 — start at nums[0] (element, not index)",
      "Phase 2: reset ONE pointer to start (nums[0]), advance BOTH by one",
      "Modifies nothing — read-only; can't sort or use HashSet (violates constraints)"
    ],
    code: `slow = fast = nums[0]
while True:
    slow = nums[slow]
    fast = nums[nums[fast]]
    if slow == fast: break
slow = nums[0]
while slow != fast:
    slow = nums[slow]
    fast = nums[fast]
return slow`,
    variants: [
      "Linked List Cycle II (LC 142)",
      "Missing Number (LC 268)"
    ]
  },

  {
    id: 138,
    name: "Copy List with Random Pointer",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "deep copy a linked list where each node has a random pointer",
      "two-pass or interleaving approach"
    ],
    coreIdea: "HashMap: original node → copy node. First pass creates all copies. Second pass wires next and random pointers using the map.",
    coreIdeaHinglish: "HashMap banao: original → copy. Pehle pass me saare copies banao. Doosre pass me next aur random pointers wire karo map ki help se.",
    approach: [
      "old_to_new = {None: None}",
      "Pass 1: for each node: old_to_new[node] = Node(node.val)",
      "Pass 2: for each node: copy.next = map[node.next]; copy.random = map[node.random]"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Initialize map with {None: None} so random/next = None doesn't require special casing",
      "Two-pass approach is cleaner than interleaving (interleaving is O(1) space but complex)",
      "Deep copy means new nodes, not references to original"
    ],
    code: `old_to_new = {None: None}
cur = head
while cur:
    old_to_new[cur] = Node(cur.val)
    cur = cur.next
cur = head
while cur:
    old_to_new[cur].next   = old_to_new[cur.next]
    old_to_new[cur].random = old_to_new[cur.random]
    cur = cur.next
return old_to_new[head]`,
    variants: [
      "Clone Graph (LC 133)"
    ]
  },

  {
    id: 92,
    name: "Reverse Linked List II",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "reverse nodes from position left to right (1-indexed), in-place",
      "partial reversal with splice-in"
    ],
    coreIdea: "Advance to node before position left. Then iteratively reverse the next (right-left) nodes using the insert-at-front technique. Use a dummy node to handle left=1.",
    coreIdeaHinglish: "left se pehle wale node tak pauncho. Phir right-left baar ke liye 'insert at front of reversed section' technique use karo. Dummy node se left=1 ka edge case handle hota hai.",
    approach: [
      "dummy → head; prev = dummy; advance prev to node before left",
      "curr = prev.next",
      "For _ in range(right-left): nxt=curr.next; curr.next=nxt.next; nxt.next=prev.next; prev.next=nxt"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Use dummy node to avoid special-casing left=1 (head changes)",
      "Don't advance curr in the reversal loop — curr stays as the tail of the reversed section",
      "right-left iterations (not right-left+1) — the loop body moves one node per iteration"
    ],
    code: `dummy = ListNode(0, head)
prev = dummy
for _ in range(left - 1):
    prev = prev.next
curr = prev.next
for _ in range(right - left):
    nxt = curr.next
    curr.next = nxt.next
    nxt.next = prev.next
    prev.next = nxt
return dummy.next`,
    variants: [
      "Reverse Linked List (LC 206)",
      "Reverse Nodes in K-Group (LC 25)"
    ]
  },

  {
    id: 146,
    name: "LRU Cache",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "O(1) get and put with least-recently-used eviction",
      "doubly linked list + hash map"
    ],
    coreIdea: "Doubly linked list (most recent at head, LRU at tail) + HashMap (key → node). On access: remove node and insert at head. On eviction: remove tail. O(1) all ops.",
    coreIdeaHinglish: "Doubly linked list me most recent head pe, LRU tail pe. HashMap se node directly access. Access pe: remove and insert at head. Eviction: tail hata do.",
    approach: [
      "Sentinel head and tail nodes (avoid null checks)",
      "get: if key in map: move to head, return val; else return -1",
      "put: if key in map: update and move to head; else insert at head; if over capacity: evict tail"
    ],
    time: "O(1) all ops",
    space: "O(capacity)",
    pitfalls: [
      "Use sentinel dummy head/tail to avoid null pointer checks during insert/remove",
      "In put: update existing key BEFORE checking capacity (don't evict when just updating)",
      "Remove from map AND list on eviction"
    ],
    code: `class Node:
    def __init__(self, k=0, v=0):
        self.k, self.v, self.prev, self.next = k, v, None, None
class LRUCache:
    def __init__(self, capacity):
        self.cap, self.map = capacity, {}
        self.head, self.tail = Node(), Node()
        self.head.next = self.tail; self.tail.prev = self.head
    def _remove(self, n):
        n.prev.next = n.next; n.next.prev = n.prev
    def _insert(self, n):
        n.next = self.head.next; n.prev = self.head
        self.head.next.prev = n; self.head.next = n
    def get(self, key):
        if key not in self.map: return -1
        self._remove(self.map[key]); self._insert(self.map[key])
        return self.map[key].v
    def put(self, key, value):
        if key in self.map: self._remove(self.map[key])
        self.map[key] = Node(key, value); self._insert(self.map[key])
        if len(self.map) > self.cap:
            lru = self.tail.prev; self._remove(lru); del self.map[lru.k]`,
    variants: [
      "LFU Cache (LC 460)",
      "Design In-Memory File System (LC 588)"
    ]
  },

  {
    id: 142,
    name: "Linked List Cycle II",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "find start of cycle in a linked list, O(1) space",
      "Floyd's cycle detection — phase 2 finds entry"
    ],
    coreIdea: "Floyd's: slow/fast meet inside cycle. Reset slow to head. Advance both one step at a time — they meet at the cycle entry point. Mathematical proof: distance to entry equals distance from meeting point to entry.",
    coreIdeaHinglish: "Phase 1: slow aur fast milte hain cycle ke andar. Phase 2: slow ko head pe reset karo. Dono ek step me chalao — jahan milein, woh cycle ka start hai.",
    approach: [
      "Phase 1: slow=head, fast=head; advance until slow==fast",
      "Phase 2: slow=head; advance both by 1 until slow==fast",
      "Return slow"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Phase 1: if fast or fast.next is None → no cycle, return None",
      "Phase 2: reset slow to HEAD (not to meeting point); advance ONE step at a time (not two)",
      "Don't return head — return the meeting point in phase 2"
    ],
    code: `slow = fast = head
while fast and fast.next:
    slow = slow.next; fast = fast.next.next
    if slow == fast: break
else:
    return None  # no cycle
slow = head
while slow != fast:
    slow = slow.next; fast = fast.next
return slow`,
    variants: [
      "Find the Duplicate Number (LC 287)",
      "Linked List Cycle (LC 141)"
    ]
  },

  {
    id: 24,
    name: "Swap Nodes in Pairs",
    difficulty: "Medium",
    pattern: "Linked List",
    trigger: [
      "swap every two adjacent nodes in-place",
      "dummy node + pointer rewiring"
    ],
    coreIdea: "Use a dummy node. For each pair (first, second): rewire dummy → second → first → rest. Advance to next pair.",
    coreIdeaHinglish: "Dummy node se shuru karo. Har pair ke liye: prev→second, second→first, first→aage wala pair. Advance karo.",
    approach: [
      "dummy → head; prev = dummy",
      "While prev.next and prev.next.next: first=prev.next, second=prev.next.next",
      "first.next=second.next; second.next=first; prev.next=second; prev=first"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Save first.next BEFORE rewiring (it becomes the head of the next pair)",
      "After swap, first is the tail of the pair — prev = first for next iteration",
      "Dummy node handles the case where head itself is swapped"
    ],
    code: `dummy = ListNode(0, head)
prev = dummy
while prev.next and prev.next.next:
    first, second = prev.next, prev.next.next
    first.next = second.next
    second.next = first
    prev.next = second
    prev = first
return dummy.next`,
    variants: [
      "Reverse Nodes in K-Group (LC 25)",
      "Reverse Linked List II (LC 92)"
    ]
  },

  {
    id: 25,
    name: "Reverse Nodes in K-Group",
    difficulty: "Hard",
    pattern: "Linked List",
    trigger: [
      "reverse every k nodes in a linked list, in-place",
      "check k nodes exist before reversing"
    ],
    coreIdea: "Count k nodes ahead. If fewer than k remain, leave as-is. Otherwise reverse the group and recursively (or iteratively) handle the rest.",
    coreIdeaHinglish: "K nodes aage count karo. K se kam hain? Waise hi rehne do. K hain? Reverse karo, phir remaining ke liye recursively same karo.",
    approach: [
      "Check if k nodes exist from current position",
      "Reverse k nodes iteratively; tail of reversed group connects to recursive result",
      "Return new head of reversed group"
    ],
    time: "O(n)",
    space: "O(n/k) recursion stack",
    pitfalls: [
      "Check k nodes BEFORE reversing — partial groups stay unchanged",
      "After reversal, the original head becomes the tail — connect it to the next group",
      "Iterative approach uses a dummy node and pointer gymnastics for O(1) space"
    ],
    code: `def reverseKGroup(head, k):
    cur, count = head, 0
    while cur and count < k:
        cur = cur.next; count += 1
    if count < k: return head
    prev, curr = None, head
    for _ in range(k):
        nxt = curr.next; curr.next = prev
        prev = curr; curr = nxt
    head.next = reverseKGroup(curr, k)
    return prev`,
    variants: [
      "Swap Nodes in Pairs (LC 24)",
      "Reverse Linked List II (LC 92)"
    ]
  },

  // ── Trees ────────────────────────────────────────────────────

  {
    id: 98,
    name: "Validate Binary Search Tree",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "verify BST property holds for ALL descendants, not just direct children",
      "pass min/max bounds down recursively"
    ],
    coreIdea: "Each node must be strictly within (min, max) bounds inherited from its ancestors. Left subtree tightens the upper bound; right subtree tightens the lower bound.",
    coreIdeaHinglish: "Har node ko sirf apne children se compare mat karo — ancestors se aayi bounds bhi check karo. Left jao? Upper bound tighten. Right jao? Lower bound tighten.",
    approach: [
      "validate(node, min_val, max_val): if not node: return True",
      "if node.val <= min_val or node.val >= max_val: return False",
      "return validate(left, min_val, node.val) and validate(right, node.val, max_val)"
    ],
    time: "O(n)",
    space: "O(h)",
    pitfalls: [
      "Checking node.val vs children only is WRONG — a deeper node can violate BST across subtrees",
      "Bounds are STRICT inequalities (left < root < right, no equals)",
      "Initialize with (-inf, inf) at root"
    ],
    code: `def validate(node, lo, hi):
    if not node: return True
    if node.val <= lo or node.val >= hi:
        return False
    return (validate(node.left, lo, node.val) and
            validate(node.right, node.val, hi))
return validate(root, float('-inf'), float('inf'))`,
    variants: [
      "Kth Smallest Element in BST (LC 230)",
      "Recover Binary Search Tree (LC 99)"
    ]
  },

  {
    id: 102,
    name: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "process tree level by level",
      "BFS with a queue, capture each level's snapshot"
    ],
    coreIdea: "BFS with a queue. At the start of each level, snapshot the current queue size — that's how many nodes belong to this level. Process exactly that many before moving to the next.",
    coreIdeaHinglish: "Queue se BFS karo. Har level ke start pe queue ka size note karo — utne hi nodes iss level ke hain. Exactly utne process karo, phir next level.",
    approach: [
      "queue = deque([root]); res = []",
      "While queue: level = []; for _ in range(len(queue)): node=pop left; add to level; push children",
      "res.append(level)"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Snapshot len(queue) at the START of each level loop — it changes as you push children",
      "Use collections.deque for O(1) popleft (list.pop(0) is O(n))",
      "Handle null root before adding to queue"
    ],
    code: `from collections import deque
if not root: return []
queue, res = deque([root]), []
while queue:
    level = []
    for _ in range(len(queue)):
        node = queue.popleft()
        level.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    res.append(level)
return res`,
    variants: [
      "Binary Tree Right Side View (LC 199)",
      "Binary Tree Zigzag Level Order (LC 103)"
    ]
  },

  {
    id: 199,
    name: "Binary Tree Right Side View",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "nodes visible from the right side of the tree",
      "last node of each BFS level"
    ],
    coreIdea: "Level-order BFS. At each level, the last node processed is the rightmost visible one. Append it to the result.",
    coreIdeaHinglish: "Level order BFS karo. Har level ka last node right side se visible hota hai. Uss node ka value result me add karo.",
    approach: [
      "BFS same as LC 102",
      "Instead of collecting full level, just record the last node's val each level"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Track the last node of each level, not just the rightmost child in the tree",
      "A left child can be the rightmost visible if the right subtree is missing",
      "DFS with right-first traversal also works (track depth, update seen[depth] = val)"
    ],
    code: `from collections import deque
if not root: return []
queue, res = deque([root]), []
while queue:
    for i in range(len(queue)):
        node = queue.popleft()
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
        if i == len(queue):  # was last in original level
            res.append(node.val)
return res`,
    variants: [
      "Binary Tree Level Order Traversal (LC 102)",
      "Populating Next Right Pointers (LC 116)"
    ]
  },

  {
    id: 235,
    name: "Lowest Common Ancestor of BST",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "LCA in a BST — exploit BST ordering",
      "both p and q are in the tree"
    ],
    coreIdea: "In a BST, the LCA is the first node where p and q split directions. If both < root → go left. Both > root → go right. Otherwise current node is LCA.",
    coreIdeaHinglish: "BST me LCA wo pehla node hai jahan p aur q alag directions me jaate hain. Dono left me? Left jao. Dono right me? Right jao. Ek left, ek right? Current node LCA hai.",
    approach: [
      "While True: if p.val < root.val and q.val < root.val: root = root.left",
      "Elif p.val > root.val and q.val > root.val: root = root.right",
      "Else: return root"
    ],
    time: "O(h)",
    space: "O(1) iterative",
    pitfalls: [
      "BST property makes this O(h) — don't use the general tree LCA approach",
      "If one of p, q IS the root → root is the LCA (the else branch handles it)",
      "Iterative version is O(1) space — no recursion stack"
    ],
    code: `while root:
    if p.val < root.val and q.val < root.val:
        root = root.left
    elif p.val > root.val and q.val > root.val:
        root = root.right
    else:
        return root`,
    variants: [
      "Lowest Common Ancestor of Binary Tree (LC 236)",
      "Kth Smallest in BST (LC 230)"
    ]
  },

  {
    id: 230,
    name: "Kth Smallest Element in BST",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "kth smallest in BST",
      "in-order traversal yields sorted order"
    ],
    coreIdea: "In-order traversal (left → root → right) of a BST yields elements in ascending order. The kth element visited is the answer.",
    coreIdeaHinglish: "BST ka in-order traversal ascending order deta hai. k-waan element milna hai? Count karte jao, k-waan pe return karo.",
    approach: [
      "Iterative with stack, or recursive with counter",
      "In-order: push left spine; pop and count; push right",
      "Return node.val when count == k"
    ],
    time: "O(h + k)",
    space: "O(h)",
    pitfalls: [
      "Don't convert to full array then index — early exit at kth element is more efficient",
      "Iterative in-order avoids recursion limit for deep trees",
      "k is 1-indexed — decrement count AFTER visiting each node"
    ],
    code: `stack, n = [], root
k_rem = k
while stack or n:
    while n:
        stack.append(n); n = n.left
    n = stack.pop()
    k_rem -= 1
    if k_rem == 0: return n.val
    n = n.right`,
    variants: [
      "Validate Binary Search Tree (LC 98)",
      "Binary Search Tree Iterator (LC 173)"
    ]
  },

  {
    id: 236,
    name: "Lowest Common Ancestor of Binary Tree",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "LCA in a general binary tree (not BST)",
      "post-order DFS — find p and q in subtrees"
    ],
    coreIdea: "Post-order DFS. If current node is p or q, return it. If both children return non-null, current node is the LCA. Otherwise propagate the non-null child upward.",
    coreIdeaHinglish: "Post-order DFS karo. Agar node p ya q hai, return karo. Dono children non-null return karte hain? Current node LCA hai. Warna jo non-null hai use propagate karo.",
    approach: [
      "If not node or node is p or node is q: return node",
      "left = lca(node.left); right = lca(node.right)",
      "If left and right: return node",
      "Return left or right"
    ],
    time: "O(n)",
    space: "O(h)",
    pitfalls: [
      "Both p and q are GUARANTEED to be in the tree — no need to handle 'not found'",
      "If one of p/q is an ancestor of the other, the ancestor is returned first and propagated up",
      "Don't compare by value — compare by reference (node is p)"
    ],
    code: `def lca(node):
    if not node or node is p or node is q:
        return node
    left = lca(node.left)
    right = lca(node.right)
    if left and right: return node
    return left or right
return lca(root)`,
    variants: [
      "Lowest Common Ancestor of BST (LC 235)",
      "LCA of Deepest Leaves (LC 1123)"
    ]
  },

  {
    id: 105,
    name: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "reconstruct tree from preorder + inorder arrays",
      "preorder[0] is always the root"
    ],
    coreIdea: "preorder[0] is root. Find it in inorder → elements to its left are left subtree, right are right subtree. Recurse, slicing both arrays accordingly.",
    coreIdeaHinglish: "preorder[0] hamesha root hai. Usse inorder me dhundo — left wale left subtree, right wale right subtree. Dono arrays slice karo aur recurse karo.",
    approach: [
      "root = TreeNode(preorder[0])",
      "mid = inorder.index(root.val)",
      "root.left = build(preorder[1:mid+1], inorder[:mid])",
      "root.right = build(preorder[mid+1:], inorder[mid+1:])"
    ],
    time: "O(n²) naive; O(n) with index map",
    space: "O(n)",
    pitfalls: [
      "Use a hashmap for inorder indices to avoid O(n) .index() calls per level",
      "Slice sizes: left subtree has 'mid' nodes → preorder[1:mid+1]",
      "Base case: if not preorder or not inorder: return None"
    ],
    code: `idx = {v: i for i, v in enumerate(inorder)}
def build(pre_l, pre_r, in_l, in_r):
    if pre_l > pre_r: return None
    root = TreeNode(preorder[pre_l])
    mid = idx[preorder[pre_l]]
    size = mid - in_l
    root.left  = build(pre_l+1, pre_l+size, in_l, mid-1)
    root.right = build(pre_l+size+1, pre_r, mid+1, in_r)
    return root
return build(0, len(preorder)-1, 0, len(inorder)-1)`,
    variants: [
      "Construct from Postorder and Inorder (LC 106)",
      "Serialize and Deserialize Binary Tree (LC 297)"
    ]
  },

  {
    id: 1448,
    name: "Count Good Nodes in Binary Tree",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "count nodes where no value on root-to-node path is greater",
      "pass max-so-far down the recursion"
    ],
    coreIdea: "DFS tracking the maximum value seen on the path from root to current node. A node is 'good' if its value ≥ the running max.",
    coreIdeaHinglish: "DFS karo aur root se current node tak ka max value track karo. Agar current node ka value >= max hai, woh 'good' node hai.",
    approach: [
      "dfs(node, max_so_far): if not node: return 0",
      "good = 1 if node.val >= max_so_far else 0",
      "max_so_far = max(max_so_far, node.val)",
      "return good + dfs(left, max_so_far) + dfs(right, max_so_far)"
    ],
    time: "O(n)",
    space: "O(h)",
    pitfalls: [
      "Root is always good (no elements before it on path)",
      "Update max_so_far BEFORE recursing into children",
      "Count the current node as good before recursing — don't double-count"
    ],
    code: `def dfs(node, max_val):
    if not node: return 0
    good = 1 if node.val >= max_val else 0
    max_val = max(max_val, node.val)
    return good + dfs(node.left, max_val) + dfs(node.right, max_val)
return dfs(root, root.val)`,
    variants: [
      "Path Sum (LC 112)",
      "Path Sum II (LC 113)"
    ]
  },

  {
    id: 103,
    name: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "level order but alternating left-to-right and right-to-left",
      "BFS + direction toggle per level"
    ],
    coreIdea: "Standard BFS level order. After collecting each level, reverse it if the level index is odd (right-to-left). Toggle direction each level.",
    coreIdeaHinglish: "Normal BFS lo. Har level collect karo. Odd level hai? Reverse karo. Even? Waise hi rakho. Direction toggle karo.",
    approach: [
      "BFS as in LC 102; left_to_right = True",
      "After collecting level: if not left_to_right: level.reverse()",
      "left_to_right = not left_to_right; res.append(level)"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Reversing the collected level is simpler than changing the queue order",
      "Track direction with a boolean, not level index (avoids off-by-one)",
      "Level 0 (root) is left-to-right"
    ],
    code: `from collections import deque
if not root: return []
queue, res, l2r = deque([root]), [], True
while queue:
    level = []
    for _ in range(len(queue)):
        node = queue.popleft()
        level.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    res.append(level if l2r else level[::-1])
    l2r = not l2r
return res`,
    variants: [
      "Binary Tree Level Order Traversal (LC 102)",
      "Binary Tree Right Side View (LC 199)"
    ]
  },

  {
    id: 437,
    name: "Path Sum III",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "count paths summing to target (any start/end, must go downward)",
      "prefix sum on tree paths"
    ],
    coreIdea: "DFS with a running prefix sum. At each node, check how many previous prefix sums equal (current_sum - target) — those form valid paths ending here. Same idea as LC 560.",
    coreIdeaHinglish: "DFS karte waqt prefix sum track karo. Har node pe check karo: (current_sum - target) pehle kisi jagah tha? Agar haan, woh path valid hai. LC 560 ka tree version.",
    approach: [
      "prefix_count = {0: 1}, curr_sum = 0",
      "DFS: curr_sum += node.val; count += prefix_count.get(curr_sum - target, 0)",
      "prefix_count[curr_sum]++; recurse; prefix_count[curr_sum]-- (backtrack)"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "MUST backtrack the prefix_count after visiting a subtree — different root-to-node paths are independent",
      "Initialize {0: 1} as in LC 560 to handle paths starting at root",
      "curr_sum is cumulative from root — not reset per path"
    ],
    code: `from collections import defaultdict
def dfs(node, curr):
    if not node: return 0
    curr += node.val
    count = prefix[curr - targetSum]
    prefix[curr] += 1
    count += dfs(node.left, curr) + dfs(node.right, curr)
    prefix[curr] -= 1
    return count
prefix = defaultdict(int)
prefix[0] = 1
return dfs(root, 0)`,
    variants: [
      "Subarray Sum Equals K (LC 560)",
      "Path Sum II (LC 113)"
    ]
  },

  {
    id: 124,
    name: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    pattern: "Trees",
    trigger: [
      "maximum sum path between any two nodes (path needn't pass through root)",
      "post-order DFS — combine left/right gains"
    ],
    coreIdea: "Post-order DFS. Each node returns the max gain it contributes to its parent (only one branch). At each node, compute the candidate path sum through it (left_gain + node.val + right_gain) and update global max.",
    coreIdeaHinglish: "Post-order DFS. Har node parent ko sirf ek branch return karta hai (max gain). Par khud ke liye dono branches combine karke global max update karo.",
    approach: [
      "gain(node): if not node: return 0",
      "left_gain = max(gain(left), 0); right_gain = max(gain(right), 0)",
      "Update ans = max(ans, node.val + left_gain + right_gain)",
      "Return node.val + max(left_gain, right_gain)"
    ],
    time: "O(n)",
    space: "O(h)",
    pitfalls: [
      "Clamp negative gains to 0 — a negative branch is never worth including",
      "The local answer (through current node) may use BOTH branches, but the return value uses only ONE",
      "ans must be a nonlocal/global variable — it persists across the full DFS"
    ],
    code: `ans = float('-inf')
def gain(node):
    nonlocal ans
    if not node: return 0
    left  = max(gain(node.left), 0)
    right = max(gain(node.right), 0)
    ans = max(ans, node.val + left + right)
    return node.val + max(left, right)
gain(root)
return ans`,
    variants: [
      "Path Sum III (LC 437)",
      "Diameter of Binary Tree (LC 543)"
    ]
  },

  {
    id: 297,
    name: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    pattern: "Trees",
    trigger: [
      "convert binary tree to/from string representation",
      "encode null markers to reconstruct uniquely"
    ],
    coreIdea: "BFS or pre-order DFS serialization with explicit 'null' markers. Deserialization reconstructs by processing the same sequence — null markers tell you where subtrees end.",
    coreIdeaHinglish: "Pre-order DFS se serialize karo, null markers daalo. Deserialize karte waqt same sequence follow karo — null markers batate hain ki subtree kahan khatam hua.",
    approach: [
      "serialize: pre-order DFS; null → 'N'; comma-separated",
      "deserialize: split by comma; use an index or deque; recursively build: if 'N' return None"
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: [
      "Must encode null children explicitly — can't reconstruct without them",
      "Pre-order + nulls uniquely determines the tree (post-order also works; in-order alone does not)",
      "Use an iterator/deque for deserialization so state carries across recursive calls"
    ],
    code: `from collections import deque
def serialize(root):
    vals = []
    def dfs(n):
        if not n: vals.append('N'); return
        vals.append(str(n.val)); dfs(n.left); dfs(n.right)
    dfs(root); return ','.join(vals)
def deserialize(data):
    q = deque(data.split(','))
    def dfs():
        v = q.popleft()
        if v == 'N': return None
        node = TreeNode(int(v))
        node.left = dfs(); node.right = dfs()
        return node
    return dfs()`,
    variants: [
      "Serialize and Deserialize BST (LC 449)",
      "Construct Binary Tree from Preorder/Inorder (LC 105)"
    ]
  },

  {
    id: 116,
    name: "Populating Next Right Pointers in Each Node",
    difficulty: "Medium",
    pattern: "Trees",
    trigger: [
      "connect each node to its next right node at the same level",
      "perfect binary tree — use existing next pointers to link the next level"
    ],
    coreIdea: "Level by level using the already-connected previous level. For each connected node on level k, link its children on level k+1 using next pointers.",
    coreIdeaHinglish: "Pichle level ke next pointers use karo agle level ko connect karne ke liye. Har node ke children ko connect karo — same parent ke, phir across to next parent.",
    approach: [
      "leftmost = root",
      "While leftmost.left: curr = leftmost",
      "While curr: curr.left.next = curr.right; if curr.next: curr.right.next = curr.next.left; curr = curr.next",
      "leftmost = leftmost.left"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Perfect binary tree guarantee means every non-leaf has exactly two children",
      "Link across parents: curr.right.next = curr.next.left (uses next pointer of current level)",
      "O(1) space — don't use BFS queue; use the previously-connected level as a linked list"
    ],
    code: `leftmost = root
while leftmost and leftmost.left:
    curr = leftmost
    while curr:
        curr.left.next = curr.right
        if curr.next:
            curr.right.next = curr.next.left
        curr = curr.next
    leftmost = leftmost.left
return root`,
    variants: [
      "Populating Next Right Pointers II (LC 117) — non-perfect tree"
    ]
  },

  // ── Tries ────────────────────────────────────────────────────

  {
    id: 208,
    name: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    pattern: "Tries",
    trigger: [
      "prefix-based string operations: insert, search, startsWith",
      "need O(m) per operation where m = word length"
    ],
    coreIdea: "Each node has children[26] and an is_end flag. insert/search/startsWith walk the trie character by character, creating nodes as needed for insert.",
    coreIdeaHinglish: "Har node me 26 children aur ek is_end flag. Insert me nodes banao. Search aur startsWith me walk karo — is_end flag batata hai word pura hai ya sirf prefix.",
    approach: [
      "TrieNode: children = {}; is_end = False",
      "insert: for c in word: create node if missing; advance; mark is_end",
      "search: walk; return last node's is_end",
      "startsWith: walk; return True if walk completes"
    ],
    time: "O(m) per op",
    space: "O(n·m) total",
    pitfalls: [
      "search checks is_end at the END — a prefix is in the trie but isn't a complete word",
      "startsWith returns True as long as the walk doesn't hit a missing child",
      "Using dict for children (not array[26]) handles non-lowercase-alpha chars too"
    ],
    code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
class Trie:
    def __init__(self): self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True
    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end
    def startsWith(self, prefix):
        return self._walk(prefix) is not None
    def _walk(self, s):
        node = self.root
        for c in s:
            if c not in node.children: return None
            node = node.children[c]
        return node`,
    variants: [
      "Design Add and Search Words (LC 211)",
      "Word Search II (LC 212)"
    ]
  },

  {
    id: 211,
    name: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    pattern: "Tries",
    trigger: [
      "word dictionary with wildcard '.' matching any single character",
      "trie + DFS for wildcard expansion"
    ],
    coreIdea: "Trie for insert. Search uses DFS: for '.' try all 26 children; for a regular char, follow normally. Backtrack on dead ends.",
    coreIdeaHinglish: "Insert normal trie. Search me DFS — '.' mila? Sabhi 26 children try karo. Normal char? Wahi path follow karo. Dead end? Backtrack.",
    approach: [
      "addWord: standard trie insert",
      "search: DFS(node, i): if i==len(word): return node.is_end",
      "If word[i]=='.': try all children; else: follow word[i] if exists"
    ],
    time: "O(m) best, O(26^m) worst with many wildcards",
    space: "O(n·m)",
    pitfalls: [
      "DFS must backtrack — don't return True on first '.' branch unless it actually succeeds",
      "word[i]=='.' expands to ALL existing children (not all 26 — skip missing ones)",
      "is_end check at end of word, not at the '.' itself"
    ],
    code: `class WordDictionary:
    def __init__(self):
        self.root = TrieNode()
    def addWord(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True
    def search(self, word):
        def dfs(node, i):
            if i == len(word): return node.is_end
            c = word[i]
            if c == '.':
                return any(dfs(child, i+1) for child in node.children.values())
            if c not in node.children: return False
            return dfs(node.children[c], i + 1)
        return dfs(self.root, 0)`,
    variants: [
      "Implement Trie (LC 208)",
      "Word Search II (LC 212)"
    ]
  },

  {
    id: 212,
    name: "Word Search II",
    difficulty: "Hard",
    pattern: "Tries",
    trigger: [
      "find all words from a list that exist in a 2D board (connected cells)",
      "trie + backtracking DFS — prune dead branches early"
    ],
    coreIdea: "Build a trie from words. DFS the board, traversing the trie simultaneously. When a board path reaches a trie word end, record it. Prune: if no trie child for current cell, stop.",
    coreIdeaHinglish: "Saare words ek trie me daal do. Board pe DFS karo aur trie me simultaneously chalo. Trie me path nahi? Prune karo. is_end mila? Word found.",
    approach: [
      "Build trie from words",
      "DFS(r, c, node): if is_end: add to result",
      "Mark cell visited (board[r][c]='#'); explore 4 dirs if child in trie; restore"
    ],
    time: "O(M·N·4·3^(L-1)) where L = word length",
    space: "O(total word chars)",
    pitfalls: [
      "Remove found words from trie to avoid duplicates (set node.word=None after adding to result)",
      "Mark visited cells in-place with '#' — restore after DFS returns",
      "Prune leaf trie nodes (no children, no end) during DFS to speed up future searches"
    ],
    code: `def findWords(board, words):
    root = TrieNode()
    for w in words:
        node = root
        for c in w:
            if c not in node.children: node.children[c] = TrieNode()
            node = node.children[c]
        node.word = w
    res = []
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node.children: return
        nxt = node.children[ch]
        if nxt.word: res.append(nxt.word); nxt.word = None
        board[r][c] = '#'
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<len(board) and 0<=nc<len(board[0]) and board[nr][nc]!='#':
                dfs(nr, nc, nxt)
        board[r][c] = ch
    for r in range(len(board)):
        for c in range(len(board[0])): dfs(r, c, root)
    return res`,
    variants: [
      "Word Search (LC 79)",
      "Design Add and Search Words (LC 211)"
    ]
  },

  // ── Heap / Priority Queue ────────────────────────────────────

  {
    id: 973,
    name: "K Closest Points to Origin",
    difficulty: "Medium",
    pattern: "Heap / Priority Queue",
    trigger: [
      "k closest points by Euclidean distance",
      "maintain a top-k set without full sort"
    ],
    coreIdea: "Max-heap of size k. For each point push (-dist², x, y). If heap grows beyond k, pop the farthest. Remaining heap is the k closest.",
    coreIdeaHinglish: "Size k ka max-heap banao (distance negate karo). Har point push karo. K se bada hua? Farthest pop karo. Akhir me k closest bachte hain.",
    approach: [
      "For each (x, y): heappush(heap, (-x²-y², x, y))",
      "If len(heap) > k: heappop (removes farthest)",
      "Return [[x,y] for _,x,y in heap]"
    ],
    time: "O(n log k)",
    space: "O(k)",
    pitfalls: [
      "Python heapq is min-heap — negate distance² for max-heap semantics",
      "No need for sqrt — comparing distance² preserves ordering",
      "Alternative: heapq.nsmallest(k, points, key=lambda p: p[0]**2+p[1]**2)"
    ],
    code: `import heapq
heap = []
for x, y in points:
    heapq.heappush(heap, (-x*x - y*y, x, y))
    if len(heap) > k:
        heapq.heappop(heap)
return [[x, y] for _, x, y in heap]`,
    variants: [
      "Kth Largest Element in Array (LC 215)",
      "Top K Frequent Elements (LC 347)"
    ]
  },

  {
    id: 621,
    name: "Task Scheduler",
    difficulty: "Medium",
    pattern: "Heap / Priority Queue",
    trigger: [
      "minimum intervals to schedule tasks with cooldown n between same tasks",
      "greedy — most frequent task drives the schedule"
    ],
    coreIdea: "The most frequent task creates idle slots. Formula: (max_freq - 1) × (n + 1) + count_of_tasks_at_max_freq. If enough other tasks fill all idles, answer is just len(tasks).",
    coreIdeaHinglish: "Sabse frequent task kitni baar aata hai? Woh (n+1) ke blocks me fit hota hai. Baaki tasks idle slots me fill karo. Result = max(total tasks, formula).",
    approach: [
      "count = Counter(tasks)",
      "max_freq = max(count.values())",
      "max_count = number of tasks with frequency == max_freq",
      "return max(len(tasks), (max_freq-1)*(n+1) + max_count)"
    ],
    time: "O(n)",
    space: "O(1) — 26 distinct tasks max",
    pitfalls: [
      "Formula is (max_freq-1)*(n+1) + max_count — NOT (max_freq)*(n+1)",
      "If len(tasks) > formula, there are no idle slots — answer is len(tasks)",
      "No simulation needed for the basic version"
    ],
    code: `from collections import Counter
count = Counter(tasks)
max_freq = max(count.values())
max_count = sum(1 for v in count.values() if v == max_freq)
return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)`,
    variants: [
      "Rearrange String K Distance Apart (LC 358)"
    ]
  },

  {
    id: 215,
    name: "Kth Largest Element in an Array",
    difficulty: "Medium",
    pattern: "Heap / Priority Queue",
    trigger: [
      "kth largest element (not kth distinct largest)",
      "O(n log k) heap or O(n) QuickSelect"
    ],
    coreIdea: "Min-heap of size k. Push each element; if heap grows > k, pop the minimum. The heap's root is the kth largest.",
    coreIdeaHinglish: "Size k ka min-heap banao. Har element push karo. K se bada hua? Minimum pop karo. Akhir me heap ka top kth largest hai — kyunki k-1 bade elements bhi heap me hain.",
    approach: [
      "heap = []",
      "For n in nums: heappush(n); if len > k: heappop",
      "Return heap[0]"
    ],
    time: "O(n log k)",
    space: "O(k)",
    pitfalls: [
      "Min-heap of size k: root is the kth largest (k-1 larger elements sit above it)",
      "kth LARGEST, not kth smallest — don't negate",
      "QuickSelect gives O(n) avg but is interview-risky; heap is safer"
    ],
    code: `import heapq
heap = []
for n in nums:
    heapq.heappush(heap, n)
    if len(heap) > k:
        heapq.heappop(heap)
return heap[0]`,
    variants: [
      "K Closest Points to Origin (LC 973)",
      "Top K Frequent Elements (LC 347)"
    ]
  },

  {
    id: 355,
    name: "Design Twitter",
    difficulty: "Medium",
    pattern: "Heap / Priority Queue",
    trigger: [
      "social feed: post, follow/unfollow, get top 10 recent tweets from followees",
      "merge k sorted lists with a max-heap"
    ],
    coreIdea: "Store tweets as (timestamp, tweetId) lists per user. getNewsFeed: seed a max-heap with each followee's most recent tweet, then iteratively pop-and-push-next to merge.",
    coreIdeaHinglish: "Har user ke tweets list me rakho (latest last). getNewsFeed me sabhi followees ke latest tweet heap me dalo. Pop karo, us user ka next tweet push karo — top 10 lo.",
    approach: [
      "tweets = defaultdict(list); follows = defaultdict(set)",
      "postTweet: tweets[u].append((global_ts, tid))",
      "getNewsFeed: seed heap with latest tweet per followee; pop + push-next until 10 results"
    ],
    time: "O(f log f) per getNewsFeed (f = followees)",
    space: "O(T) total tweets",
    pitfalls: [
      "User follows themselves implicitly for their own feed",
      "Negate timestamp for max-heap (most recent first)",
      "After popping a tweet, push that user's previous tweet (index-1) if it exists"
    ],
    code: `import heapq
from collections import defaultdict
class Twitter:
    def __init__(self): self.ts=0; self.tw=defaultdict(list); self.fo=defaultdict(set)
    def postTweet(self, u, t): self.tw[u].append((self.ts, t)); self.ts+=1
    def getNewsFeed(self, u):
        heap, res = [], []
        self.fo[u].add(u)
        for f in self.fo[u]:
            if self.tw[f]:
                i = len(self.tw[f]) - 1
                ts, tid = self.tw[f][i]
                heapq.heappush(heap, (-ts, tid, f, i - 1))
        while heap and len(res) < 10:
            ts, tid, f, i = heapq.heappop(heap)
            res.append(tid)
            if i >= 0:
                ts2, tid2 = self.tw[f][i]
                heapq.heappush(heap, (-ts2, tid2, f, i - 1))
        return res
    def follow(self, u, f): self.fo[u].add(f)
    def unfollow(self, u, f): self.fo[u].discard(f)`,
    variants: [
      "Merge K Sorted Lists (LC 23)"
    ]
  },

  {
    id: 1834,
    name: "Single-Threaded CPU",
    difficulty: "Medium",
    pattern: "Heap / Priority Queue",
    trigger: [
      "simulate CPU: pick available task with smallest processing time",
      "greedy scheduling with time jumps when CPU is idle"
    ],
    coreIdea: "Sort tasks by enqueue time. Simulate current_time. When CPU is free, push all tasks with enqueue ≤ current_time to a min-heap (processing_time, original_idx). Pop the shortest. If heap is empty, jump to next task's enqueue time.",
    coreIdeaHinglish: "Enqueue time se sort karo. current_time simulate karo. Heap me available tasks rakho (processing time order). Heap empty? Time jump karo next task ke enqueue time pe.",
    approach: [
      "Sort tasks by enqueue time (keep original index)",
      "While unprocessed or heap non-empty: push all available; if empty: jump time",
      "Pop (proc_time, orig_idx); advance time; append to result"
    ],
    time: "O(n log n)",
    space: "O(n)",
    pitfalls: [
      "Jump time to tasks[i][1][0] when heap is empty — don't simulate idle ticks",
      "Heap key: (processing_time, original_index) — ties by original index",
      "Must preserve original index after sorting — use enumerate before sort"
    ],
    code: `import heapq
indexed = sorted(enumerate(tasks), key=lambda x: x[1][0])
heap, res, time, i = [], [], 0, 0
while heap or i < len(indexed):
    while i < len(indexed) and indexed[i][1][0] <= time:
        orig, (enq, proc) = indexed[i]
        heapq.heappush(heap, (proc, orig)); i += 1
    if not heap:
        time = indexed[i][1][0]; continue
    proc, orig = heapq.heappop(heap)
    time += proc; res.append(orig)
return res`,
    variants: [
      "Task Scheduler (LC 621)"
    ]
  },

  {
    id: 295,
    name: "Find Median from Data Stream",
    difficulty: "Hard",
    pattern: "Heap / Priority Queue",
    trigger: [
      "median of a growing stream in O(log n) add, O(1) find",
      "two heaps: max-heap (lower half) + min-heap (upper half)"
    ],
    coreIdea: "Maintain two heaps balanced in size (diff ≤ 1): max-heap for the lower half, min-heap for the upper half. Median is the top of the larger heap, or average of both tops.",
    coreIdeaHinglish: "Do heaps: max-heap left half ke liye, min-heap right half ke liye. Sizes balance rakho — diff max 1. Median = bade heap ka top, ya dono tops ka average.",
    approach: [
      "addNum: push to max-heap (small); rebalance cross-heap invariant; balance sizes",
      "findMedian: if equal size: average of tops; else: top of larger heap"
    ],
    time: "O(log n) add, O(1) find",
    space: "O(n)",
    pitfalls: [
      "Python has only min-heap — negate values in small (max-heap)",
      "After each add, check max of small ≤ min of large; if violated, transfer one element",
      "Balance sizes: if |small| > |large|+1 or vice versa, move top between heaps"
    ],
    code: `import heapq
class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negated)
        self.large = []  # min-heap
    def addNum(self, num):
        heapq.heappush(self.small, -num)
        if self.small and self.large and (-self.small[0] > self.large[0]):
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def findMedian(self):
        if len(self.small) > len(self.large): return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`,
    variants: [
      "Sliding Window Median (LC 480)"
    ]
  },

  // ── Backtracking ─────────────────────────────────────────────

  {
    id: 78,
    name: "Subsets",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all subsets of distinct integers (power set)",
      "every prefix of every recursive path is a valid subset"
    ],
    coreIdea: "Backtrack: at each call, record the current subset. Then try each remaining element as the next inclusion. O(2^n) subsets, each O(n) to copy.",
    coreIdeaHinglish: "Backtrack karo. Har call ke shuru me current subset result me add karo. Phir baaki elements me se ek ek choose karo aur recurse karo.",
    approach: [
      "bt(i, curr): res.append(curr[:])",
      "For j in range(i, n): curr.append(nums[j]); bt(j+1, curr); curr.pop()"
    ],
    time: "O(2ⁿ · n)",
    space: "O(n) stack",
    pitfalls: [
      "Append curr[:] (a copy) — not curr itself (the reference changes on pop)",
      "Append at the START of each call — not just at the leaf",
      "Iterative: for each element, double the result by adding element to every existing subset"
    ],
    code: `res = []
def bt(i, curr):
    res.append(curr[:])
    for j in range(i, len(nums)):
        curr.append(nums[j])
        bt(j + 1, curr)
        curr.pop()
bt(0, [])
return res`,
    variants: [
      "Subsets II (LC 90) — with duplicates",
      "Combination Sum (LC 39)"
    ]
  },

  {
    id: 39,
    name: "Combination Sum",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all combinations summing to target, elements REUSABLE"
    ],
    coreIdea: "Backtrack but recurse with i (NOT i+1) to allow reuse. Sort first to enable early break when running sum exceeds target.",
    coreIdeaHinglish: "Same number bar bar use ho sakta hai, isliye recursion me i hi pass karo (i+1 nahi). Sort karke total > target hote hi break — fast.",
    approach: [
      "Sort candidates",
      "bt(start, curr, total): if total == target: append, return",
      "For i in [start, n): if total + cand[i] > target: break; add, bt(i, ...), pop"
    ],
    time: "O(N^(T/M))",
    space: "O(T/M)",
    pitfalls: [
      "Recurse with i (not i+1) — that's the reuse mechanic",
      "Sorting enables the early break when sum exceeds target",
      "Append curr[:] not curr — mutable list will be modified on backtrack"
    ],
    code: `res = []
candidates.sort()
def bt(start, curr, total):
    if total == target:
        res.append(curr[:]); return
    for i in range(start, len(candidates)):
        if total + candidates[i] > target: break
        curr.append(candidates[i])
        bt(i, curr, total + candidates[i])
        curr.pop()
bt(0, [], 0)
return res`,
    variants: [
      "Combination Sum II (LC 40)",
      "Combination Sum III (LC 216)"
    ]
  },

  {
    id: 79,
    name: "Word Search",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "find if word exists as a connected path of adjacent cells in a 2D grid"
    ],
    coreIdea: "DFS from each cell. At each step, match board[r][c] with word[i]. Mark the cell visited by overwriting with '#'. Restore after DFS (backtrack).",
    coreIdeaHinglish: "Har cell se DFS shuru karo. board[r][c] == word[i]? Aage badho. Cell ko '#' se mark karo. DFS ke baad original char restore karo.",
    approach: [
      "For each (r,c): try dfs(r, c, 0)",
      "dfs: if i==len(word): return True; bounds+visited+char check",
      "board[r][c]='#'; recurse 4 dirs; board[r][c]=word[i]; return res"
    ],
    time: "O(M·N·4·3^(L-1))",
    space: "O(L) recursion",
    pitfalls: [
      "Mark BEFORE recursing, restore AFTER — prevents revisiting the same cell on one path",
      "Check char match BEFORE marking — fail fast",
      "Return early on first True — don't exhaustively search all paths"
    ],
    code: `def dfs(r, c, i):
    if i == len(word): return True
    if r < 0 or r >= len(board) or c < 0 or c >= len(board[0]): return False
    if board[r][c] != word[i]: return False
    board[r][c] = '#'
    found = any(dfs(r+dr, c+dc, i+1) for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)])
    board[r][c] = word[i]
    return found
for r in range(len(board)):
    for c in range(len(board[0])):
        if dfs(r, c, 0): return True
return False`,
    variants: [
      "Word Search II (LC 212) — trie + DFS"
    ]
  },

  {
    id: 90,
    name: "Subsets II",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all unique subsets when input may have duplicates"
    ],
    coreIdea: "Sort first. Same backtracking as LC 78, but skip duplicate elements at the same recursion depth: if j > i and nums[j] == nums[j-1], skip.",
    coreIdeaHinglish: "Sort karo. LC 78 jaisa backtrack, par same depth pe agar nums[j] == nums[j-1] aur j > i, skip karo — duplicate subsets avoid hoti hain.",
    approach: [
      "Sort nums",
      "bt(i, curr): append curr[:]",
      "For j in range(i, n): if j > i and nums[j]==nums[j-1]: continue; add/recurse/pop"
    ],
    time: "O(2ⁿ · n)",
    space: "O(n)",
    pitfalls: [
      "Skip condition: j > i (not j > 0) — only skip AT THE SAME recursion level",
      "Duplicates at different levels form different subsets and are fine",
      "Sorting is mandatory — the skip check relies on equal elements being adjacent"
    ],
    code: `nums.sort()
res = []
def bt(i, curr):
    res.append(curr[:])
    for j in range(i, len(nums)):
        if j > i and nums[j] == nums[j - 1]: continue
        curr.append(nums[j])
        bt(j + 1, curr)
        curr.pop()
bt(0, [])
return res`,
    variants: [
      "Subsets (LC 78)",
      "Combination Sum II (LC 40)"
    ]
  },

  {
    id: 40,
    name: "Combination Sum II",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all unique combinations summing to target; each element used at most once"
    ],
    coreIdea: "Sort. Backtrack with i+1 (no reuse). Skip duplicates at the same depth (j > start and candidates[j] == candidates[j-1]).",
    coreIdeaHinglish: "Sort karo. i+1 pass karo — no reuse. Same depth pe duplicates skip karo. LC 39 aur LC 90 ka fusion.",
    approach: [
      "Sort candidates",
      "bt(start, curr, total): if total==target: append",
      "For i from start: if i>start and cand[i]==cand[i-1]: skip; if over: break; add/bt(i+1)/pop"
    ],
    time: "O(2ⁿ · n)",
    space: "O(n)",
    pitfalls: [
      "i+1 in recursion (no reuse) — unlike LC 39 which passes i",
      "Skip condition i > start, not i > 0 (same-level dedup only)",
      "Sort + break when total+cand[i] > target for pruning"
    ],
    code: `candidates.sort()
res = []
def bt(start, curr, total):
    if total == target: res.append(curr[:]); return
    for i in range(start, len(candidates)):
        if i > start and candidates[i] == candidates[i - 1]: continue
        if total + candidates[i] > target: break
        curr.append(candidates[i])
        bt(i + 1, curr, total + candidates[i])
        curr.pop()
bt(0, [], 0)
return res`,
    variants: [
      "Combination Sum (LC 39) — reusable elements",
      "Subsets II (LC 90)"
    ]
  },

  {
    id: 46,
    name: "Permutations",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all permutations of distinct integers",
      "every element can go in every position"
    ],
    coreIdea: "Backtrack with a used set. At each step, pick any unused element, add it, recurse for the next position, then remove it.",
    coreIdeaHinglish: "Used set rakho. Har position pe koi bhi unused element pick karo, mark karo, recurse karo, unmark karo. Jab sab use ho jaayein, permutation complete.",
    approach: [
      "bt(curr): if len==n: append curr[:]",
      "For n in nums: if n in used: skip; used.add(n); curr.append(n); bt; remove"
    ],
    time: "O(n! · n)",
    space: "O(n)",
    pitfalls: [
      "Append curr[:] not curr — list is mutable",
      "used tracks values, not indices — fine for distinct elements",
      "Swap-in-place variant avoids the used set but is harder to reason about"
    ],
    code: `res, used = [], set()
def bt(curr):
    if len(curr) == len(nums):
        res.append(curr[:]); return
    for n in nums:
        if n not in used:
            used.add(n); curr.append(n)
            bt(curr)
            used.remove(n); curr.pop()
bt([])
return res`,
    variants: [
      "Permutations II (LC 47) — with duplicates",
      "Next Permutation (LC 31)"
    ]
  },

  {
    id: 47,
    name: "Permutations II",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all unique permutations when input may have duplicates",
      "sort + skip: don't use a duplicate before its earlier copy"
    ],
    coreIdea: "Sort. Use a used[] boolean array. Skip element i if: (1) used[i] is True, OR (2) nums[i]==nums[i-1] AND NOT used[i-1]. Rule 2 ensures duplicates always appear in their original relative order.",
    coreIdeaHinglish: "Sort karo. Used array rakho. Agar nums[i]==nums[i-1] aur nums[i-1] abhi used nahi, skip karo — yeh trick same value ke elements ko ek fixed order me rakhti hai, duplicate perms rokti hai.",
    approach: [
      "Sort; used = [False]*n",
      "bt(curr): if full: append",
      "For i: if used[i]: skip; if i>0 and nums[i]==nums[i-1] and not used[i-1]: skip; use/recurse/unuse"
    ],
    time: "O(n! · n)",
    space: "O(n)",
    pitfalls: [
      "The dedup condition is 'not used[i-1]' — ensures later duplicate is NEVER chosen before earlier one",
      "Sort is mandatory for this condition to work",
      "Used tracks by INDEX (not value) — needed since values can repeat"
    ],
    code: `nums.sort()
res, used = [], [False] * len(nums)
def bt(curr):
    if len(curr) == len(nums): res.append(curr[:]); return
    for i in range(len(nums)):
        if used[i]: continue
        if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue
        used[i] = True; curr.append(nums[i])
        bt(curr)
        used[i] = False; curr.pop()
bt([])
return res`,
    variants: [
      "Permutations (LC 46) — distinct elements",
      "Combination Sum II (LC 40)"
    ]
  },

  {
    id: 131,
    name: "Palindrome Partitioning",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all ways to partition string s into palindromic substrings"
    ],
    coreIdea: "Backtrack with a start index. For each end position, if s[start:end] is a palindrome, add it to the current partition and recurse from end. When start reaches the end of s, record the partition.",
    coreIdeaHinglish: "start se backtrack karo. Har end position pe check karo: s[start:end] palindrome hai? Hai to add karo aur recurse. start == n? Partition complete.",
    approach: [
      "bt(start, curr): if start==n: append curr[:]",
      "For end in range(start+1, n+1): if is_pal(s[start:end]): curr.append; bt(end); curr.pop"
    ],
    time: "O(n · 2ⁿ)",
    space: "O(n)",
    pitfalls: [
      "Check palindrome BEFORE recursing — don't backtrack into non-palindrome partitions",
      "s[start:end] not s[start:end+1] — Python slicing is exclusive at end",
      "Precompute a palindrome DP table for O(1) checks if optimizing"
    ],
    code: `res = []
def is_pal(s): return s == s[::-1]
def bt(start, curr):
    if start == len(s): res.append(curr[:]); return
    for end in range(start + 1, len(s) + 1):
        sub = s[start:end]
        if is_pal(sub):
            curr.append(sub)
            bt(end, curr)
            curr.pop()
bt(0, [])
return res`,
    variants: [
      "Palindrome Partitioning II (LC 132) — min cuts"
    ]
  },

  {
    id: 17,
    name: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    pattern: "Backtracking",
    trigger: [
      "all letter combinations from phone keypad digits"
    ],
    coreIdea: "Backtrack digit by digit. At position i, try each letter mapped to digits[i], then recurse to i+1. When all digits are consumed, record the combination.",
    coreIdeaHinglish: "Digit ke saare letters try karo. Har letter ke baad next digit ke liye recurse karo. Jab sab digits use ho jaayein, combination complete.",
    approach: [
      "phone = {'2':'abc', ..., '9':'wxyz'}",
      "bt(i, curr): if i==len(digits): append curr",
      "For c in phone[digits[i]]: bt(i+1, curr+c)"
    ],
    time: "O(4ⁿ · n) where n = len(digits)",
    space: "O(n)",
    pitfalls: [
      "Return [] for empty input before building the phone map",
      "7 → 'pqrs' and 9 → 'wxyz' have 4 letters each — don't forget",
      "String concatenation (curr + c) avoids needing a separate pop step"
    ],
    code: `if not digits: return []
phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
         '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
res = []
def bt(i, curr):
    if i == len(digits): res.append(curr); return
    for c in phone[digits[i]]:
        bt(i + 1, curr + c)
bt(0, "")
return res`,
    variants: [
      "Generate Parentheses (LC 22)",
      "Combination Sum (LC 39)"
    ]
  },

  // ── Graphs ───────────────────────────────────────────────────

  {
    id: 200,
    name: "Number of Islands",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "count connected components of '1's in a grid"
    ],
    coreIdea: "DFS/BFS from each unvisited '1'. Mark all reachable '1's as visited (overwrite with '0'). Count how many times you start a DFS.",
    coreIdeaHinglish: "Har unvisited '1' se DFS shuru karo. Saare reachable '1' ko '0' se mark karo. Kitni baar DFS start hua, utne islands.",
    approach: [
      "For each (r,c) where grid[r][c]=='1': count++; dfs(r,c)",
      "dfs: grid[r][c]='0'; recurse all 4 neighbors in bounds with value '1'"
    ],
    time: "O(M·N)",
    space: "O(M·N) recursion",
    pitfalls: [
      "Mark '0' BEFORE recursing — prevents infinite loops on cycles (there are none in a grid, but marks avoid revisiting)",
      "Bounds check before value check in DFS",
      "BFS alternative: use a queue, same marking"
    ],
    code: `def dfs(r, c):
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]): return
    if grid[r][c] != '1': return
    grid[r][c] = '0'
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
count = 0
for r in range(len(grid)):
    for c in range(len(grid[0])):
        if grid[r][c] == '1':
            count += 1; dfs(r, c)
return count`,
    variants: [
      "Max Area of Island (LC 695)",
      "Number of Connected Components (LC 323)"
    ]
  },

  {
    id: 133,
    name: "Clone Graph",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "deep copy an undirected graph with cycles"
    ],
    coreIdea: "DFS/BFS with a visited HashMap: original_node → clone_node. Before cloning neighbors, check if they're already in the map to handle cycles.",
    coreIdeaHinglish: "HashMap banao: original → clone. DFS/BFS karo. Neighbor already map me hai? Wahi use karo (cycles handle hote hain). Nahi hai? New node banao.",
    approach: [
      "cloned = {}",
      "dfs(node): if node in cloned: return cloned[node]",
      "cloned[node] = Node(node.val)",
      "cloned[node].neighbors = [dfs(n) for n in node.neighbors]"
    ],
    time: "O(V+E)",
    space: "O(V)",
    pitfalls: [
      "Create the clone BEFORE recursing into neighbors — otherwise cycles cause infinite recursion",
      "Return cloned[node] immediately if already visited",
      "Handle null input (empty graph)"
    ],
    code: `cloned = {}
def dfs(node):
    if not node: return None
    if node in cloned: return cloned[node]
    cloned[node] = Node(node.val)
    cloned[node].neighbors = [dfs(n) for n in node.neighbors]
    return cloned[node]
return dfs(node)`,
    variants: [
      "Copy List with Random Pointer (LC 138)"
    ]
  },

  {
    id: 207,
    name: "Course Schedule",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "detect cycle in a directed graph (can all courses be finished?)",
      "topological sort feasibility"
    ],
    coreIdea: "DFS cycle detection with 3 states per node: unvisited (0), in-progress (1), done (2). If DFS reaches a node in state 1 → cycle exists.",
    coreIdeaHinglish: "Har node ke teen states: unvisited, in-progress, done. DFS karo. Agar in-progress node dobara mile, cycle hai. Cycle nahi? Courses possible.",
    approach: [
      "Build adjacency list; state = [0]*numCourses",
      "dfs(node): if state==1: return False (cycle); if state==2: return True",
      "state=1; recurse neighbors; state=2; return True"
    ],
    time: "O(V+E)",
    space: "O(V+E)",
    pitfalls: [
      "Three states (not two) — 'done' state lets you skip already-verified nodes",
      "Call DFS for every node (graph may be disconnected)",
      "Kahn's BFS (in-degree reduction) is the alternative"
    ],
    code: `from collections import defaultdict
adj = defaultdict(list)
for a, b in prerequisites: adj[b].append(a)
state = [0] * numCourses
def dfs(node):
    if state[node] == 1: return False  # cycle
    if state[node] == 2: return True
    state[node] = 1
    for nei in adj[node]:
        if not dfs(nei): return False
    state[node] = 2
    return True
return all(dfs(i) for i in range(numCourses))`,
    variants: [
      "Course Schedule II (LC 210) — return order",
      "Alien Dictionary (LC 269)"
    ]
  },

  {
    id: 210,
    name: "Course Schedule II",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "topological sort order of courses",
      "return one valid ordering or [] if cycle"
    ],
    coreIdea: "DFS post-order topological sort. After all neighbors of a node are processed (state=2), append it to the result. Reverse at the end for topological order.",
    coreIdeaHinglish: "DFS post-order: saare neighbors process ho jaayein, tab node ko result me add karo. Reverse karo akhir me — yeh topological order hai.",
    approach: [
      "Same 3-state DFS as LC 207",
      "When marking state=2: result.append(node)",
      "If cycle detected: return []",
      "Return result reversed"
    ],
    time: "O(V+E)",
    space: "O(V+E)",
    pitfalls: [
      "Post-order append (AFTER recursing all neighbors) gives reverse topological order",
      "Must reverse the result at the end",
      "Kahn's BFS: use in-degree array and queue — appends in forward topo order directly"
    ],
    code: `from collections import defaultdict
adj = defaultdict(list)
for a, b in prerequisites: adj[b].append(a)
state, res = [0]*numCourses, []
def dfs(node):
    if state[node] == 1: return False
    if state[node] == 2: return True
    state[node] = 1
    for nei in adj[node]:
        if not dfs(nei): return False
    state[node] = 2; res.append(node)
    return True
if not all(dfs(i) for i in range(numCourses)): return []
return res[::-1]`,
    variants: [
      "Course Schedule (LC 207)",
      "Alien Dictionary (LC 269)"
    ]
  },

  {
    id: 695,
    name: "Max Area of Island",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "maximum area of a connected island of 1s in a grid"
    ],
    coreIdea: "DFS from each unvisited 1. DFS returns the area of that island (count of connected cells). Track the maximum across all islands.",
    coreIdeaHinglish: "Har unvisited 1 se DFS karo. DFS us island ka area return kare. Maximum track karo.",
    approach: [
      "For each (r,c)==1: ans = max(ans, dfs(r,c))",
      "dfs: if out-of-bounds or not 1: return 0; grid[r][c]=0; return 1 + dfs(4 dirs)"
    ],
    time: "O(M·N)",
    space: "O(M·N) recursion",
    pitfalls: [
      "Mark 0 BEFORE recursing to avoid revisiting",
      "DFS returns area (1 + sum of neighbor areas) — not just True/False",
      "Same as LC 200 but return area instead of just counting starts"
    ],
    code: `def dfs(r, c):
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]): return 0
    if grid[r][c] != 1: return 0
    grid[r][c] = 0
    return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)
ans = 0
for r in range(len(grid)):
    for c in range(len(grid[0])):
        if grid[r][c] == 1:
            ans = max(ans, dfs(r, c))
return ans`,
    variants: [
      "Number of Islands (LC 200)",
      "Making a Large Island (LC 827)"
    ]
  },

  {
    id: 417,
    name: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "cells from which water can flow to both Pacific and Atlantic",
      "reverse BFS from ocean borders"
    ],
    coreIdea: "BFS/DFS BACKWARDS from ocean borders. Pacific reachable = cells that can drain to top/left borders. Atlantic reachable = cells that drain to bottom/right. Intersection is the answer.",
    coreIdeaHinglish: "Ulta sochlo. Ocean ke border se backward BFS karo — height >= current pe ja sakte hain (backwards flow). Pacific aur Atlantic dono se reachable cells ka intersection answer hai.",
    approach: [
      "BFS from all Pacific border cells (flow backwards: move to equal or higher cells)",
      "BFS from all Atlantic border cells",
      "Return cells in both visited sets"
    ],
    time: "O(M·N)",
    space: "O(M·N)",
    pitfalls: [
      "Reverse the flow direction — from border inward, move to cells with height >= current",
      "Two separate BFS runs (not one combined)",
      "Initialize Pacific queue with top row + left col; Atlantic with bottom row + right col"
    ],
    code: `from collections import deque
rows, cols = len(heights), len(heights[0])
def bfs(starts):
    q = deque(starts); visited = set(starts)
    while q:
        r, c = q.popleft()
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and (nr,nc) not in visited and heights[nr][nc]>=heights[r][c]:
                visited.add((nr,nc)); q.append((nr,nc))
    return visited
pac = bfs([(0,c) for c in range(cols)] + [(r,0) for r in range(rows)])
atl = bfs([(rows-1,c) for c in range(cols)] + [(r,cols-1) for r in range(rows)])
return [[r,c] for r,c in pac & atl]`,
    variants: [
      "Walls and Gates (LC 286)",
      "Surrounded Regions (LC 130)"
    ]
  },

  {
    id: 130,
    name: "Surrounded Regions",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "flip all 'O's NOT connected to the border to 'X'",
      "reverse thinking: find border-connected 'O's first"
    ],
    coreIdea: "DFS/BFS from every 'O' on the border. Mark those as 'S' (safe). Then scan the whole board: 'S' → 'O' (keep); 'O' → 'X' (flip); 'X' stays 'X'.",
    coreIdeaHinglish: "Border ke saare 'O' se DFS karo, unhe aur unke connected 'O' ko 'S' mark karo. Phir pure board me: 'S' ko 'O' banao, 'O' ko 'X'.",
    approach: [
      "DFS from every 'O' on the 4 borders; mark connected 'O' as 'S'",
      "Second pass: 'O'→'X', 'S'→'O', 'X'→'X'"
    ],
    time: "O(M·N)",
    space: "O(M·N) recursion",
    pitfalls: [
      "Don't flip border 'O's directly — mark them and restore after",
      "Only border cells initiate the DFS — not interior cells",
      "Four borders: top row, bottom row, left col, right col"
    ],
    code: `rows, cols = len(board), len(board[0])
def dfs(r, c):
    if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != 'O': return
    board[r][c] = 'S'
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
for r in range(rows):
    for c in range(cols):
        if (r in (0, rows-1) or c in (0, cols-1)) and board[r][c]=='O':
            dfs(r, c)
for r in range(rows):
    for c in range(cols):
        if board[r][c]=='O': board[r][c]='X'
        elif board[r][c]=='S': board[r][c]='O'`,
    variants: [
      "Number of Islands (LC 200)",
      "Pacific Atlantic Water Flow (LC 417)"
    ]
  },

  {
    id: 994,
    name: "Rotting Oranges",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "multi-source BFS spreading corruption level by level",
      "minimum time for all reachable cells to rot"
    ],
    coreIdea: "Multi-source BFS from all initially rotten oranges simultaneously. Each BFS level = 1 minute. After BFS, if any fresh orange remains, return -1.",
    coreIdeaHinglish: "Sab rotten oranges ek saath BFS queue me daal do. Har BFS level = 1 minute. BFS ke baad koi fresh bacha? Return -1.",
    approach: [
      "Count fresh; init queue with all rotten cells",
      "BFS: for each level (minute): spread rot to adjacent fresh; fresh--; time++",
      "Return time if fresh==0 else -1"
    ],
    time: "O(M·N)",
    space: "O(M·N)",
    pitfalls: [
      "Start ALL rotten oranges in queue simultaneously — not one at a time",
      "Count time by BFS levels (not individual pops) — track level size",
      "If no fresh oranges initially, return 0 immediately"
    ],
    code: `from collections import deque
rows, cols = len(grid), len(grid[0])
queue, fresh = deque(), 0
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == 2: queue.append((r,c))
        elif grid[r][c] == 1: fresh += 1
time = 0
while queue and fresh:
    for _ in range(len(queue)):
        r, c = queue.popleft()
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==1:
                grid[nr][nc]=2; fresh-=1; queue.append((nr,nc))
    time += 1
return time if fresh == 0 else -1`,
    variants: [
      "Walls and Gates (LC 286)",
      "Number of Islands (LC 200)"
    ]
  },

  {
    id: 286,
    name: "Walls and Gates",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "fill each empty room with distance to nearest gate",
      "multi-source BFS from all gates simultaneously"
    ],
    coreIdea: "Multi-source BFS starting from all gates (value 0) simultaneously. The BFS naturally fills each reachable room with the minimum distance.",
    coreIdeaHinglish: "Saare gates (0) ek saath BFS queue me daal do. BFS khud hi har room ko minimum distance se fill kar deta hai — closer gates naturally win.",
    approach: [
      "Queue all gate positions (rooms[r][c]==0)",
      "BFS: for each cell, spread to adjacent INF cells with dist+1"
    ],
    time: "O(M·N)",
    space: "O(M·N)",
    pitfalls: [
      "Multi-source BFS (all gates simultaneously) — NOT running BFS from each gate separately",
      "Only update INF cells (value == 2^31 - 1) — walls are -1",
      "This is identical in structure to LC 994 Rotting Oranges"
    ],
    code: `from collections import deque
INF = 2**31 - 1
rows, cols = len(rooms), len(rooms[0])
queue = deque()
for r in range(rows):
    for c in range(cols):
        if rooms[r][c] == 0: queue.append((r, c))
while queue:
    r, c = queue.popleft()
    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
        nr, nc = r+dr, c+dc
        if 0<=nr<rows and 0<=nc<cols and rooms[nr][nc]==INF:
            rooms[nr][nc] = rooms[r][c] + 1
            queue.append((nr, nc))`,
    variants: [
      "Rotting Oranges (LC 994)",
      "01 Matrix (LC 542)"
    ]
  },

  {
    id: 684,
    name: "Redundant Connection",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "find the edge that creates a cycle in an undirected graph (return the last one)",
      "Union-Find"
    ],
    coreIdea: "Union-Find. Process edges in order. For each edge (u, v): if find(u) == find(v), they're already connected — this edge is redundant. Otherwise union them.",
    coreIdeaHinglish: "Union-Find se edges process karo. Har edge (u,v) ke liye: find(u) == find(v)? Woh already connected hain — yeh edge redundant hai. Warna union karo.",
    approach: [
      "parent = list(range(n+1))",
      "find(x): path compression",
      "union(x, y): if find(x)==find(y): return False (cycle found); else merge"
    ],
    time: "O(n·α(n)) ≈ O(n)",
    space: "O(n)",
    pitfalls: [
      "Use 1-indexed parent array (nodes are 1 to n)",
      "Path compression in find: parent[x] = find(parent[x])",
      "Return the FIRST edge that creates a cycle — process in given order"
    ],
    code: `parent = list(range(len(edges) + 1))
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]  # path compression
        x = parent[x]
    return x
def union(x, y):
    px, py = find(x), find(y)
    if px == py: return False
    parent[px] = py; return True
for u, v in edges:
    if not union(u, v): return [u, v]`,
    variants: [
      "Graph Valid Tree (LC 261)",
      "Number of Connected Components (LC 323)"
    ]
  },

  {
    id: 261,
    name: "Graph Valid Tree",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "check if n nodes and given edges form a valid tree",
      "valid tree: connected + no cycles (exactly n-1 edges)"
    ],
    coreIdea: "A valid tree has exactly n-1 edges AND is connected. Check: (1) if len(edges) != n-1, return False. (2) Union-Find — if any edge creates a cycle, return False. All nodes connected? True.",
    coreIdeaHinglish: "Valid tree = n-1 edges AND connected. Pehle edge count check karo. Phir Union-Find se cycle check karo. Sab nodes connected hain? Valid tree.",
    approach: [
      "If len(edges) != n-1: return False",
      "Union-Find: for each edge, if already same component → cycle → False",
      "Return True if all edges processed without cycle"
    ],
    time: "O(n·α(n))",
    space: "O(n)",
    pitfalls: [
      "n-1 edges check filters most invalid cases upfront",
      "With exactly n-1 edges and no cycles, connectivity is guaranteed",
      "Don't forget to check 0-indexed vs 1-indexed nodes"
    ],
    code: `if len(edges) != n - 1: return False
parent = list(range(n))
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]; x = parent[x]
    return x
for u, v in edges:
    pu, pv = find(u), find(v)
    if pu == pv: return False
    parent[pu] = pv
return True`,
    variants: [
      "Redundant Connection (LC 684)",
      "Number of Connected Components (LC 323)"
    ]
  },

  {
    id: 323,
    name: "Number of Connected Components in an Undirected Graph",
    difficulty: "Medium",
    pattern: "Graphs",
    trigger: [
      "count connected components in a graph",
      "Union-Find or DFS"
    ],
    coreIdea: "Union-Find. Start with n components. For each edge (u, v): if different components, union them and decrement count. Return final count.",
    coreIdeaHinglish: "n components se shuru karo. Har edge pe union karo — alag components the? Count ghatao. Ya DFS: har unvisited node se DFS, count++.",
    approach: [
      "parent = list(range(n)), count = n",
      "For each edge: if find(u) != find(v): union, count--",
      "Return count"
    ],
    time: "O((n+e)·α(n))",
    space: "O(n)",
    pitfalls: [
      "Start count at n — each node is its own component initially",
      "Decrement only when two DIFFERENT components merge",
      "DFS alternative: visited set, DFS from each unvisited node"
    ],
    code: `parent, rank = list(range(n)), [1] * n
count = n
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]; x = parent[x]
    return x
def union(x, y):
    global count
    px, py = find(x), find(y)
    if px == py: return
    if rank[px] < rank[py]: px, py = py, px
    parent[py] = px
    if rank[px] == rank[py]: rank[px] += 1
    count -= 1
for u, v in edges: union(u, v)
return count`,
    variants: [
      "Graph Valid Tree (LC 261)",
      "Redundant Connection (LC 684)"
    ]
  },

  // ── Advanced Graphs ──────────────────────────────────────────

  {
    id: 743,
    name: "Network Delay Time",
    difficulty: "Medium",
    pattern: "Advanced Graphs",
    trigger: [
      "shortest time for signal to reach all nodes from source",
      "Dijkstra's single-source shortest path"
    ],
    coreIdea: "Dijkstra from source k. Min-heap of (time, node). Relax edges greedily. Answer is the max shortest path across all nodes — if any node is unreachable, return -1.",
    coreIdeaHinglish: "Dijkstra karo source k se. Min-heap me (time, node). Sabse kam time wala pehle process karo. Sabhi nodes ka shortest path ka max = answer. Koi unreachable? Return -1.",
    approach: [
      "Build adjacency list; dist = {k: 0}; heap = [(0, k)]",
      "While heap: t, node = heappop; if t > dist[node]: skip; relax neighbors",
      "Return max(dist.values()) if len(dist)==n else -1"
    ],
    time: "O((V+E) log V)",
    space: "O(V+E)",
    pitfalls: [
      "Skip stale heap entries: if t > dist[node]: continue",
      "Dijkstra only works with non-negative weights",
      "Answer is MAX of all shortest paths (slowest to reach all nodes)"
    ],
    code: `import heapq
from collections import defaultdict
adj = defaultdict(list)
for u, v, w in times: adj[u].append((v, w))
dist = {k: 0}
heap = [(0, k)]
while heap:
    t, node = heapq.heappop(heap)
    if t > dist.get(node, float('inf')): continue
    for nei, w in adj[node]:
        if t + w < dist.get(nei, float('inf')):
            dist[nei] = t + w
            heapq.heappush(heap, (t+w, nei))
return max(dist.values()) if len(dist) == n else -1`,
    variants: [
      "Cheapest Flights Within K Stops (LC 787)",
      "Path with Minimum Effort (LC 1631)"
    ]
  },

  {
    id: 332,
    name: "Reconstruct Itinerary",
    difficulty: "Hard",
    pattern: "Advanced Graphs",
    trigger: [
      "use all flight tickets exactly once; lexicographically smallest itinerary",
      "Eulerian path — Hierholzer's algorithm"
    ],
    coreIdea: "Sort neighbors lexicographically. DFS: always take the smallest available destination first. Append to result AFTER all edges from a node are used (post-order). Reverse at the end.",
    coreIdeaHinglish: "Neighbors ko sort karo. DFS: hamesha sabse chhota destination pehle. Node ke saare edges use ho jaayein, tab result me add karo (post-order). Reverse karo akhir me.",
    approach: [
      "adj = {src: sorted(dests) for each ticket}",
      "dfs(node): while adj[node]: dfs(adj[node].pop(0)); result.append(node)",
      "Return result reversed"
    ],
    time: "O(E log E) sorting",
    space: "O(V+E)",
    pitfalls: [
      "Post-order append — add node AFTER all its outgoing edges are exhausted",
      "Use a sorted list and pop from front (or sort reversed, pop from end for efficiency)",
      "Guaranteed to have a valid Eulerian path from 'JFK'"
    ],
    code: `from collections import defaultdict
adj = defaultdict(list)
for src, dst in tickets: adj[src].append(dst)
for src in adj: adj[src].sort(reverse=True)
res = []
def dfs(node):
    while adj[node]:
        dfs(adj[node].pop())
    res.append(node)
dfs("JFK")
return res[::-1]`,
    variants: [
      "Network Delay Time (LC 743)"
    ]
  },

  {
    id: 778,
    name: "Swim in Rising Water",
    difficulty: "Hard",
    pattern: "Advanced Graphs",
    trigger: [
      "minimum time to swim from (0,0) to (n-1,n-1) where you can move when water >= cell value",
      "Dijkstra or binary search + BFS"
    ],
    coreIdea: "Modified Dijkstra: min-heap of (max_elevation_on_path, r, c). For each neighbor, the cost is max(current_max, grid[nr][nc]). Find the path that minimizes the maximum cell value.",
    coreIdeaHinglish: "Dijkstra karo, par cost = max elevation path pe. Har step pe max(current_max, grid[nr][nc]) track karo. Bottom-right tak minimum max elevation = answer.",
    approach: [
      "heap = [(grid[0][0], 0, 0)]; visited = set()",
      "Pop (cost, r, c): if (n-1,n-1): return cost",
      "Push neighbors with max(cost, grid[nr][nc])"
    ],
    time: "O(n² log n)",
    space: "O(n²)",
    pitfalls: [
      "Cost is the MAX elevation on the path, not sum — modified Dijkstra",
      "Mark visited before pushing (or on pop) to avoid reprocessing",
      "Binary search + BFS is an alternative: binary search on answer, BFS to check feasibility"
    ],
    code: `import heapq
n = len(grid)
heap = [(grid[0][0], 0, 0)]
visited = set()
while heap:
    t, r, c = heapq.heappop(heap)
    if (r, c) in visited: continue
    visited.add((r, c))
    if r == n-1 and c == n-1: return t
    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
        nr, nc = r+dr, c+dc
        if 0<=nr<n and 0<=nc<n and (nr,nc) not in visited:
            heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))`,
    variants: [
      "Path with Minimum Effort (LC 1631)",
      "Network Delay Time (LC 743)"
    ]
  },

  {
    id: 269,
    name: "Alien Dictionary",
    difficulty: "Hard",
    pattern: "Advanced Graphs",
    trigger: [
      "derive character ordering from sorted alien word list",
      "topological sort on character dependency graph"
    ],
    coreIdea: "Compare adjacent words to extract ordering constraints (u comes before v). Build a directed graph and topological sort (Kahn's BFS). If cycle → return ''.",
    coreIdeaHinglish: "Adjacent words compare karo — pehla alag char batata hai order. Graph banao, topological sort karo. Cycle hai? Return empty string.",
    approach: [
      "Extract edges: for each adjacent word pair, find first differing char",
      "Kahn's BFS: in-degree, process 0-in-degree nodes",
      "If output length < unique chars: cycle exists"
    ],
    time: "O(C) where C = total chars in all words",
    space: "O(1) — 26 chars max",
    pitfalls: [
      "If word2 is a prefix of word1 and comes first → invalid (['abc','ab']) return ''",
      "Only compare adjacent words (not all pairs)",
      "All unique chars must appear in the output — check length for cycle detection"
    ],
    code: `from collections import defaultdict, deque
adj = defaultdict(set)
in_deg = {c: 0 for w in words for c in w}
for i in range(len(words)-1):
    w1, w2 = words[i], words[i+1]
    minl = min(len(w1), len(w2))
    if len(w1) > len(w2) and w1[:minl]==w2[:minl]: return ""
    for j in range(minl):
        if w1[j] != w2[j]:
            if w2[j] not in adj[w1[j]]:
                adj[w1[j]].add(w2[j]); in_deg[w2[j]] += 1
            break
q = deque([c for c in in_deg if in_deg[c]==0])
res = ""
while q:
    c = q.popleft(); res += c
    for nei in adj[c]:
        in_deg[nei] -= 1
        if in_deg[nei]==0: q.append(nei)
return res if len(res)==len(in_deg) else ""`,
    variants: [
      "Course Schedule II (LC 210)",
      "Sequence Reconstruction (LC 444)"
    ]
  },

  {
    id: 787,
    name: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    pattern: "Advanced Graphs",
    trigger: [
      "cheapest flight from src to dst with at most k stops",
      "Bellman-Ford for k relaxations (not Dijkstra — K-stop constraint)"
    ],
    coreIdea: "Bellman-Ford with exactly k+1 relaxations. After i relaxations, prices[v] = cheapest price using at most i edges. Use a copy of prices per round to avoid using edges from the same round.",
    coreIdeaHinglish: "Bellman-Ford k+1 rounds chalao. i-th round ke baad prices[v] = i edges me cheapest cost. Har round me copy use karo — same round ke edges avoid karne ke liye.",
    approach: [
      "prices = [inf]*n; prices[src]=0",
      "For _ in range(k+1): tmp = prices.copy(); for each edge (u,v,w): tmp[v] = min(tmp[v], prices[u]+w)",
      "prices = tmp; Return prices[dst] if != inf else -1"
    ],
    time: "O(K·E)",
    space: "O(n)",
    pitfalls: [
      "Use a COPY of prices at the start of each round — prevents using multiple edges from the same round",
      "k STOPS means k+1 edges — run k+1 rounds",
      "Dijkstra doesn't work here — the K constraint changes which path is optimal"
    ],
    code: `import math
prices = [math.inf] * n
prices[src] = 0
for _ in range(k + 1):
    tmp = prices[:]
    for u, v, w in flights:
        if prices[u] + w < tmp[v]:
            tmp[v] = prices[u] + w
    prices = tmp
return -1 if prices[dst] == math.inf else prices[dst]`,
    variants: [
      "Network Delay Time (LC 743) — Dijkstra (no K constraint)",
      "Path with Maximum Probability (LC 1514)"
    ]
  },

  // ── 1-D DP ───────────────────────────────────────────────────

  {
    id: 70,
    name: "Climbing Stairs",
    difficulty: "Easy",
    pattern: "1-D DP",
    trigger: [
      "count ways to reach step n taking 1 or 2 steps at a time",
      "Fibonacci pattern"
    ],
    coreIdea: "dp[i] = dp[i-1] + dp[i-2]. Ways to reach step i = ways via 1-step from i-1 + ways via 2-step from i-2.",
    coreIdeaHinglish: "Step i pe pahunchne ke ways = step (i-1) se + step (i-2) se. Fibonacci series hi hai. O(1) space me solve ho jaata hai.",
    approach: [
      "a, b = 1, 1 (base cases for n=1, n=2)",
      "For _ in range(n-1): a, b = b, a+b",
      "Return b"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "dp[1]=1, dp[2]=2 (not both 1) — two ways to reach step 2: (1+1) or (2)",
      "Space-optimize: only need last two values",
      "Classic warmup — the real skill is recognizing this pattern in harder problems"
    ],
    code: `a = b = 1
for _ in range(n - 1):
    a, b = b, a + b
return b`,
    variants: [
      "House Robber (LC 198)",
      "Min Cost Climbing Stairs (LC 746)"
    ]
  },

  {
    id: 198,
    name: "House Robber",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "max sum of non-adjacent elements in an array",
      "can't pick two consecutive houses"
    ],
    coreIdea: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). At each house, decide: skip it (take dp[i-1]) or rob it (take dp[i-2] + current value).",
    coreIdeaHinglish: "Har ghar pe choice: skip karo (dp[i-1] lo) ya rob karo (dp[i-2] + nums[i] lo). Space optimize karke sirf do values track karo.",
    approach: [
      "prev2, prev1 = 0, 0",
      "For num: curr = max(prev1, prev2 + num); prev2 = prev1; prev1 = curr",
      "Return prev1"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "prev2 must be updated BEFORE prev1 in the rolling update",
      "Start with prev2=prev1=0 (empty prefix has 0 profit)",
      "dp[i] does NOT mean 'must rob house i' — it's the max up to house i"
    ],
    code: `prev2 = prev1 = 0
for num in nums:
    curr = max(prev1, prev2 + num)
    prev2, prev1 = prev1, curr
return prev1`,
    variants: [
      "House Robber II (LC 213) — circular",
      "Delete and Earn (LC 740)"
    ]
  },

  {
    id: 213,
    name: "House Robber II",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "house robber but houses arranged in a circle (first and last are adjacent)"
    ],
    coreIdea: "Run House Robber twice: once on nums[0:-1] (exclude last), once on nums[1:] (exclude first). Take the max. The first/last adjacency is broken by excluding one of them.",
    coreIdeaHinglish: "Circular constraint handle karne ke liye do runs: ek pehle ko exclude karke, ek aakhir ko exclude karke. Dono ka max lo.",
    approach: [
      "def rob(arr): standard House Robber I",
      "Return max(rob(nums[:-1]), rob(nums[1:])) if len > 1 else nums[0]"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Handle n==1 separately (single house, just return nums[0])",
      "Two independent runs — don't try to track both cases simultaneously",
      "First/last can NEVER both be robbed — one of the two runs always excludes one of them"
    ],
    code: `def rob(arr):
    prev2 = prev1 = 0
    for n in arr:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1
if len(nums) == 1: return nums[0]
return max(rob(nums[:-1]), rob(nums[1:]))`,
    variants: [
      "House Robber (LC 198)",
      "House Robber III (LC 337) — on tree"
    ]
  },

  {
    id: 322,
    name: "Coin Change",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "minimum number of coins to make amount",
      "unbounded knapsack (coins reusable)"
    ],
    coreIdea: "dp[i] = min coins to make amount i. For each amount, try each coin: dp[i] = min(dp[i], dp[i-coin]+1). Build bottom-up from 0 to amount.",
    coreIdeaHinglish: "dp[i] = amount i banane ke liye minimum coins. Har amount ke liye har coin try karo. dp[i] = min(dp[i], dp[i-coin] + 1). Bottom-up.",
    approach: [
      "dp = [inf]*(amount+1); dp[0]=0",
      "For i in 1..amount: for coin: if coin<=i: dp[i]=min(dp[i], dp[i-coin]+1)",
      "Return dp[amount] if != inf else -1"
    ],
    time: "O(amount × n)",
    space: "O(amount)",
    pitfalls: [
      "Initialize dp[0]=0, rest=inf (not -1 — you need inf for min operation)",
      "Return -1 if dp[amount] is still inf at the end",
      "Both loop orders work (coin-outer or amount-outer) for unbounded"
    ],
    code: `dp = [float('inf')] * (amount + 1)
dp[0] = 0
for i in range(1, amount + 1):
    for coin in coins:
        if coin <= i:
            dp[i] = min(dp[i], dp[i - coin] + 1)
return dp[amount] if dp[amount] != float('inf') else -1`,
    variants: [
      "Coin Change II (LC 518) — count ways",
      "Perfect Squares (LC 279)"
    ]
  },

  {
    id: 300,
    name: "Longest Increasing Subsequence",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "length of longest strictly increasing subsequence",
      "O(n log n) patience sorting, or O(n²) DP"
    ],
    coreIdea: "DP: dp[i] = LIS ending at index i. For each i, scan j < i: if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j]+1). O(n²). O(n log n): maintain a 'tails' array with binary search.",
    coreIdeaHinglish: "dp[i] = index i pe khatam hone wali LIS ki length. j < i: nums[j] < nums[i]? dp[i] = max(dp[i], dp[j]+1). Ya patience sort use karo for O(n log n).",
    approach: [
      "tails = []",
      "For num: i = bisect_left(tails, num)",
      "If i==len(tails): append; else: tails[i]=num",
      "Return len(tails)"
    ],
    time: "O(n log n) with tails, O(n²) with DP",
    space: "O(n)",
    pitfalls: [
      "tails is NOT the actual LIS — it's a structure to track length only",
      "Use bisect_left for strictly increasing (bisect_right for non-decreasing)",
      "The O(n²) DP is more intuitive for interviews if O(n log n) isn't required"
    ],
    code: `import bisect
tails = []
for num in nums:
    i = bisect.bisect_left(tails, num)
    if i == len(tails):
        tails.append(num)
    else:
        tails[i] = num
return len(tails)`,
    variants: [
      "Russian Doll Envelopes (LC 354)",
      "Number of LIS (LC 673)"
    ]
  },

  {
    id: 139,
    name: "Word Break",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "can string s be segmented into words from a dictionary?",
      "dp[i] = can we reach position i?"
    ],
    coreIdea: "dp[i] = True if s[:i] can be segmented. For each i, check all j < i: if dp[j] and s[j:i] in word_set: dp[i] = True.",
    coreIdeaHinglish: "dp[i] = s ke pehle i chars segment ho sakte hain? Har i ke liye, pehle ke saare j check karo: dp[j] True hai aur s[j:i] dictionary me hai? dp[i] = True.",
    approach: [
      "word_set = set(wordDict); dp = [False]*(n+1); dp[0]=True",
      "For i in 1..n: for j in 0..i: if dp[j] and s[j:i] in word_set: dp[i]=True; break"
    ],
    time: "O(n² · m) where m = max word length",
    space: "O(n)",
    pitfalls: [
      "dp[0]=True — empty string is always 'breakable' (base case)",
      "Use a set for O(1) lookup instead of checking the list",
      "Optimization: limit j to max word length back from i"
    ],
    code: `word_set = set(wordDict)
dp = [False] * (len(s) + 1)
dp[0] = True
for i in range(1, len(s) + 1):
    for j in range(i):
        if dp[j] and s[j:i] in word_set:
            dp[i] = True; break
return dp[len(s)]`,
    variants: [
      "Word Break II (LC 140)",
      "Concatenated Words (LC 472)"
    ]
  },

  {
    id: 53,
    name: "Maximum Subarray",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "maximum sum of any contiguous subarray",
      "Kadane's algorithm"
    ],
    coreIdea: "Kadane's: at each position, either extend the current subarray or start fresh. curr = max(num, curr+num). Update global max.",
    coreIdeaHinglish: "Kadane's: har position pe choose karo — current element se fresh start karo ya pehle se extend karo. curr = max(num, curr+num). Global max track karo.",
    approach: [
      "curr = ans = nums[0]",
      "For num in nums[1:]: curr = max(num, curr+num); ans = max(ans, curr)"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Initialize curr AND ans to nums[0] — handles all-negative arrays",
      "curr = max(num, curr+num) — if curr < 0, restart from num",
      "Don't initialize to 0 if array can have all negatives"
    ],
    code: `curr = ans = nums[0]
for num in nums[1:]:
    curr = max(num, curr + num)
    ans = max(ans, curr)
return ans`,
    variants: [
      "Maximum Product Subarray (LC 152)",
      "Maximum Sum Circular Subarray (LC 918)"
    ]
  },

  {
    id: 152,
    name: "Maximum Product Subarray",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "maximum product of any contiguous subarray",
      "negative numbers can flip sign — track both min and max"
    ],
    coreIdea: "Track both max_prod and min_prod at each position (negatives can turn min into max). At each step: new max = max(num, max_prod*num, min_prod*num); similarly for min.",
    coreIdeaHinglish: "Negative number current max aur min dono flip kar sakta hai. Isliye dono track karo. Har step pe: naya max = max(num, cur_max*num, cur_min*num). Same for min.",
    approach: [
      "cur_max = cur_min = ans = nums[0]",
      "For num in nums[1:]: candidates = (num, cur_max*num, cur_min*num)",
      "cur_max, cur_min = max(candidates), min(candidates); ans = max(ans, cur_max)"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Must compute new max AND min from SAME old cur_max and cur_min — don't update in sequence",
      "0 resets both max and min (multiplying by 0 gives 0 — start fresh from next element)",
      "Initialize to nums[0] (not 0 or 1) — handles all-negative or single-element arrays"
    ],
    code: `cur_max = cur_min = ans = nums[0]
for num in nums[1:]:
    candidates = (num, cur_max * num, cur_min * num)
    cur_max, cur_min = max(candidates), min(candidates)
    ans = max(ans, cur_max)
return ans`,
    variants: [
      "Maximum Subarray (LC 53)",
      "Maximum Product of Three Numbers (LC 628)"
    ]
  },

  {
    id: 91,
    name: "Decode Ways",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "count ways to decode a string of digits (1→A, 2→B, ... 26→Z)",
      "one-digit and two-digit decodings"
    ],
    coreIdea: "dp[i] = ways to decode s[:i]. If s[i-1] is non-zero: dp[i] += dp[i-1] (1-digit decode). If s[i-2:i] is 10-26: dp[i] += dp[i-2] (2-digit decode).",
    coreIdeaHinglish: "dp[i] = s ke pehle i chars decode karne ke ways. s[i-1] != '0'? dp[i] += dp[i-1]. s[i-2:i] in 10-26? dp[i] += dp[i-2].",
    approach: [
      "dp = [0]*(n+1); dp[0]=1; dp[1]=1 if s[0]!='0' else 0",
      "For i in 2..n+1: one = int(s[i-1]); two = int(s[i-2:i])",
      "if one: dp[i]+=dp[i-1]; if 10<=two<=26: dp[i]+=dp[i-2]"
    ],
    time: "O(n)",
    space: "O(n) → O(1) with rolling vars",
    pitfalls: [
      "s starting with '0' → dp[1]=0 (no valid 1-digit decode for '0')",
      "Two-digit must be in [10, 26] — not just any two digits",
      "'00' can't be decoded — caught by the 10≤two≤26 check"
    ],
    code: `n = len(s)
dp = [0] * (n + 1)
dp[0] = 1
dp[1] = 1 if s[0] != '0' else 0
for i in range(2, n + 1):
    one = int(s[i-1])
    two = int(s[i-2:i])
    if one: dp[i] += dp[i-1]
    if 10 <= two <= 26: dp[i] += dp[i-2]
return dp[n]`,
    variants: [
      "Decode Ways II (LC 639) — with '*' wildcard"
    ]
  },

  {
    id: 416,
    name: "Partition Equal Subset Sum",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "can array be split into two subsets with equal sum?",
      "0/1 knapsack — find subset summing to total/2"
    ],
    coreIdea: "Reduce to: can any subset sum to total/2? 0/1 knapsack DP: dp[j] = True if sum j is achievable. Process each num: iterate j from target down to num (to avoid reuse).",
    coreIdeaHinglish: "Total/2 sum banana possible hai? 0/1 knapsack: dp[j] = True agar sum j achieve ho sake. Har num ke liye j ko target se num tak reverse iterate karo (reuse avoid karne ke liye).",
    approach: [
      "total = sum(nums); if odd: return False; target = total//2",
      "dp = {False}*(target+1); dp[0]=True",
      "For num: for j in range(target, num-1, -1): dp[j] |= dp[j-num]"
    ],
    time: "O(n × target)",
    space: "O(target)",
    pitfalls: [
      "If total is odd → impossible (return False immediately)",
      "REVERSE iterate j (target down to num) — prevents using the same element twice in one pass",
      "Any num > target → also return False early"
    ],
    code: `total = sum(nums)
if total % 2: return False
target = total // 2
dp = [False] * (target + 1)
dp[0] = True
for num in nums:
    for j in range(target, num - 1, -1):
        dp[j] = dp[j] or dp[j - num]
return dp[target]`,
    variants: [
      "Target Sum (LC 494)",
      "Last Stone Weight II (LC 1049)"
    ]
  },

  {
    id: 647,
    name: "Palindromic Substrings",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "count all palindromic substrings",
      "expand around center"
    ],
    coreIdea: "Expand around each center (same as LC 5, but count instead of track max length). Two cases per index: odd and even centers. Count each valid expansion.",
    coreIdeaHinglish: "Har index ko center maan ke expand karo — odd aur even dono. Har valid expansion = ek palindromic substring. Count karo.",
    approach: [
      "count = 0",
      "For i in range(n): for l,r in [(i,i),(i,i+1)]: while valid: count++; l--; r++"
    ],
    time: "O(n²)",
    space: "O(1)",
    pitfalls: [
      "Start count at l=r for odd (one char is always a palindrome)",
      "Don't count the initial single-char as 'extra' — the while loop handles it",
      "DP approach is O(n²) time and O(n²) space — expand-around-center is better"
    ],
    code: `count = 0
for i in range(len(s)):
    for l, r in [(i, i), (i, i + 1)]:
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1; r += 1
return count`,
    variants: [
      "Longest Palindromic Substring (LC 5)",
      "Palindrome Partitioning (LC 131)"
    ]
  },

  {
    id: 740,
    name: "Delete and Earn",
    difficulty: "Medium",
    pattern: "1-D DP",
    trigger: [
      "delete a number to earn it (removes all adjacent integers), maximize earnings",
      "reduce to House Robber"
    ],
    coreIdea: "Choosing value v earns v × (count of v), but deletes all v-1 and v+1. This is exactly House Robber on a points array where points[v] = v × count(v).",
    coreIdeaHinglish: "Value v choose karne par v × count(v) milta hai par adjacent values delete ho jaate hain. Yeh House Robber hai — non-adjacent elements ka max sum.",
    approach: [
      "points = [0]*(max(nums)+1)",
      "For n in nums: points[n] += n",
      "Run House Robber on points array"
    ],
    time: "O(n + max_val)",
    space: "O(max_val)",
    pitfalls: [
      "points[v] = v × frequency of v (not just count)",
      "The transformation to House Robber is the key insight",
      "Max value can be up to 10^4 — points array is bounded"
    ],
    code: `points = [0] * (max(nums) + 1)
for n in nums:
    points[n] += n
prev2 = prev1 = 0
for p in points:
    prev2, prev1 = prev1, max(prev1, prev2 + p)
return prev1`,
    variants: [
      "House Robber (LC 198)",
      "House Robber II (LC 213)"
    ]
  },

  // ── 2-D DP ───────────────────────────────────────────────────

  {
    id: 62,
    name: "Unique Paths",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "count paths from top-left to bottom-right (only right or down moves)",
      "grid DP"
    ],
    coreIdea: "dp[r][c] = paths to reach (r,c) = dp[r-1][c] + dp[r][c-1]. First row and column all 1s (only one way to reach). Can be solved in O(1) space with rolling row.",
    coreIdeaHinglish: "dp[r][c] = yahan tak pahunchne ke paths = upar se + left se. Pehli row aur col sab 1. Space O(n) se karo — sirf ek row track karo.",
    approach: [
      "dp = [1]*cols",
      "For each row 1..rows: for c in 1..cols: dp[c] += dp[c-1]",
      "Return dp[-1]"
    ],
    time: "O(m·n)",
    space: "O(n)",
    pitfalls: [
      "Rolling row: dp[c] = dp[c] (from row above) + dp[c-1] (from left in current row)",
      "First row stays all 1s — no update needed",
      "Math solution exists: C(m+n-2, m-1)"
    ],
    code: `dp = [1] * n
for _ in range(m - 1):
    for c in range(1, n):
        dp[c] += dp[c - 1]
return dp[-1]`,
    variants: [
      "Unique Paths II (LC 63) — with obstacles",
      "Minimum Path Sum (LC 64)"
    ]
  },

  {
    id: 64,
    name: "Minimum Path Sum",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "minimum sum path from top-left to bottom-right (right/down only)"
    ],
    coreIdea: "dp[r][c] = min cost to reach (r,c) = grid[r][c] + min(dp[r-1][c], dp[r][c-1]). Modify in-place to avoid extra space.",
    coreIdeaHinglish: "dp[r][c] = yahan tak minimum cost = grid[r][c] + min(upar se, left se). In-place modify karo extra space ke bina.",
    approach: [
      "Fill first row (prefix sums); fill first col (prefix sums)",
      "For r,c > 0: grid[r][c] += min(grid[r-1][c], grid[r][c-1])",
      "Return grid[-1][-1]"
    ],
    time: "O(m·n)",
    space: "O(1) in-place",
    pitfalls: [
      "Initialize first row and first column as prefix sums before filling interior",
      "In-place modification is clean — no extra dp array needed",
      "min() of up and left (not max)"
    ],
    code: `rows, cols = len(grid), len(grid[0])
for c in range(1, cols): grid[0][c] += grid[0][c-1]
for r in range(1, rows): grid[r][0] += grid[r-1][0]
for r in range(1, rows):
    for c in range(1, cols):
        grid[r][c] += min(grid[r-1][c], grid[r][c-1])
return grid[-1][-1]`,
    variants: [
      "Unique Paths (LC 62)",
      "Triangle (LC 120)"
    ]
  },

  {
    id: 1143,
    name: "Longest Common Subsequence",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "length of longest common subsequence of two strings"
    ],
    coreIdea: "dp[i][j] = LCS of text1[:i] and text2[:j]. If chars match: dp[i][j] = dp[i-1][j-1]+1. Else: max(dp[i-1][j], dp[i][j-1]).",
    coreIdeaHinglish: "dp[i][j] = text1 ke pehle i aur text2 ke pehle j chars ka LCS. Chars match? dp[i-1][j-1]+1. Nahi? max(upar, left).",
    approach: [
      "dp = [[0]*(n+1) for _ in range(m+1)]",
      "If text1[i-1]==text2[j-1]: dp[i][j]=dp[i-1][j-1]+1",
      "Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])"
    ],
    time: "O(m·n)",
    space: "O(m·n) → O(n) with rolling row",
    pitfalls: [
      "LCS ≠ LCS substring — characters don't need to be contiguous",
      "Indices are 1-based for dp but 0-based for string access: text1[i-1]",
      "Rolling row optimization: only need previous row"
    ],
    code: `m, n = len(text1), len(text2)
dp = [[0] * (n + 1) for _ in range(m + 1)]
for i in range(1, m + 1):
    for j in range(1, n + 1):
        if text1[i-1] == text2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
return dp[m][n]`,
    variants: [
      "Longest Common Substring",
      "Delete Operation for Two Strings (LC 583)",
      "Edit Distance (LC 72)"
    ]
  },

  {
    id: 309,
    name: "Best Time to Buy and Sell Stock with Cooldown",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "max profit with unlimited transactions but 1-day cooldown after selling",
      "state machine DP"
    ],
    coreIdea: "Three states: holding, sold (just sold — cooldown next), cooldown. Transitions: holding → hold or sell; sold → cooldown; cooldown → hold or stay.",
    coreIdeaHinglish: "Teen states: holding, sold (abhi sell kiya), cooldown. Holding se sell karo ya hold karo. Sold ke baad cooldown. Cooldown ke baad buy karo ya wait karo.",
    approach: [
      "hold = -inf, sold = 0, cool = 0",
      "For price: new_hold = max(hold, cool - price)",
      "new_sold = hold + price; new_cool = max(cool, sold)",
      "hold, sold, cool = new_hold, new_sold, new_cool"
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Compute all three new states SIMULTANEOUSLY from old values — order of assignment matters",
      "Initial hold = -inf (can't sell before buying); sold = cool = 0",
      "cool absorbs the 'wait' state — max(cool, sold) means either waiting from yesterday's cool or just finished cooldown"
    ],
    code: `hold = float('-inf')
sold = cool = 0
for price in prices:
    new_hold = max(hold, cool - price)
    new_sold = hold + price
    new_cool = max(cool, sold)
    hold, sold, cool = new_hold, new_sold, new_cool
return max(sold, cool)`,
    variants: [
      "Buy and Sell Stock (LC 121)",
      "Buy and Sell Stock with Transaction Fee (LC 714)"
    ]
  },

  {
    id: 518,
    name: "Coin Change II",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "number of ways to make amount using coins (combinations, not permutations)",
      "unbounded knapsack — count combinations"
    ],
    coreIdea: "dp[j] = ways to make amount j. For each coin, forward-iterate j from coin to amount: dp[j] += dp[j-coin]. Coin-outer loop ensures combinations (each coin considered once).",
    coreIdeaHinglish: "dp[j] = amount j banane ke ways. Har coin ke liye forward iterate karo (coin se amount tak). dp[j] += dp[j-coin]. Coin outer loop = combinations (order nahi chahiye).",
    approach: [
      "dp = [0]*(amount+1); dp[0]=1",
      "For coin: for j in range(coin, amount+1): dp[j] += dp[j-coin]"
    ],
    time: "O(amount × n)",
    space: "O(amount)",
    pitfalls: [
      "Coin-OUTER loop gives combinations; amount-outer gives permutations (different problem)",
      "Forward iteration (unlike 0/1 knapsack) — coins are reusable",
      "dp[0]=1 — one way to make 0 (use no coins)"
    ],
    code: `dp = [0] * (amount + 1)
dp[0] = 1
for coin in coins:
    for j in range(coin, amount + 1):
        dp[j] += dp[j - coin]
return dp[amount]`,
    variants: [
      "Coin Change (LC 322) — min coins",
      "Combination Sum IV (LC 377) — permutations (order matters)"
    ]
  },

  {
    id: 494,
    name: "Target Sum",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "count ways to assign + or - to each number to reach target",
      "subset sum DP (reduce to P-N=target, P+N=sum)"
    ],
    coreIdea: "Let P = sum of positives, N = sum of negatives. P - N = target, P + N = total. So P = (total + target) / 2. Count subsets summing to P — exactly LC 416 (count variant).",
    coreIdeaHinglish: "Math reduce karo: P + N = total, P - N = target. P = (total+target)/2. Ab count karo kitne subsets ka sum P hai — 0/1 knapsack count variant.",
    approach: [
      "If (total+target) is odd or target > total: return 0",
      "P = (total+target)//2",
      "dp[0]=1; for num: for j in range(P, num-1, -1): dp[j] += dp[j-num]"
    ],
    time: "O(n × P)",
    space: "O(P)",
    pitfalls: [
      "(total + target) must be even for P to be integer",
      "abs(target) > total → impossible (even assigning all to one side falls short)",
      "Reverse iterate j (0/1 knapsack — each num used once)"
    ],
    code: `total = sum(nums)
if (total + target) % 2 or abs(target) > total: return 0
P = (total + target) // 2
dp = [0] * (P + 1)
dp[0] = 1
for num in nums:
    for j in range(P, num - 1, -1):
        dp[j] += dp[j - num]
return dp[P]`,
    variants: [
      "Partition Equal Subset Sum (LC 416)",
      "Last Stone Weight II (LC 1049)"
    ]
  },

  {
    id: 97,
    name: "Interleaving String",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "can s3 be formed by interleaving s1 and s2?",
      "2D DP on (i, j) = can s3[:i+j] be formed from s1[:i] and s2[:j]?"
    ],
    coreIdea: "dp[i][j] = True if s3[:i+j] can be formed by interleaving s1[:i] and s2[:j]. Transition: from dp[i-1][j] (match s1[i-1]) or dp[i][j-1] (match s2[j-1]).",
    coreIdeaHinglish: "dp[i][j] = s3 ke pehle i+j chars bana sakte hain s1[:i] aur s2[:j] se? Transition: s1 se ek char lo ya s2 se ek char lo — match hona chahiye s3[i+j-1] se.",
    approach: [
      "If len(s1)+len(s2)!=len(s3): return False",
      "dp[i][j] = (dp[i-1][j] and s1[i-1]==s3[i+j-1]) or (dp[i][j-1] and s2[j-1]==s3[i+j-1])"
    ],
    time: "O(m·n)",
    space: "O(m·n) → O(n) rolling",
    pitfalls: [
      "Check length first: if m+n != len(s3): return False",
      "dp[0][0]=True; first row: dp[0][j] = dp[0][j-1] and s2[j-1]==s3[j-1]",
      "i+j-1 indexes into s3 (0-indexed)"
    ],
    code: `m, n = len(s1), len(s2)
if m + n != len(s3): return False
dp = [[False]*(n+1) for _ in range(m+1)]
dp[0][0] = True
for j in range(1, n+1): dp[0][j] = dp[0][j-1] and s2[j-1]==s3[j-1]
for i in range(1, m+1): dp[i][0] = dp[i-1][0] and s1[i-1]==s3[i-1]
for i in range(1, m+1):
    for j in range(1, n+1):
        dp[i][j] = (dp[i-1][j] and s1[i-1]==s3[i+j-1]) or \
                   (dp[i][j-1] and s2[j-1]==s3[i+j-1])
return dp[m][n]`,
    variants: [
      "Longest Common Subsequence (LC 1143)"
    ]
  },

  {
    id: 329,
    name: "Longest Increasing Path in a Matrix",
    difficulty: "Hard",
    pattern: "2-D DP",
    trigger: [
      "longest strictly increasing path in a matrix (any direction)",
      "DFS + memoization on DAG"
    ],
    coreIdea: "DFS from each cell. memo[r][c] = longest increasing path starting at (r,c). Only move to strictly larger neighbors. Because paths only go in increasing direction, no cycles → DAG → memoize safely.",
    coreIdeaHinglish: "Har cell se DFS karo. memo[r][c] = yahan se shuru hone wali sabse lambi increasing path. Sirf bade neighbors pe jao. No cycles (strictly increasing) → memoize.",
    approach: [
      "memo = {}; for each cell: ans = max(ans, dfs(r,c))",
      "dfs(r,c): if memo: return; for 4 dirs: if in bounds and grid[nr][nc]>grid[r][c]: explore",
      "memo[r][c] = 1 + max of neighbors; return memo[r][c]"
    ],
    time: "O(M·N)",
    space: "O(M·N)",
    pitfalls: [
      "No need to track visited — strictly increasing guarantees no cycles",
      "Memoize by (r,c) — a cell's longest path is fixed regardless of how you reach it",
      "Topological sort + DP is the alternative O(M·N) approach"
    ],
    code: `from functools import lru_cache
rows, cols = len(matrix), len(matrix[0])
@lru_cache(None)
def dfs(r, c):
    best = 1
    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
        nr, nc = r+dr, c+dc
        if 0<=nr<rows and 0<=nc<cols and matrix[nr][nc]>matrix[r][c]:
            best = max(best, 1 + dfs(nr, nc))
    return best
return max(dfs(r,c) for r in range(rows) for c in range(cols))`,
    variants: [
      "Number of Islands (LC 200)",
      "Pacific Atlantic Water Flow (LC 417)"
    ]
  },

  {
    id: 221,
    name: "Maximal Square",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "largest square submatrix of all 1s",
      "dp[r][c] = side length of largest square with bottom-right at (r,c)"
    ],
    coreIdea: "dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 when matrix[r][c]=='1'. The min of three neighbors limits the square size.",
    coreIdeaHinglish: "dp[r][c] = yahan bottom-right pe khatam hone wale sabse bade square ki side. Agar cell 1 hai: min(upar, left, diagonal) + 1. Max dp value ka square = answer.",
    approach: [
      "dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 if matrix[r][c]=='1'",
      "ans = max(dp[r][c]); return ans²"
    ],
    time: "O(M·N)",
    space: "O(M·N) → O(N) rolling",
    pitfalls: [
      "Answer is the AREA (side²), not the side length",
      "The min of three neighbors is the bottleneck — one smaller neighbor caps the square",
      "First row and column: dp[r][c] = int(matrix[r][c]) directly"
    ],
    code: `rows, cols = len(matrix), len(matrix[0])
dp = [[0]*cols for _ in range(rows)]
ans = 0
for r in range(rows):
    for c in range(cols):
        if matrix[r][c] == '1':
            if r > 0 and c > 0:
                dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1
            else:
                dp[r][c] = 1
            ans = max(ans, dp[r][c])
return ans * ans`,
    variants: [
      "Maximal Rectangle (LC 85)"
    ]
  },

  {
    id: 583,
    name: "Delete Operation for Two Strings",
    difficulty: "Medium",
    pattern: "2-D DP",
    trigger: [
      "minimum deletions to make two strings equal",
      "reduce to LCS: deletions = m + n - 2×LCS"
    ],
    coreIdea: "Minimum deletions = (m - LCS) + (n - LCS) = m + n - 2×LCS. Compute LCS of word1 and word2, then apply the formula.",
    coreIdeaHinglish: "Minimum deletions = m + n - 2 × LCS. Pehle LCS nikalo, phir formula apply karo. LCS jo bacha woh common hai, baaki delete karna hai.",
    approach: [
      "Compute LCS(word1, word2) as in LC 1143",
      "Return len(word1) + len(word2) - 2*lcs"
    ],
    time: "O(m·n)",
    space: "O(m·n) → O(n)",
    pitfalls: [
      "Don't re-derive the DP — recognize it's LCS + formula",
      "Alternative: edit distance (LC 72) restricted to only deletions",
      "Formula: (chars to delete from word1) + (chars to delete from word2)"
    ],
    code: `m, n = len(word1), len(word2)
dp = [[0]*(n+1) for _ in range(m+1)]
for i in range(1, m+1):
    for j in range(1, n+1):
        if word1[i-1] == word2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
return m + n - 2 * dp[m][n]`,
    variants: [
      "Longest Common Subsequence (LC 1143)",
      "Edit Distance (LC 72)"
    ]
  },

  /* ── Intervals ───────────────────────────────────────────── */
  {
    id: 56,
    name: "Merge Intervals",
    difficulty: "Medium",
    pattern: "Intervals",
    trigger: ["overlapping intervals", "merge/combine ranges", "output non-overlapping set"],
    coreIdea: "Sort by start. For each interval, if it overlaps the last merged (start ≤ last.end), extend the end. Otherwise append.",
    coreIdeaHinglish: "Intervals ko start ke basis pe sort karo. Phir ek-ek karke dekho — agar naya interval pichle wale se overlap karta hai (start ≤ last.end), toh end ko merge karo (max lo). Nahi toh naya interval daalo.",
    approach: [
      "Sort intervals by start",
      "Init result with intervals[0]",
      "For each next [s, e]: if s <= result[-1][1]: result[-1][1] = max(result[-1][1], e)",
      "Else: append [s, e]",
      "Return result"
    ],
    time: "O(n log n)", space: "O(n)",
    pitfalls: [
      "Take max of ends — don't just assign e (current may be fully inside last)",
      "Must sort by start first",
      "Edge: single interval — return as-is"
    ],
    code: `intervals.sort(key=lambda x: x[0])
res = [intervals[0]]
for s, e in intervals[1:]:
    if s <= res[-1][1]:
        res[-1][1] = max(res[-1][1], e)
    else:
        res.append([s, e])
return res`,
    variants: ["Insert Interval (LC 57)", "Non-overlapping Intervals (LC 435)"]
  },
  {
    id: 57,
    name: "Insert Interval",
    difficulty: "Medium",
    pattern: "Intervals",
    trigger: ["insert into sorted non-overlapping intervals", "merge after insert", "no re-sort allowed"],
    coreIdea: "Three passes: copy intervals ending before new start; merge all overlapping into new; copy remaining.",
    coreIdeaHinglish: "Pehle saare intervals daalo jo newInterval ke start se pehle khatam hote hain. Phir jo overlap karte hain unhe ek-ek merge karo (min/max lo). Baaki seedha copy karo.",
    approach: [
      "Add all intervals with end < newInterval[0]",
      "Merge overlapping: while i < n and intervals[i][0] <= newInterval[1]: update new = [min start, max end]; i++",
      "Append merged newInterval",
      "Append remaining intervals[i:]"
    ],
    time: "O(n)", space: "O(n)",
    pitfalls: [
      "Overlap condition: intervals[i][0] <= newInterval[1] (not <)",
      "Take min of starts and max of ends during merge",
      "Don't forget to add remaining intervals after the merged block"
    ],
    code: `res, i, n = [], 0, len(intervals)
while i < n and intervals[i][1] < newInterval[0]:
    res.append(intervals[i]); i += 1
while i < n and intervals[i][0] <= newInterval[1]:
    newInterval[0] = min(newInterval[0], intervals[i][0])
    newInterval[1] = max(newInterval[1], intervals[i][1])
    i += 1
res.append(newInterval)
res.extend(intervals[i:])
return res`,
    variants: ["Merge Intervals (LC 56)", "Range Module (LC 715)"]
  },
  {
    id: 435,
    name: "Non-overlapping Intervals",
    difficulty: "Medium",
    pattern: "Intervals",
    trigger: ["minimum removals to make non-overlapping", "maximum non-overlapping subset"],
    coreIdea: "Sort by end. Greedily keep intervals with earliest end — when two overlap, remove the one with the later end (don't update prevEnd).",
    coreIdeaHinglish: "Intervals ko end ke basis pe sort karo. Jo sabse pehle khatam ho, use rakho. Agar next wala overlap kare toh use remove (count++) karo aur prevEnd waise hi rakho. Overlap nahi kare toh prevEnd update karo.",
    approach: [
      "Sort by end time",
      "prevEnd = intervals[0][1], removals = 0",
      "For each next [s, e]: if s < prevEnd: removals++ (overlap — remove current later-ending one)",
      "Else: prevEnd = e",
      "Return removals"
    ],
    time: "O(n log n)", space: "O(1)",
    pitfalls: [
      "Sort by END, not start (sorting by start is a classic wrong approach here)",
      "When overlapping: keep prevEnd unchanged (you keep the earlier-ending interval)",
      "Answer is removal count, not kept count"
    ],
    code: `intervals.sort(key=lambda x: x[1])
removals = 0
prevEnd = intervals[0][1]
for s, e in intervals[1:]:
    if s < prevEnd:
        removals += 1
    else:
        prevEnd = e
return removals`,
    variants: ["Minimum Number of Arrows to Burst Balloons (LC 452)", "Merge Intervals (LC 56)"]
  },
  {
    id: 252,
    name: "Meeting Rooms",
    difficulty: "Easy",
    pattern: "Intervals",
    trigger: ["can one person attend all meetings?", "any two intervals overlap?"],
    coreIdea: "Sort by start. If any meeting starts before the previous ends, return False.",
    coreIdeaHinglish: "Meetings ko start time ke basis pe sort karo. Agar koi meeting pichli meeting khatam hone se pehle shuru ho jaye — False. Sab theek rahe toh True.",
    approach: [
      "Sort by start",
      "For each consecutive pair: if intervals[i][0] < intervals[i-1][1]: return False",
      "Return True"
    ],
    time: "O(n log n)", space: "O(1)",
    pitfalls: [
      "Adjacent (start == prevEnd) is fine — use < not <=",
      "Must sort first before checking pairs",
      "Update prevEnd even when no overlap (interval may extend further)"
    ],
    code: `intervals.sort(key=lambda x: x[0])
for i in range(1, len(intervals)):
    if intervals[i][0] < intervals[i-1][1]:
        return False
return True`,
    variants: ["Meeting Rooms II (LC 253)", "Non-overlapping Intervals (LC 435)"]
  },
  {
    id: 253,
    name: "Meeting Rooms II",
    difficulty: "Medium",
    pattern: "Intervals",
    trigger: ["minimum rooms for all meetings", "maximum simultaneous intervals", "peak overlap count"],
    coreIdea: "Split into separately-sorted starts[] and ends[]. Two-pointer sweep: when next start < next end, allocate a room; else free one.",
    coreIdeaHinglish: "Starts aur ends ko alag-alag sort karo. Do pointers chalao. Jab naya start current end se pehle aaye, naya room chahiye. Jab nahi chahiye, ek room free — end pointer aage. Peak rooms track karo.",
    approach: [
      "Sort starts[] and ends[] separately (not as pairs)",
      "s = e = rooms = maxR = 0",
      "While s < n: if starts[s] < ends[e]: rooms++; else: rooms--; e++",
      "maxR = max(maxR, rooms); s++",
      "Return maxR"
    ],
    time: "O(n log n)", space: "O(n)",
    pitfalls: [
      "Sort starts and ends independently — don't sort as pairs",
      "Condition is < not <= (equal means previous ended exactly as this starts — no overlap)",
      "Track maxR throughout the sweep, not just at the end"
    ],
    code: `starts = sorted(i[0] for i in intervals)
ends   = sorted(i[1] for i in intervals)
s = e = rooms = maxR = 0
while s < len(starts):
    if starts[s] < ends[e]:
        rooms += 1
    else:
        rooms -= 1; e += 1
    maxR = max(maxR, rooms); s += 1
return maxR`,
    variants: ["Meeting Rooms (LC 252)", "Minimum Number of Platforms (classic)"]
  },
  {
    id: 1851,
    name: "Minimum Interval to Include Each Query",
    difficulty: "Hard",
    pattern: "Intervals",
    trigger: ["for each query find smallest containing interval", "offline queries on intervals", "min-heap sweep"],
    coreIdea: "Sort intervals by start; process queries offline sorted. Min-heap keyed by size. Per query: push all intervals with start ≤ q; pop expired (end < q); answer is heap top's size.",
    coreIdeaHinglish: "Intervals ko start ke hisaab se sort karo. Queries ko bhi sort karo (original index yaad rakho). Har query ke liye heap mein wo intervals daalo jinka start ≤ query hai. Jinka end bhi query se chhota hai unhe nikaalo. Heap top answer hai.",
    approach: [
      "Sort intervals by start; sort queries with original indices",
      "Min-heap keyed by (size = r-l+1, r)",
      "For each query q: push all intervals with start <= q onto heap",
      "Pop heap while heap[0][1] < q (interval ended before query)",
      "ans[qi] = heap[0][0] if heap else -1"
    ],
    time: "O((n+q) log n)", space: "O(n+q)",
    pitfalls: [
      "Heap key is interval SIZE (r-l+1), not start time",
      "Must restore original query order in the output (use index map)",
      "Lazy deletion: pop expired intervals only when peeking, not eagerly"
    ],
    code: `import heapq
intervals.sort()
queries_i = sorted(enumerate(queries), key=lambda x: x[1])
ans = {}; heap = []; i = 0
for qi, q in queries_i:
    while i < len(intervals) and intervals[i][0] <= q:
        l, r = intervals[i]
        heapq.heappush(heap, (r-l+1, r)); i += 1
    while heap and heap[0][1] < q:
        heapq.heappop(heap)
    ans[qi] = heap[0][0] if heap else -1
return [ans[i] for i in range(len(queries))]`,
    variants: ["Meeting Rooms II (LC 253)", "My Calendar I (LC 729)"]
  },

  /* ── Greedy ──────────────────────────────────────────────── */
  {
    id: 55,
    name: "Jump Game",
    difficulty: "Medium",
    pattern: "Greedy",
    trigger: ["can you reach the end?", "each element is max jump length", "reachability check"],
    coreIdea: "Track the farthest reachable index. If current index exceeds it, we're stuck — return False.",
    coreIdeaHinglish: "Ek 'reach' variable rakho — ab tak kitna door ja sakte ho. Har index pe check karo: agar index hi reach se aage nikal gaya, matlab wahan pahunche hi nahi — False. Nahi toh reach update karo.",
    approach: [
      "reach = 0",
      "For i in range(len(nums)): if i > reach: return False",
      "reach = max(reach, i + nums[i])",
      "Return True"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "Check i > reach BEFORE updating (can't stand on an unreachable index)",
      "reach = i + nums[i], not nums[i] alone",
      "No need to check reach >= n-1 separately — the loop handles it"
    ],
    code: `reach = 0
for i in range(len(nums)):
    if i > reach:
        return False
    reach = max(reach, i + nums[i])
return True`,
    variants: ["Jump Game II (LC 45)", "Jump Game III (LC 1306)"]
  },
  {
    id: 134,
    name: "Gas Station",
    difficulty: "Medium",
    pattern: "Greedy",
    trigger: ["circular route feasibility", "net gain/loss per stop", "can you complete the circuit?"],
    coreIdea: "If total gas < total cost, impossible. Otherwise a unique valid start exists: reset start whenever running tank goes negative.",
    coreIdeaHinglish: "Pehle check karo total gas >= total cost — nahi hai toh -1. Hai toh ek valid start zaroor milega. Running tank negative ho jaye toh start ko agle station pe reset karo aur tank zero karo.",
    approach: [
      "If sum(gas) < sum(cost): return -1",
      "tank = 0, start = 0",
      "For i: tank += gas[i] - cost[i]",
      "If tank < 0: start = i+1; tank = 0",
      "Return start"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "Check total feasibility first — if net negative, no start works",
      "When resetting, set tank = 0 (don't carry the negative leftover)",
      "You don't need to verify the found start — the feasibility check guarantees it's correct"
    ],
    code: `if sum(gas) < sum(cost):
    return -1
tank = start = 0
for i in range(len(gas)):
    tank += gas[i] - cost[i]
    if tank < 0:
        start = i + 1
        tank = 0
return start`,
    variants: ["Jump Game (LC 55)", "Minimum Cost to Complete a Trip (LC 2187)"]
  },
  {
    id: 45,
    name: "Jump Game II",
    difficulty: "Medium",
    pattern: "Greedy",
    trigger: ["minimum jumps to reach end", "fewest steps with BFS-level sweep"],
    coreIdea: "Maintain current jump boundary (curEnd) and farthest reachable. Increment jumps only when forced to cross to the next level.",
    coreIdeaHinglish: "Ek 'curEnd' aur 'farthest' tracker rakho. Jab current index curEnd pe pahunche, ek jump use hua — jumps++ aur curEnd ko farthest pe le jao. Greedy: har jump mein maximum coverage lo.",
    approach: [
      "jumps = curEnd = farthest = 0",
      "For i in range(len(nums)-1): farthest = max(farthest, i + nums[i])",
      "If i == curEnd: jumps++; curEnd = farthest",
      "Return jumps"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "Loop to len(nums)-1 (not len), to avoid counting a phantom jump past the end",
      "Increment jumps only when i == curEnd, not every step",
      "farthest is max reachable anywhere; curEnd is boundary of the current jump level"
    ],
    code: `jumps = curEnd = farthest = 0
for i in range(len(nums) - 1):
    farthest = max(farthest, i + nums[i])
    if i == curEnd:
        jumps += 1
        curEnd = farthest
return jumps`,
    variants: ["Jump Game (LC 55)", "Jump Game III (LC 1306)"]
  },
  {
    id: 846,
    name: "Hand of Straights",
    difficulty: "Medium",
    pattern: "Greedy",
    trigger: ["group cards into consecutive sequences of size W", "can you rearrange into straights?"],
    coreIdea: "Sort unique card values. For the smallest unplaced card, force-consume W consecutive cards by its count. Fail if any consecutive slot is missing.",
    coreIdeaHinglish: "Cards ko sort karo. Sabse chhote unplaced card se W consecutive cards ki group banao — count ke hisaab se. Counter se ghataao. Koi card count mein nahi? False.",
    approach: [
      "If len(hand) % W != 0: return False",
      "cnt = Counter(hand)",
      "For k in sorted(cnt): if cnt[k] > 0: n = cnt[k]; for i in 0..W-1: if cnt[k+i] < n: return False; cnt[k+i] -= n",
      "Return True"
    ],
    time: "O(n log n)", space: "O(n)",
    pitfalls: [
      "Early check: total cards not divisible by W means impossible",
      "Process keys in sorted order — must start with smallest unplaced",
      "Subtract cnt[k] from each of the W consecutive slots (not just 1 at a time)"
    ],
    code: `from collections import Counter
if len(hand) % W: return False
cnt = Counter(hand)
for k in sorted(cnt):
    if cnt[k] > 0:
        n = cnt[k]
        for i in range(W):
            if cnt[k+i] < n: return False
            cnt[k+i] -= n
return True`,
    variants: ["Divide Array in Sets of K Consecutive Numbers (LC 1296)", "Task Scheduler (LC 621)"]
  },
  {
    id: 1899,
    name: "Merge Triplets to Form Target Triplet",
    difficulty: "Medium",
    pattern: "Greedy",
    trigger: ["element-wise max merge to reach target", "select subset of triplets", "filter then union"],
    coreIdea: "Skip any triplet where any element exceeds the target's corresponding value (it corrupts the result). Union valid triplets element-wise (take max). Check if result equals target.",
    coreIdeaHinglish: "Koi bhi triplet jiska koi element target se bada ho, use skip karo — woh target bigad dega. Baaki valid triplets ko merge karo (element-wise max). End mein check karo result == target.",
    approach: [
      "res = [0, 0, 0]; a, b, c = target",
      "For each triplet [x, y, z]: if x > a or y > b or z > c: skip",
      "Else: res[i] = max(res[i], triplet[i]) for i in 0..2",
      "Return res == [a, b, c]"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "Filter BEFORE merging — a triplet exceeding target in any dimension is useless",
      "Merging is element-wise max, not addition or overwrite",
      "res starts as [0,0,0] — if no valid triplet covers a dimension, answer is False"
    ],
    code: `res = [0, 0, 0]
a, b, c = target
for x, y, z in triplets:
    if x > a or y > b or z > c:
        continue
    res[0] = max(res[0], x)
    res[1] = max(res[1], y)
    res[2] = max(res[2], z)
return res == [a, b, c]`,
    variants: ["Maximum AND Sum of Array (LC 2172)"]
  },
  {
    id: 763,
    name: "Partition Labels",
    difficulty: "Medium",
    pattern: "Greedy",
    trigger: ["partition string so each letter appears in at most one part", "last-occurrence boundary expansion"],
    coreIdea: "Precompute each char's last index. Sweep, extending current partition's end to the last occurrence of each char seen. Emit partition size when index reaches end.",
    coreIdeaHinglish: "Har character ki last position yaad rakho. Sweep karo — jab bhi koi char mile, current partition ki end ko us char ki last occurrence tak extend karo. Jab current index end pe pahunche, partition daalo aur naya shuru karo.",
    approach: [
      "last = {c: i for i, c in enumerate(s)} (keeps rightmost — correct)",
      "start = end = 0, result = []",
      "For i, c in enumerate(s): end = max(end, last[c])",
      "If i == end: result.append(end - start + 1); start = i + 1",
      "Return result"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "Dict comprehension naturally overwrites to rightmost index — that's correct, don't second-guess it",
      "After emitting partition: start = i+1 (not i)",
      "Partition size is end - start + 1"
    ],
    code: `last = {c: i for i, c in enumerate(s)}
res = []
start = end = 0
for i, c in enumerate(s):
    end = max(end, last[c])
    if i == end:
        res.append(end - start + 1)
        start = i + 1
return res`,
    variants: ["Non-overlapping Intervals (LC 435)", "Merge Intervals (LC 56)"]
  },
  {
    id: 678,
    name: "Valid Parenthesis String",
    difficulty: "Medium",
    pattern: "Greedy",
    trigger: ["'*' as wildcard for '(' or ')' or empty", "valid parens with flexible chars"],
    coreIdea: "Track range [lo, hi] of possible open-paren counts. '*' fans the range (lo--, hi++). Clamp lo to 0. hi < 0 means impossible. Return lo == 0.",
    coreIdeaHinglish: "lo aur hi — possible open parens ki min aur max range track karo. '(' pe dono badhao, ')' pe dono ghataao, '*' pe lo ghataao aur hi badhao. Hi 0 se neeche gaya? Impossible. lo ko 0 se neeche kabhi mat jaane do. End mein lo == 0 chahiye.",
    approach: [
      "lo = hi = 0",
      "For c in s: '(' → lo++, hi++; ')' → lo--, hi--; '*' → lo--, hi++",
      "If hi < 0: return False",
      "lo = max(lo, 0)",
      "Return lo == 0"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "lo can go negative when '*' acts as ')' — clamp to 0",
      "hi < 0 means even the best case has unmatched ')' — return False immediately",
      "Return lo == 0 (minimum unmatched opens), not hi == 0"
    ],
    code: `lo = hi = 0
for c in s:
    if c == '(':   lo += 1; hi += 1
    elif c == ')': lo -= 1; hi -= 1
    else:          lo -= 1; hi += 1
    if hi < 0: return False
    lo = max(lo, 0)
return lo == 0`,
    variants: ["Valid Parentheses (LC 20)", "Minimum Add to Make Parentheses Valid (LC 921)"]
  },

  /* ── Math & Geometry ─────────────────────────────────────── */
  {
    id: 48,
    name: "Rotate Image",
    difficulty: "Medium",
    pattern: "Math & Geometry",
    trigger: ["rotate matrix 90 degrees clockwise in-place", "no extra space matrix rotation"],
    coreIdea: "Transpose (swap matrix[i][j] with matrix[j][i] for i < j), then reverse each row.",
    coreIdeaHinglish: "Pehle matrix ko transpose karo — rows ko columns banao (sirf upper triangle swap karo). Phir har row ko reverse karo. Done — 90 degree clockwise rotation ho gayi.",
    approach: [
      "Transpose: for i in range(n): for j in range(i+1, n): swap matrix[i][j] and matrix[j][i]",
      "Reverse each row: for row in matrix: row.reverse()"
    ],
    time: "O(n²)", space: "O(1)",
    pitfalls: [
      "Transpose only upper triangle (j starts from i+1, not 0) — full matrix swap undoes itself",
      "Reverse rows AFTER transpose, not before (before gives counter-clockwise)",
      "Counter-clockwise: reverse each row first, then transpose"
    ],
    code: `n = len(matrix)
for i in range(n):
    for j in range(i + 1, n):
        matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
for row in matrix:
    row.reverse()`,
    variants: ["Spiral Matrix (LC 54)", "Transpose Matrix (LC 867)"]
  },
  {
    id: 54,
    name: "Spiral Matrix",
    difficulty: "Medium",
    pattern: "Math & Geometry",
    trigger: ["traverse matrix in spiral order", "layer-by-layer traversal", "output all elements in clockwise spiral"],
    coreIdea: "Maintain four shrinking boundaries (top, bottom, left, right). Peel one direction at a time, shrinking the boundary after each pass.",
    coreIdeaHinglish: "Char boundaries rakho: top, bottom, left, right. Ek-ek direction mein traverse karo — left→right, top→bottom, right→left, bottom→top. Har direction ke baad boundary shrink karo. Guard conditions lagao jab single row/col bachi ho.",
    approach: [
      "top=left=0, bottom=rows-1, right=cols-1, res=[]",
      "While top<=bottom and left<=right:",
      "  L→R along top row; top++",
      "  Top→bottom along right col; right--",
      "  If top<=bottom: R→L along bottom row; bottom--",
      "  If left<=right: Bottom→top along left col; left++"
    ],
    time: "O(m·n)", space: "O(1)",
    pitfalls: [
      "Check top<=bottom before traversing bottom row (duplicate elements on single-row case)",
      "Check left<=right before traversing left column (duplicate on single-col case)",
      "Shrink boundary immediately after traversing that edge"
    ],
    code: `res = []
top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1
while top <= bottom and left <= right:
    for c in range(left, right+1): res.append(matrix[top][c])
    top += 1
    for r in range(top, bottom+1): res.append(matrix[r][right])
    right -= 1
    if top <= bottom:
        for c in range(right, left-1, -1): res.append(matrix[bottom][c])
        bottom -= 1
    if left <= right:
        for r in range(bottom, top-1, -1): res.append(matrix[r][left])
        left += 1
return res`,
    variants: ["Rotate Image (LC 48)", "Spiral Matrix II (LC 59)"]
  },
  {
    id: 73,
    name: "Set Matrix Zeroes",
    difficulty: "Medium",
    pattern: "Math & Geometry",
    trigger: ["zero out entire row and column when a cell is zero", "in-place matrix modification without extra space"],
    coreIdea: "Use first row and first column as zero-markers. Scan the interior, mark; then apply markers; handle first row/col separately.",
    coreIdeaHinglish: "First row aur first column ko markers ki jagah use karo — unka khud ka state pehle note karo. Interior scan karo, markers set karo. Markers se rows/cols zero karo. Last mein first row/col ko fix karo.",
    approach: [
      "Note row0 = any zero in row 0, col0 = any zero in col 0",
      "Scan interior [1:][1:]: if zero, set matrix[r][0] = matrix[0][c] = 0",
      "Zero interior rows using col-0 markers; zero interior cols using row-0 markers",
      "Apply row0 and col0 flags to first row and first column"
    ],
    time: "O(m·n)", space: "O(1)",
    pitfalls: [
      "Record row0/col0 BEFORE overwriting them as markers (they serve dual duty)",
      "Process interior first, then apply markers (not simultaneously — avoids cascading zeros)",
      "Handle first row and first column as separate final steps"
    ],
    code: `r0 = 0 in matrix[0]
c0 = any(r[0] == 0 for r in matrix)
for r in range(1, len(matrix)):
    for c in range(1, len(matrix[0])):
        if matrix[r][c] == 0:
            matrix[r][0] = matrix[0][c] = 0
for r in range(1, len(matrix)):
    if matrix[r][0] == 0:
        for c in range(1, len(matrix[0])): matrix[r][c] = 0
for c in range(1, len(matrix[0])):
    if matrix[0][c] == 0:
        for r in range(1, len(matrix)): matrix[r][c] = 0
if r0: matrix[0] = [0] * len(matrix[0])
if c0:
    for r in matrix: r[0] = 0`,
    variants: ["Game of Life (LC 289)", "Rotate Image (LC 48)"]
  },
  {
    id: 202,
    name: "Happy Number",
    difficulty: "Easy",
    pattern: "Math & Geometry",
    trigger: ["sum of squares of digits repeatedly", "detect cycle in number transformation"],
    coreIdea: "Compute digit-square sum with slow/fast pointers. If we hit 1, happy. If slow meets fast in a cycle, not happy.",
    coreIdeaHinglish: "Digit-square sum nikalo slow aur fast pointer se. Fast pointer do steps, slow ek step. Agar 1 pe pahuncho — happy. Slow aur fast mile bina 1 ke — cycle hai, not happy.",
    approach: [
      "def sq(n): return sum(int(d)**2 for d in str(n))",
      "slow = n, fast = sq(n)",
      "While fast != 1 and slow != fast: slow = sq(slow); fast = sq(sq(fast))",
      "Return fast == 1"
    ],
    time: "O(log n)", space: "O(1)",
    pitfalls: [
      "Without cycle detection, non-happy numbers loop forever",
      "Floyd's two-pointer works; alternatively a seen-set is simpler but O(k) space",
      "Digit extraction: sum(int(d)**2 for d in str(n)) is clean and readable"
    ],
    code: `def sq(n):
    return sum(int(d)**2 for d in str(n))
slow, fast = n, sq(n)
while fast != 1 and slow != fast:
    slow = sq(slow)
    fast = sq(sq(fast))
return fast == 1`,
    variants: ["Linked List Cycle (LC 141)", "Ugly Number (LC 263)"]
  },
  {
    id: 50,
    name: "Pow(x, n)",
    difficulty: "Medium",
    pattern: "Math & Geometry",
    trigger: ["fast exponentiation", "binary exponentiation", "implement x^n in O(log n)"],
    coreIdea: "Binary exponentiation: if n even, square x and halve n; if n odd, pull out one x and subtract 1. Handle negative n by inverting x.",
    coreIdeaHinglish: "n ko adha karte jao. n even ho toh x ko square karo, n ko half karo. n odd ho toh ek x multiply karo aur n ko even banao. Negative n ke liye 1/x se karo aur n ko positive karo.",
    approach: [
      "If n < 0: return myPow(1/x, -n)",
      "If n == 0: return 1",
      "If n % 2 == 0: return myPow(x*x, n//2)",
      "Return x * myPow(x, n-1)"
    ],
    time: "O(log n)", space: "O(log n)",
    pitfalls: [
      "Handle negative n first (x^-n = 1/x^n)",
      "n odd: multiply by x then recurse with n-1 (cleanest), or use n//2 with x * myPow(x*x, n//2)",
      "Python has no 32-bit overflow issues; other languages need long"
    ],
    code: `def myPow(x, n):
    if n < 0: return myPow(1/x, -n)
    if n == 0: return 1
    if n % 2 == 0:
        return myPow(x * x, n // 2)
    return x * myPow(x, n - 1)`,
    variants: ["Sqrt(x) (LC 69)", "Super Pow (LC 372)"]
  },
  {
    id: 43,
    name: "Multiply Strings",
    difficulty: "Medium",
    pattern: "Math & Geometry",
    trigger: ["multiply large numbers stored as strings", "grade-school multiplication", "no BigInteger"],
    coreIdea: "Simulate grade-school: digit num1[i] × num2[j] contributes to result positions i+j and i+j+1. Sum contributions, propagate carries, strip leading zeros.",
    coreIdeaHinglish: "Grade-school multiplication simulate karo. num1[i] aur num2[j] ka product result ke i+j+1 position pe jaata hai, carry i+j pe jaati hai. Sab positions fill karo, phir leading zeros strip karo.",
    approach: [
      "res = [0] * (len(num1) + len(num2))",
      "For i reverse(num1), j reverse(num2): mul = d1*d2; p1=i+j, p2=i+j+1; s=mul+res[p2]; res[p2]=s%10; res[p1]+=s//10",
      "Return ''.join(map(str, res)).lstrip('0') or '0'"
    ],
    time: "O(m·n)", space: "O(m+n)",
    pitfalls: [
      "Index: i-th digit from end of num1 × j-th digit from end of num2 → position i+j+1 (not i+j)",
      "Strip leading zeros with lstrip('0'), but guard against empty string with or '0'",
      "Iterate in reverse so index 0 = rightmost digit"
    ],
    code: `m, n = len(num1), len(num2)
res = [0] * (m + n)
for i in range(m-1, -1, -1):
    for j in range(n-1, -1, -1):
        mul = int(num1[i]) * int(num2[j])
        p1, p2 = i+j, i+j+1
        s = mul + res[p2]
        res[p2] = s % 10
        res[p1] += s // 10
return ''.join(map(str, res)).lstrip('0') or '0'`,
    variants: ["Add Strings (LC 415)", "Pow(x, n) (LC 50)"]
  },
  {
    id: 66,
    name: "Plus One",
    difficulty: "Easy",
    pattern: "Math & Geometry",
    trigger: ["increment number represented as digit array", "carry propagation", "all-9 edge case"],
    coreIdea: "Traverse from right. If digit < 9, increment and return early. If 9, set to 0 and continue left. If all digits were 9, prepend 1.",
    coreIdeaHinglish: "Right se left iterate karo. Agar digit 9 se chhota hai, seedha +1 karo aur return karo. Agar 9 hai, 0 karo aur carry aage le jao. Sab 9 the? [1] + digits prepend karo.",
    approach: [
      "For i in range(len(digits)-1, -1, -1): if digits[i] < 9: digits[i]++; return digits",
      "digits[i] = 0 (carry continues)",
      "Return [1] + digits (all nines case)"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "Return inside the loop as soon as carry stops — don't keep going",
      "All-9 case: array becomes all zeros, prepend 1",
      "The [1] + digits at the end only runs when ALL digits were 9"
    ],
    code: `for i in range(len(digits) - 1, -1, -1):
    if digits[i] < 9:
        digits[i] += 1
        return digits
    digits[i] = 0
return [1] + digits`,
    variants: ["Add Binary (LC 67)", "Add Strings (LC 415)"]
  },
  {
    id: 2013,
    name: "Detect Squares",
    difficulty: "Medium",
    pattern: "Math & Geometry",
    trigger: ["count axis-aligned squares from a point set", "online add/count operations on points"],
    coreIdea: "For query (px, py): iterate all points sharing py as a potential diagonal corner. For each (x, py) where x ≠ px, the two missing corners are (px, py±side) and (x, py±side). Multiply their counts.",
    coreIdeaHinglish: "Query (px, py) ke liye: same y wale saare points ko diagonal corner maano. Har aise (x, py) ke liye side = |x - px|. Baaki do corners (px, py±side) aur (x, py±side) count karo aur multiply karo.",
    approach: [
      "cnt = Counter of (x,y) tuples; pts_by_y = {y: list of x values}",
      "add(x, y): cnt[(x,y)]++; pts_by_y[y].append(x)",
      "count(px, py): for x in pts_by_y[py] (x != px): side = abs(x-px); for y in [py+side, py-side]: ans += cnt[(x,py)] * cnt[(px,y)] * cnt[(x,y)]"
    ],
    time: "O(n) per query", space: "O(n)",
    pitfalls: [
      "Skip diagonal corner where x == px (degenerate — not a square)",
      "Check both above and below the query row (py+side and py-side)",
      "Multiply all three corner counts — not checking both corners means missing valid squares"
    ],
    code: `from collections import defaultdict
cnt = defaultdict(int)
pby = defaultdict(list)

def add(x, y):
    cnt[(x,y)] += 1; pby[y].append(x)

def count(px, py):
    ans = 0
    for x in pby[py]:
        if x == px: continue
        side = abs(x - px)
        for y in [py+side, py-side]:
            ans += cnt[(x,py)] * cnt[(px,y)] * cnt[(x,y)]
    return ans`,
    variants: ["Valid Square (LC 593)", "Count Lattice Points Inside a Circle (LC 2249)"]
  },

  /* ── Bit Manipulation ────────────────────────────────────── */
  {
    id: 191,
    name: "Number of 1 Bits",
    difficulty: "Easy",
    pattern: "Bit Manipulation",
    trigger: ["count set bits", "Hamming weight", "popcount"],
    coreIdea: "n & (n-1) clears the lowest set bit. Count how many operations until n == 0.",
    coreIdeaHinglish: "n & (n-1) sabse neeche wala set bit clear karta hai. Jab tak n != 0 yahi karte raho aur count badhate raho. Simple aur fast.",
    approach: [
      "count = 0",
      "While n: n &= n-1; count++",
      "Return count"
    ],
    time: "O(k) where k = set bits", space: "O(1)",
    pitfalls: [
      "n &= (n-1) is much faster than n &= 1 + right-shift (skips zero bits entirely)",
      "Python ints are arbitrary precision — no unsigned 32-bit issue",
      "bin(n).count('1') works too, but the bit-trick is what interviewers want to see"
    ],
    code: `count = 0
while n:
    n &= n - 1
    count += 1
return count`,
    variants: ["Counting Bits (LC 338)", "Hamming Distance (LC 461)"]
  },
  {
    id: 338,
    name: "Counting Bits",
    difficulty: "Easy",
    pattern: "Bit Manipulation",
    trigger: ["count set bits for every number 0..n", "DP on bit patterns", "popcount array in O(n)"],
    coreIdea: "dp[i] = dp[i >> 1] + (i & 1). Right-shifting drops the LSB; the remainder tells us if there's one extra set bit.",
    coreIdeaHinglish: "dp[i] = dp[i >> 1] + (i & 1). i ko right shift karo — ek bit drop ho gaya. Agar i odd tha toh +1, otherwise +0. Linear time mein 0 se n tak sab set-bit counts nikal aate hain.",
    approach: [
      "dp = [0] * (n+1)",
      "For i in 1..n: dp[i] = dp[i >> 1] + (i & 1)",
      "Return dp"
    ],
    time: "O(n)", space: "O(n)",
    pitfalls: [
      "dp[0] = 0 base case (0 has no set bits)",
      "i >> 1 not i - 1 — we're exploiting bit structure, not adjacent values",
      "Works because i >> 1 always has a precomputed answer (it's smaller than i)"
    ],
    code: `dp = [0] * (n + 1)
for i in range(1, n + 1):
    dp[i] = dp[i >> 1] + (i & 1)
return dp`,
    variants: ["Number of 1 Bits (LC 191)", "Sum of All Subsets XOR Totals (LC 1863)"]
  },
  {
    id: 190,
    name: "Reverse Bits",
    difficulty: "Easy",
    pattern: "Bit Manipulation",
    trigger: ["reverse all 32 bits of an unsigned integer", "bit reversal"],
    coreIdea: "Build result by extracting the LSB of n (n & 1) and OR-ing it into the left-shifted result. Repeat 32 times.",
    coreIdeaHinglish: "32 baar loop karo. Har baar result ko left shift karo aur n ka LSB OR karo. n ko right shift karo. Exactly 32 iterations — leading zeros bhi matter karte hain.",
    approach: [
      "result = 0",
      "For _ in range(32): result = (result << 1) | (n & 1); n >>= 1",
      "Return result"
    ],
    time: "O(1) — exactly 32 iters", space: "O(1)",
    pitfalls: [
      "Always loop exactly 32 times (even after n becomes 0 — leading zeros matter in output)",
      "Shift result left FIRST, then OR the new bit (not the other way around)",
      "Python: mask result with 0xFFFFFFFF if unsigned 32-bit output is required"
    ],
    code: `result = 0
for _ in range(32):
    result = (result << 1) | (n & 1)
    n >>= 1
return result`,
    variants: ["Number of 1 Bits (LC 191)", "Bitwise AND of Numbers Range (LC 201)"]
  },
  {
    id: 268,
    name: "Missing Number",
    difficulty: "Easy",
    pattern: "Bit Manipulation",
    trigger: ["find missing number in 0..n", "XOR trick for missing element", "sum formula"],
    coreIdea: "XOR all indices 0..n with all array values. Numbers present cancel their index; the one missing index remains.",
    coreIdeaHinglish: "0 se n tak sab indices ko XOR karo, phir array ke saare values ko bhi XOR karo. Jo number dono mein hai woh cancel ho jaata hai — jo bacha woh missing number hai.",
    approach: [
      "missing = len(nums)  (starts with index n — not in enumerate)",
      "For i, v in enumerate(nums): missing ^= i ^ v",
      "Return missing"
    ],
    time: "O(n)", space: "O(1)",
    pitfalls: [
      "Initialize missing = n (not 0) — index n is never covered by enumerate",
      "XOR approach avoids overflow vs. sum formula in languages with fixed-width ints",
      "Alternatively: n*(n+1)//2 - sum(nums) — simpler but less impressive"
    ],
    code: `missing = len(nums)
for i, v in enumerate(nums):
    missing ^= i ^ v
return missing`,
    variants: ["Find the Duplicate Number (LC 287)", "Single Number (LC 136)"]
  },
  {
    id: 7,
    name: "Reverse Integer",
    difficulty: "Medium",
    pattern: "Bit Manipulation",
    trigger: ["reverse digits of a 32-bit signed integer", "handle integer overflow", "digit manipulation"],
    coreIdea: "Pop digits from right (n % 10) and push onto reversed. After full reversal, check 32-bit signed bounds and return 0 if out of range.",
    coreIdeaHinglish: "n % 10 se ek-ek digit nikalo aur rev = rev * 10 + digit se build karo. n //= 10 karte jao. Jab n == 0 ruk jao. Phir check karo — 32-bit range se bahar hai? Toh 0 return karo.",
    approach: [
      "sign = 1 if x >= 0 else -1; x = abs(x)",
      "rev = 0",
      "While x: rev = rev * 10 + x % 10; x //= 10",
      "rev *= sign; return rev if -(2**31) <= rev <= 2**31-1 else 0"
    ],
    time: "O(log x)", space: "O(1)",
    pitfalls: [
      "Check 32-bit overflow AFTER building the full reversed number",
      "Abs() trick simplifies mod handling for negatives in Python",
      "Don't forget the sign when returning"
    ],
    code: `sign = 1 if x >= 0 else -1
x = abs(x)
rev = 0
while x:
    rev = rev * 10 + x % 10
    x //= 10
rev *= sign
return rev if -(2**31) <= rev <= 2**31 - 1 else 0`,
    variants: ["Palindrome Number (LC 9)", "Reverse Integer — follow-up: no string conversion"]
  },
  {
    id: 371,
    name: "Sum of Two Integers",
    difficulty: "Medium",
    pattern: "Bit Manipulation",
    trigger: ["add without + or - operators", "simulate addition with XOR and AND", "carry propagation via bits"],
    coreIdea: "XOR gives sum without carry. AND << 1 gives the carry. Loop until carry is zero. In Python, mask to 32 bits to handle overflow simulation.",
    coreIdeaHinglish: "XOR se carry ke bina sum nikalte hain. AND << 1 se carry milta hai. Carry ko sum mein add karte rehte hain jab tak carry 0 na ho. Python mein 32-bit mask lagani padegi warna infinite loop.",
    approach: [
      "mask = 0xFFFFFFFF",
      "While b & mask: a, b = a ^ b, (a & b) << 1",
      "Return a if a <= 0x7FFFFFFF else ~(a ^ mask)"
    ],
    time: "O(1)", space: "O(1)",
    pitfalls: [
      "Python integers are unbounded — must mask to 32-bit to simulate carry overflow correctly",
      "After loop, convert from two's complement if bit 31 is set (negative result)",
      "b holds the carry; loop until carry is 0"
    ],
    code: `mask = 0xFFFFFFFF
while b & mask:
    a, b = a ^ b, (a & b) << 1
if b == 0:
    return a
return ~(a ^ mask)`,
    variants: ["Number of 1 Bits (LC 191)", "Missing Number (LC 268)"]
  },
  {
    id: 89,
    name: "Gray Code",
    difficulty: "Medium",
    pattern: "Bit Manipulation",
    trigger: ["Gray code sequence", "consecutive integers differ by exactly one bit", "generate n-bit Gray code"],
    coreIdea: "The i-th Gray code is simply i ^ (i >> 1). No complex generation needed.",
    coreIdeaHinglish: "i-th Gray code = i XOR (i right shift 1). Formula yaad karo. 0 se 2^n - 1 tak generate karo — consecutive elements exactly ek bit se differ karte hain.",
    approach: [
      "Return [i ^ (i >> 1) for i in range(1 << n)]"
    ],
    time: "O(2^n)", space: "O(2^n)",
    pitfalls: [
      "Formula is i ^ (i >> 1) — memorize it, don't derive under pressure",
      "Result has 2^n elements starting with 0",
      "Sequence wraps around: last and first element also differ by exactly 1 bit"
    ],
    code: `return [i ^ (i >> 1) for i in range(1 << n)]`,
    variants: ["Number of 1 Bits (LC 191)", "Minimum Number of Operations to Make Array Continuous (LC 2009)"]
  },
  {
    id: 137,
    name: "Single Number II",
    difficulty: "Medium",
    pattern: "Bit Manipulation",
    trigger: ["every element appears 3 times except one", "find the unique element with mod-3 bit counting"],
    coreIdea: "For each of 32 bit positions, count how many numbers have that bit set and take mod 3. Remaining bits reconstruct the unique number.",
    coreIdeaHinglish: "Har bit position ke liye saare numbers ke bits ko sum karo. Sum % 3 lo — tripled numbers cancel out. Jo bacha woh unique number ka bit hai. Saare 32 positions ke results reconstruct karo.",
    approach: [
      "result = 0",
      "For bit in range(32): total = sum((n >> bit) & 1 for n in nums) % 3; result |= total << bit",
      "Handle Python negative: if result >= 2^31: result -= 2^32",
      "Return result"
    ],
    time: "O(32n) = O(n)", space: "O(1)",
    pitfalls: [
      "Works because 3k mod 3 = 0 — any tripled number's contribution cancels out",
      "Python: if bit 31 is set, convert from two's complement (subtract 2^32)",
      "Alternative: ones/twos bitmask trick is O(n) in one pass but harder to recall"
    ],
    code: `result = 0
for bit in range(32):
    total = sum((n >> bit) & 1 for n in nums) % 3
    result |= total << bit
if result >= (1 << 31):
    result -= (1 << 32)
return result`,
    variants: ["Single Number (LC 136)", "Single Number III (LC 260)"]
  }
];
