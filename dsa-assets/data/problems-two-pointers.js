// Two Pointers — 7 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 15,
    "name": "3Sum",
    "difficulty": "Medium",
    "pattern": "Two Pointers",
    "trigger": [
      "all unique triplets summing to zero",
      "fix one element + two-pointer on the rest"
    ],
    "coreIdea": "Sort, then fix nums[i] with an outer loop and two-pointer the remaining window. Skip duplicates at all three levels to avoid repeated triplets.",
    "coreIdeaHinglish": "Sort karo. Ek element fix karo outer loop se. Baaki do ke liye two pointers. Duplicates teeno jagah skip karo — i pe, left pe, aur right pe.",
    "approach": [
      "Sort nums",
      "For i: if nums[i] > 0: break; if duplicate: skip",
      "left = i+1, right = n-1; two-pointer searching for -nums[i]",
      "On match: skip equal neighbors before moving both pointers"
    ],
    "time": "O(n²)",
    "space": "O(1) extra",
    "pitfalls": [
      "Skip duplicates for i (if i>0 and nums[i]==nums[i-1]: continue)",
      "After a match, skip duplicates for BOTH left and right before advancing them",
      "nums[i] > 0 → break early (sorted, remaining elements can only be larger)"
    ],
    "code": "Arrays.sort(nums);\nList<List<Integer>> res = new ArrayList<>();\nfor (int i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] == nums[i-1]) continue;\n    int l = i+1, r = nums.length-1;\n    while (l < r) {\n        int sum = nums[i] + nums[l] + nums[r];\n        if (sum == 0) { res.add(Arrays.asList(nums[i], nums[l++], nums[r--])); while (l<r && nums[l]==nums[l-1]) l++; while (l<r && nums[r]==nums[r+1]) r--; }\n        else if (sum < 0) l++; else r--;\n    }\n}\nreturn res;",
    "variants": [
      "4Sum (LC 18)",
      "3Sum Closest (LC 16)"
    ],
    "summary": "Find all unique triplets in an array whose three values sum to zero."
  },
  {
    "id": 11,
    "name": "Container With Most Water",
    "difficulty": "Medium",
    "pattern": "Two Pointers",
    "trigger": [
      "maximum area between two vertical lines in height array",
      "two pointers converging from ends"
    ],
    "coreIdea": "Two pointers at the ends. Area = min(h[l], h[r]) × (r-l). Always move the SHORTER side inward — moving the taller side can only shrink width without increasing the min height.",
    "coreIdeaHinglish": "Left aur right se start karo. Area = min height × width. Jo side chhoti hai usse andar la do — tall side ko move karne se area kabhi nahi badh sakta.",
    "approach": [
      "left = 0, right = n-1, ans = 0",
      "While left < right: ans = max(ans, min(h[l], h[r]) * (r-l))",
      "If h[l] < h[r]: left++ else: right--"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Move the SHORTER pointer — moving the taller one can't increase the area",
      "If heights equal, move either side (both are equally limiting)",
      "Don't confuse with Trapping Rain Water (LC 42) — different problem"
    ],
    "code": "int l = 0, r = height.length - 1, res = 0;\nwhile (l < r) {\n    res = Math.max(res, Math.min(height[l], height[r]) * (r - l));\n    if (height[l] < height[r]) l++; else r--;\n}\nreturn res;",
    "variants": [
      "Trapping Rain Water (LC 42)"
    ],
    "animation": "twoPointers",
    "summary": "Given heights of vertical lines, find two lines that together with the x-axis hold the most water."
  },
  {
    "id": 167,
    "name": "Two Sum II — Input Array Is Sorted",
    "difficulty": "Medium",
    "pattern": "Two Pointers",
    "trigger": [
      "two numbers summing to target in a SORTED array",
      "O(1) space — no hash map, leverage sorted order"
    ],
    "coreIdea": "Two pointers at start and end. Sum too small → move left right. Sum too large → move right left. Exactly one solution guaranteed.",
    "coreIdeaHinglish": "Array sorted hai isliye two pointer chalte hain. Sum chota? Left badao. Sum bada? Right ghatao. Ek hi solution hai, zaroor milega.",
    "approach": [
      "left = 0, right = n-1",
      "s = numbers[left] + numbers[right]",
      "If s == target: return [left+1, right+1]; elif s < target: left++; else: right--"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Return 1-indexed: [left+1, right+1]",
      "Same element can't be used twice — left < right always holds",
      "Don't use a hash map — problem specifically tests O(1) space"
    ],
    "code": "int l = 0, r = numbers.length - 1;\nwhile (l < r) {\n    int sum = numbers[l] + numbers[r];\n    if (sum == target) return new int[]{l+1, r+1};\n    if (sum < target) l++; else r--;\n}\nreturn new int[]{};",
    "variants": [
      "Two Sum (LC 1) — unsorted → hash map",
      "3Sum (LC 15)"
    ],
    "summary": "Find two numbers in a sorted array that sum to a target; return their 1-indexed positions."
  },
  {
    "id": 75,
    "name": "Sort Colors",
    "difficulty": "Medium",
    "pattern": "Two Pointers",
    "trigger": [
      "sort array of only 0, 1, 2 in-place, one pass",
      "Dutch National Flag algorithm"
    ],
    "coreIdea": "Three pointers: low, mid, high. mid scans left to right. 0 → swap with low, advance both. 2 → swap with high, shrink high (don't advance mid). 1 → advance mid only.",
    "coreIdeaHinglish": "Teen pointers: low, mid, high. 0 mila? low se swap, dono aage. 2 mila? high se swap, high peeche — mid wahi rahe (woh element abhi unprocessed hai). 1 mila? mid aage.",
    "approach": [
      "low = mid = 0, high = n-1",
      "While mid <= high: if nums[mid]==0: swap(low,mid), low++, mid++",
      "Elif nums[mid]==2: swap(mid,high), high--",
      "Else: mid++"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "On swap with high: DON'T advance mid — element swapped in from high is unprocessed",
      "On swap with low: advance BOTH — element from low is always 1 by invariant",
      "Loop condition: mid <= high (not mid < high)"
    ],
    "code": "int lo = 0, mid = 0, hi = nums.length - 1;\nwhile (mid <= hi) {\n    if (nums[mid] == 0) { int t=nums[lo]; nums[lo]=nums[mid]; nums[mid]=t; lo++; mid++; }\n    else if (nums[mid] == 1) mid++;\n    else { int t=nums[mid]; nums[mid]=nums[hi]; nums[hi]=t; hi--; }\n}",
    "variants": [
      "Partition Array According to Given Pivot (LC 2161)"
    ],
    "summary": "Sort an array of 0s, 1s, and 2s in-place in a single pass without extra space."
  },
  {
    "id": 31,
    "name": "Next Permutation",
    "difficulty": "Medium",
    "pattern": "Two Pointers",
    "trigger": [
      "rearrange to next lexicographically larger permutation, in-place",
      "find rightmost descent, swap with next-greater, reverse suffix"
    ],
    "coreIdea": "Find the rightmost index i where nums[i] < nums[i+1]. Swap nums[i] with the smallest element to its right that's larger. Reverse everything after i.",
    "coreIdeaHinglish": "Right se wo jagah dhundo jahan nums[i] < nums[i+1]. Phir right me se nums[i] se bada sabse chhota element dhundo, swap karo. Phir right portion reverse karo.",
    "approach": [
      "i = n-2; scan right while nums[i] >= nums[i+1]",
      "If i >= 0: j = n-1; scan right while nums[j] <= nums[i]; swap i and j",
      "Reverse nums[i+1:]"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "If no descent (fully descending) → reverse whole array (last → first permutation)",
      "j scan goes right-to-left — nearest element > nums[i] from the right",
      "Reverse the suffix (don't sort) — it's already descending after the swap"
    ],
    "code": "int n=nums.length, i=n-2;\nwhile (i>=0 && nums[i]>=nums[i+1]) i--;\nif (i>=0) {\n    int j=n-1;\n    while (nums[j]<=nums[i]) j--;\n    int t=nums[i]; nums[i]=nums[j]; nums[j]=t;\n}\n// reverse from i+1 to end\nint l=i+1, r=n-1;\nwhile (l<r) { int t=nums[l]; nums[l]=nums[r]; nums[r]=t; l++; r--; }",
    "variants": [
      "Permutation Sequence (LC 60)",
      "Permutations (LC 46)"
    ],
    "summary": "Rearrange an array of digits to produce the next lexicographically greater permutation in-place."
  },
  {
    "id": 189,
    "name": "Rotate Array",
    "difficulty": "Medium",
    "pattern": "Two Pointers",
    "trigger": [
      "rotate array right by k steps, in-place, O(1) space",
      "three reverses"
    ],
    "coreIdea": "Three reverses: reverse all → reverse first k → reverse the rest. Net effect is a right rotation by k positions.",
    "coreIdeaHinglish": "Teen baar reverse karo — pehle pura array, phir pehle k elements, phir baaki. Teen reverse milke rotation deta hai. Extra array nahi chahiye.",
    "approach": [
      "k %= len(nums)",
      "Reverse all nums[0..n-1]",
      "Reverse nums[0..k-1]",
      "Reverse nums[k..n-1]"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "k %= n first — k > n would rotate past itself",
      "If k == 0 after mod: no-op (still correct)",
      "Slice assignment (nums[:] = ...) uses O(n) space; use in-place swap loop for strict O(1)"
    ],
    "code": "int n=nums.length; k%=n;\nreverse(nums,0,n-1); reverse(nums,0,k-1); reverse(nums,k,n-1);\n\nvoid reverse(int[] a, int l, int r) { while(l<r){int t=a[l];a[l]=a[r];a[r]=t;l++;r--;} }",
    "variants": [
      "Rotate List (LC 61)",
      "Rotate Image (LC 48)"
    ],
    "summary": "Rotate an array to the right by k steps in-place."
  },
  {
    "id": 5,
    "name": "Longest Palindromic Substring",
    "difficulty": "Medium",
    "pattern": "Two Pointers",
    "trigger": [
      "longest palindromic substring (contiguous, not subsequence)",
      "expand around center"
    ],
    "coreIdea": "Expand around each center. Two cases per index: odd-length (center at i) and even-length (center between i and i+1). Expand while characters match, track the longest.",
    "coreIdeaHinglish": "Har index ko center maan ke expand karo — odd aur even dono try karo. l aur r same hain? Dono bahar jao. Max expansion track karo.",
    "approach": [
      "For each i: try (l=i, r=i) for odd and (l=i, r=i+1) for even",
      "While l>=0 and r<n and s[l]==s[r]: if r-l+1 > len(res): res=s[l:r+1]; l--; r++"
    ],
    "time": "O(n²)",
    "space": "O(1)",
    "pitfalls": [
      "After expansion loop, palindrome is s[l+1:r] — l and r are one past the valid boundary",
      "Two separate expand calls per index (odd + even) — don't skip the even case",
      "Manacher's is O(n) but expand-around-center is accepted in interviews"
    ],
    "code": "int n=s.length(), res=0, resL=0;\nboolean expand(int l, int r){\n    while(l>=0&&r<n&&s.charAt(l)==s.charAt(r)){\n        if(r-l+1>res){ res=r-l+1; resL=l; } l--; r++;\n    }\n}\nfor(int i=0;i<n;i++){ expand(i,i); expand(i,i+1); }\nreturn s.substring(resL,resL+res);",
    "variants": [
      "Palindromic Substrings (LC 647) — count instead of longest",
      "Longest Palindromic Subsequence (LC 516)"
    ],
    "summary": "Find the longest palindromic substring in a given string."
  }
]);
