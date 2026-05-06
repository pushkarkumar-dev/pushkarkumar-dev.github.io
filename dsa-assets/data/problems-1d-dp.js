// 1-D DP — 12 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 70,
    "name": "Climbing Stairs",
    "difficulty": "Easy",
    "pattern": "1-D DP",
    "trigger": [
      "count ways to reach step n taking 1 or 2 steps at a time",
      "Fibonacci pattern"
    ],
    "coreIdea": "dp[i] = dp[i-1] + dp[i-2]. Ways to reach step i = ways via 1-step from i-1 + ways via 2-step from i-2.",
    "coreIdeaHinglish": "Step i pe pahunchne ke ways = step (i-1) se + step (i-2) se. Fibonacci series hi hai. O(1) space me solve ho jaata hai.",
    "approach": [
      "a, b = 1, 1 (base cases for n=1, n=2)",
      "For _ in range(n-1): a, b = b, a+b",
      "Return b"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "dp[1]=1, dp[2]=2 (not both 1) — two ways to reach step 2: (1+1) or (2)",
      "Space-optimize: only need last two values",
      "Classic warmup — the real skill is recognizing this pattern in harder problems"
    ],
    "code": "int a=1, b=1;\nfor(int i=2;i<=n;i++){ int c=a+b; a=b; b=c; }\nreturn n<=1?1:b;",
    "variants": [
      "House Robber (LC 198)",
      "Min Cost Climbing Stairs (LC 746)"
    ],
    "summary": "Given n stairs, count distinct ways to reach the top stepping 1 or 2 stairs at a time."
  },
  {
    "id": 198,
    "name": "House Robber",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "max sum of non-adjacent elements in an array",
      "can't pick two consecutive houses"
    ],
    "coreIdea": "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). At each house, decide: skip it (take dp[i-1]) or rob it (take dp[i-2] + current value).",
    "coreIdeaHinglish": "Har ghar pe choice: skip karo (dp[i-1] lo) ya rob karo (dp[i-2] + nums[i] lo). Space optimize karke sirf do values track karo.",
    "approach": [
      "prev2, prev1 = 0, 0",
      "For num: curr = max(prev1, prev2 + num); prev2 = prev1; prev1 = curr",
      "Return prev1"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "prev2 must be updated BEFORE prev1 in the rolling update",
      "Start with prev2=prev1=0 (empty prefix has 0 profit)",
      "dp[i] does NOT mean 'must rob house i' — it's the max up to house i"
    ],
    "code": "int prev2=0, prev1=0;\nfor(int n:nums){ int cur=Math.max(prev1,prev2+n); prev2=prev1; prev1=cur; }\nreturn prev1;",
    "variants": [
      "House Robber II (LC 213) — circular",
      "Delete and Earn (LC 740)"
    ],
    "animation": "dp1d",
    "summary": "Given a row of houses with non-negative values, find the maximum amount you can rob without robbing two adjacent houses."
  },
  {
    "id": 213,
    "name": "House Robber II",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "house robber but houses arranged in a circle (first and last are adjacent)"
    ],
    "coreIdea": "Run House Robber twice: once on nums[0:-1] (exclude last), once on nums[1:] (exclude first). Take the max. The first/last adjacency is broken by excluding one of them.",
    "coreIdeaHinglish": "Circular constraint handle karne ke liye do runs: ek pehle ko exclude karke, ek aakhir ko exclude karke. Dono ka max lo.",
    "approach": [
      "def rob(arr): standard House Robber I",
      "Return max(rob(nums[:-1]), rob(nums[1:])) if len > 1 else nums[0]"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Handle n==1 separately (single house, just return nums[0])",
      "Two independent runs — don't try to track both cases simultaneously",
      "First/last can NEVER both be robbed — one of the two runs always excludes one of them"
    ],
    "code": "if(nums.length==1) return nums[0];\nint rob(int[] a){\n    int prev2=0,prev1=0;\n    for(int n:a){ int c=Math.max(prev1,prev2+n); prev2=prev1; prev1=c; }\n    return prev1;\n}\nreturn Math.max(rob(Arrays.copyOfRange(nums,0,nums.length-1)), rob(Arrays.copyOfRange(nums,1,nums.length)));",
    "variants": [
      "House Robber (LC 198)",
      "House Robber III (LC 337) — on tree"
    ],
    "summary": "Same as House Robber but the houses form a circle — the first and last are adjacent."
  },
  {
    "id": 322,
    "name": "Coin Change",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "minimum number of coins to make amount",
      "unbounded knapsack (coins reusable)"
    ],
    "coreIdea": "dp[i] = min coins to make amount i. For each amount, try each coin: dp[i] = min(dp[i], dp[i-coin]+1). Build bottom-up from 0 to amount.",
    "coreIdeaHinglish": "dp[i] = amount i banane ke liye minimum coins. Har amount ke liye har coin try karo. dp[i] = min(dp[i], dp[i-coin] + 1). Bottom-up.",
    "approach": [
      "dp = [inf]*(amount+1); dp[0]=0",
      "For i in 1..amount: for coin: if coin<=i: dp[i]=min(dp[i], dp[i-coin]+1)",
      "Return dp[amount] if != inf else -1"
    ],
    "time": "O(amount × n)",
    "space": "O(amount)",
    "pitfalls": [
      "Initialize dp[0]=0, rest=inf (not -1 — you need inf for min operation)",
      "Return -1 if dp[amount] is still inf at the end",
      "Both loop orders work (coin-outer or amount-outer) for unbounded"
    ],
    "code": "int[] dp=new int[amount+1]; Arrays.fill(dp,amount+1); dp[0]=0;\nfor(int c:coins) for(int a=c;a<=amount;a++) dp[a]=Math.min(dp[a],dp[a-c]+1);\nreturn dp[amount]>amount ? -1 : dp[amount];",
    "variants": [
      "Coin Change II (LC 518) — count ways",
      "Perfect Squares (LC 279)"
    ],
    "summary": "Given coin denominations and an amount, find the fewest coins needed to make that amount, or -1 if impossible."
  },
  {
    "id": 300,
    "name": "Longest Increasing Subsequence",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "length of longest strictly increasing subsequence",
      "O(n log n) patience sorting, or O(n²) DP"
    ],
    "coreIdea": "DP: dp[i] = LIS ending at index i. For each i, scan j < i: if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j]+1). O(n²). O(n log n): maintain a 'tails' array with binary search.",
    "coreIdeaHinglish": "dp[i] = index i pe khatam hone wali LIS ki length. j < i: nums[j] < nums[i]? dp[i] = max(dp[i], dp[j]+1). Ya patience sort use karo for O(n log n).",
    "approach": [
      "tails = []",
      "For num: i = bisect_left(tails, num)",
      "If i==len(tails): append; else: tails[i]=num",
      "Return len(tails)"
    ],
    "time": "O(n log n) with tails, O(n²) with DP",
    "space": "O(n)",
    "pitfalls": [
      "tails is NOT the actual LIS — it's a structure to track length only",
      "Use bisect_left for strictly increasing (bisect_right for non-decreasing)",
      "The O(n²) DP is more intuitive for interviews if O(n log n) isn't required"
    ],
    "code": "int[] dp=new int[nums.length]; Arrays.fill(dp,1);\nint res=1;\nfor(int i=1;i<nums.length;i++){\n    for(int j=0;j<i;j++) if(nums[j]<nums[i]) dp[i]=Math.max(dp[i],dp[j]+1);\n    res=Math.max(res,dp[i]);\n}\nreturn res;",
    "variants": [
      "Russian Doll Envelopes (LC 354)",
      "Number of LIS (LC 673)"
    ],
    "summary": "Find the length of the longest strictly increasing subsequence in an array."
  },
  {
    "id": 139,
    "name": "Word Break",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "can string s be segmented into words from a dictionary?",
      "dp[i] = can we reach position i?"
    ],
    "coreIdea": "dp[i] = True if s[:i] can be segmented. For each i, check all j < i: if dp[j] and s[j:i] in word_set: dp[i] = True.",
    "coreIdeaHinglish": "dp[i] = s ke pehle i chars segment ho sakte hain? Har i ke liye, pehle ke saare j check karo: dp[j] True hai aur s[j:i] dictionary me hai? dp[i] = True.",
    "approach": [
      "word_set = set(wordDict); dp = [False]*(n+1); dp[0]=True",
      "For i in 1..n: for j in 0..i: if dp[j] and s[j:i] in word_set: dp[i]=True; break"
    ],
    "time": "O(n² · m) where m = max word length",
    "space": "O(n)",
    "pitfalls": [
      "dp[0]=True — empty string is always 'breakable' (base case)",
      "Use a set for O(1) lookup instead of checking the list",
      "Optimization: limit j to max word length back from i"
    ],
    "code": "boolean[] dp=new boolean[s.length()+1]; dp[0]=true;\nSet<String> set=new HashSet<>(wordDict);\nfor(int i=1;i<=s.length();i++) for(int j=0;j<i;j++)\n    if(dp[j]&&set.contains(s.substring(j,i))){ dp[i]=true; break; }\nreturn dp[s.length()];",
    "variants": [
      "Word Break II (LC 140)",
      "Concatenated Words (LC 472)"
    ],
    "summary": "Determine if a string can be segmented into space-separated words found in a dictionary."
  },
  {
    "id": 53,
    "name": "Maximum Subarray",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "maximum sum of any contiguous subarray",
      "Kadane's algorithm"
    ],
    "coreIdea": "Kadane's: at each position, either extend the current subarray or start fresh. curr = max(num, curr+num). Update global max.",
    "coreIdeaHinglish": "Kadane's: har position pe choose karo — current element se fresh start karo ya pehle se extend karo. curr = max(num, curr+num). Global max track karo.",
    "approach": [
      "curr = ans = nums[0]",
      "For num in nums[1:]: curr = max(num, curr+num); ans = max(ans, curr)"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Initialize curr AND ans to nums[0] — handles all-negative arrays",
      "curr = max(num, curr+num) — if curr < 0, restart from num",
      "Don't initialize to 0 if array can have all negatives"
    ],
    "code": "int maxSum=nums[0], cur=nums[0];\nfor(int i=1;i<nums.length;i++){ cur=Math.max(nums[i],cur+nums[i]); maxSum=Math.max(maxSum,cur); }\nreturn maxSum;",
    "variants": [
      "Maximum Product Subarray (LC 152)",
      "Maximum Sum Circular Subarray (LC 918)"
    ],
    "summary": "Find the contiguous subarray (at least one element) with the largest sum."
  },
  {
    "id": 152,
    "name": "Maximum Product Subarray",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "maximum product of any contiguous subarray",
      "negative numbers can flip sign — track both min and max"
    ],
    "coreIdea": "Track both max_prod and min_prod at each position (negatives can turn min into max). At each step: new max = max(num, max_prod*num, min_prod*num); similarly for min.",
    "coreIdeaHinglish": "Negative number current max aur min dono flip kar sakta hai. Isliye dono track karo. Har step pe: naya max = max(num, cur_max*num, cur_min*num). Same for min.",
    "approach": [
      "cur_max = cur_min = ans = nums[0]",
      "For num in nums[1:]: candidates = (num, cur_max*num, cur_min*num)",
      "cur_max, cur_min = max(candidates), min(candidates); ans = max(ans, cur_max)"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Must compute new max AND min from SAME old cur_max and cur_min — don't update in sequence",
      "0 resets both max and min (multiplying by 0 gives 0 — start fresh from next element)",
      "Initialize to nums[0] (not 0 or 1) — handles all-negative or single-element arrays"
    ],
    "code": "int maxP=nums[0], minP=nums[0], res=nums[0];\nfor(int i=1;i<nums.length;i++){\n    int a=nums[i], newMax=Math.max(a,Math.max(maxP*a,minP*a)), newMin=Math.min(a,Math.min(maxP*a,minP*a));\n    maxP=newMax; minP=newMin; res=Math.max(res,maxP);\n}\nreturn res;",
    "variants": [
      "Maximum Subarray (LC 53)",
      "Maximum Product of Three Numbers (LC 628)"
    ],
    "summary": "Find the contiguous subarray (at least one element) with the largest product."
  },
  {
    "id": 91,
    "name": "Decode Ways",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "count ways to decode a string of digits (1→A, 2→B, ... 26→Z)",
      "one-digit and two-digit decodings"
    ],
    "coreIdea": "dp[i] = ways to decode s[:i]. If s[i-1] is non-zero: dp[i] += dp[i-1] (1-digit decode). If s[i-2:i] is 10-26: dp[i] += dp[i-2] (2-digit decode).",
    "coreIdeaHinglish": "dp[i] = s ke pehle i chars decode karne ke ways. s[i-1] != '0'? dp[i] += dp[i-1]. s[i-2:i] in 10-26? dp[i] += dp[i-2].",
    "approach": [
      "dp = [0]*(n+1); dp[0]=1; dp[1]=1 if s[0]!='0' else 0",
      "For i in 2..n+1: one = int(s[i-1]); two = int(s[i-2:i])",
      "if one: dp[i]+=dp[i-1]; if 10<=two<=26: dp[i]+=dp[i-2]"
    ],
    "time": "O(n)",
    "space": "O(n) → O(1) with rolling vars",
    "pitfalls": [
      "s starting with '0' → dp[1]=0 (no valid 1-digit decode for '0')",
      "Two-digit must be in [10, 26] — not just any two digits",
      "'00' can't be decoded — caught by the 10≤two≤26 check"
    ],
    "code": "int n=s.length(); int[] dp=new int[n+1]; dp[0]=1; dp[1]=s.charAt(0)!='0'?1:0;\nfor(int i=2;i<=n;i++){\n    int one=s.charAt(i-1)-'0', two=Integer.parseInt(s.substring(i-2,i));\n    if(one>=1) dp[i]+=dp[i-1];\n    if(two>=10&&two<=26) dp[i]+=dp[i-2];\n}\nreturn dp[n];",
    "variants": [
      "Decode Ways II (LC 639) — with '*' wildcard"
    ],
    "summary": "Count the number of ways to decode a digit string into letters (A=1 … Z=26)."
  },
  {
    "id": 416,
    "name": "Partition Equal Subset Sum",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "can array be split into two subsets with equal sum?",
      "0/1 knapsack — find subset summing to total/2"
    ],
    "coreIdea": "Reduce to: can any subset sum to total/2? 0/1 knapsack DP: dp[j] = True if sum j is achievable. Process each num: iterate j from target down to num (to avoid reuse).",
    "coreIdeaHinglish": "Total/2 sum banana possible hai? 0/1 knapsack: dp[j] = True agar sum j achieve ho sake. Har num ke liye j ko target se num tak reverse iterate karo (reuse avoid karne ke liye).",
    "approach": [
      "total = sum(nums); if odd: return False; target = total//2",
      "dp = {False}*(target+1); dp[0]=True",
      "For num: for j in range(target, num-1, -1): dp[j] |= dp[j-num]"
    ],
    "time": "O(n × target)",
    "space": "O(target)",
    "pitfalls": [
      "If total is odd → impossible (return False immediately)",
      "REVERSE iterate j (target down to num) — prevents using the same element twice in one pass",
      "Any num > target → also return False early"
    ],
    "code": "int sum=0; for(int n:nums) sum+=n;\nif(sum%2!=0) return false;\nint target=sum/2;\nboolean[] dp=new boolean[target+1]; dp[0]=true;\nfor(int n:nums) for(int j=target;j>=n;j--) dp[j]|=dp[j-n];\nreturn dp[target];",
    "variants": [
      "Target Sum (LC 494)",
      "Last Stone Weight II (LC 1049)"
    ],
    "summary": "Determine if an array of positive integers can be partitioned into two subsets with equal sum."
  },
  {
    "id": 647,
    "name": "Palindromic Substrings",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "count all palindromic substrings",
      "expand around center"
    ],
    "coreIdea": "Expand around each center (same as LC 5, but count instead of track max length). Two cases per index: odd and even centers. Count each valid expansion.",
    "coreIdeaHinglish": "Har index ko center maan ke expand karo — odd aur even dono. Har valid expansion = ek palindromic substring. Count karo.",
    "approach": [
      "count = 0",
      "For i in range(n): for l,r in [(i,i),(i,i+1)]: while valid: count++; l--; r++"
    ],
    "time": "O(n²)",
    "space": "O(1)",
    "pitfalls": [
      "Start count at l=r for odd (one char is always a palindrome)",
      "Don't count the initial single-char as 'extra' — the while loop handles it",
      "DP approach is O(n²) time and O(n²) space — expand-around-center is better"
    ],
    "code": "int count=0, n=s.length();\nvoid expand(int l, int r){\n    while(l>=0&&r<n&&s.charAt(l)==s.charAt(r)){ count++; l--; r++; }\n}\nfor(int i=0;i<n;i++){ expand(i,i); expand(i,i+1); }\nreturn count;",
    "variants": [
      "Longest Palindromic Substring (LC 5)",
      "Palindrome Partitioning (LC 131)"
    ],
    "summary": "Count the total number of palindromic substrings in a given string."
  },
  {
    "id": 740,
    "name": "Delete and Earn",
    "difficulty": "Medium",
    "pattern": "1-D DP",
    "trigger": [
      "delete a number to earn it (removes all adjacent integers), maximize earnings",
      "reduce to House Robber"
    ],
    "coreIdea": "Choosing value v earns v × (count of v), but deletes all v-1 and v+1. This is exactly House Robber on a points array where points[v] = v × count(v).",
    "coreIdeaHinglish": "Value v choose karne par v × count(v) milta hai par adjacent values delete ho jaate hain. Yeh House Robber hai — non-adjacent elements ka max sum.",
    "approach": [
      "points = [0]*(max(nums)+1)",
      "For n in nums: points[n] += n",
      "Run House Robber on points array"
    ],
    "time": "O(n + max_val)",
    "space": "O(max_val)",
    "pitfalls": [
      "points[v] = v × frequency of v (not just count)",
      "The transformation to House Robber is the key insight",
      "Max value can be up to 10^4 — points array is bounded"
    ],
    "code": "int[] dp=new int[10001];\nint[] sum=new int[10001];\nfor (int n:nums) sum[n]+=n;\ndp[1]=sum[1];\nfor (int i=2;i<dp.length;i++) dp[i]=Math.max(dp[i-1],dp[i-2]+sum[i]);\nreturn dp[10000];",
    "variants": [
      "House Robber (LC 198)",
      "House Robber II (LC 213)"
    ],
    "summary": "Delete an integer to earn it and automatically delete all copies of that integer ±1; maximize total earned."
  }
]);
