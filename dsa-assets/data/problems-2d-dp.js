// 2-D DP — 10 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 62,
    "name": "Unique Paths",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "count paths from top-left to bottom-right (only right or down moves)",
      "grid DP"
    ],
    "coreIdea": "dp[r][c] = paths to reach (r,c) = dp[r-1][c] + dp[r][c-1]. First row and column all 1s (only one way to reach). Can be solved in O(1) space with rolling row.",
    "coreIdeaHinglish": "dp[r][c] = yahan tak pahunchne ke paths = upar se + left se. Pehli row aur col sab 1. Space O(n) se karo — sirf ek row track karo.",
    "approach": [
      "dp = [1]*cols",
      "For each row 1..rows: for c in 1..cols: dp[c] += dp[c-1]",
      "Return dp[-1]"
    ],
    "time": "O(m·n)",
    "space": "O(n)",
    "pitfalls": [
      "Rolling row: dp[c] = dp[c] (from row above) + dp[c-1] (from left in current row)",
      "First row stays all 1s — no update needed",
      "Math solution exists: C(m+n-2, m-1)"
    ],
    "code": "int[] dp=new int[n]; Arrays.fill(dp,1);\nfor(int r=1;r<m;r++) for(int c=1;c<n;c++) dp[c]+=dp[c-1];\nreturn dp[n-1];",
    "variants": [
      "Unique Paths II (LC 63) — with obstacles",
      "Minimum Path Sum (LC 64)"
    ],
    "summary": "Count unique paths from the top-left to bottom-right of an m×n grid, moving only right or down."
  },
  {
    "id": 64,
    "name": "Minimum Path Sum",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "minimum sum path from top-left to bottom-right (right/down only)"
    ],
    "coreIdea": "dp[r][c] = min cost to reach (r,c) = grid[r][c] + min(dp[r-1][c], dp[r][c-1]). Modify in-place to avoid extra space.",
    "coreIdeaHinglish": "dp[r][c] = yahan tak minimum cost = grid[r][c] + min(upar se, left se). In-place modify karo extra space ke bina.",
    "approach": [
      "Fill first row (prefix sums); fill first col (prefix sums)",
      "For r,c > 0: grid[r][c] += min(grid[r-1][c], grid[r][c-1])",
      "Return grid[-1][-1]"
    ],
    "time": "O(m·n)",
    "space": "O(1) in-place",
    "pitfalls": [
      "Initialize first row and first column as prefix sums before filling interior",
      "In-place modification is clean — no extra dp array needed",
      "min() of up and left (not max)"
    ],
    "code": "int m=grid.length, n=grid[0].length;\nint[] dp=new int[n];\nfor (int r=0;r<m;r++) for (int c=0;c<n;c++) {\n    if (c==0) dp[c]+=grid[r][c];\n    else if (r==0) dp[c]=dp[c-1]+grid[r][c];\n    else dp[c]=Math.min(dp[c],dp[c-1])+grid[r][c];\n}\nreturn dp[n-1];",
    "variants": [
      "Unique Paths (LC 62)",
      "Triangle (LC 120)"
    ],
    "summary": "Find the path from top-left to bottom-right of a grid that minimizes the sum of values along it."
  },
  {
    "id": 1143,
    "name": "Longest Common Subsequence",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "length of longest common subsequence of two strings"
    ],
    "coreIdea": "dp[i][j] = LCS of text1[:i] and text2[:j]. If chars match: dp[i][j] = dp[i-1][j-1]+1. Else: max(dp[i-1][j], dp[i][j-1]).",
    "coreIdeaHinglish": "dp[i][j] = text1 ke pehle i aur text2 ke pehle j chars ka LCS. Chars match? dp[i-1][j-1]+1. Nahi? max(upar, left).",
    "approach": [
      "dp = [[0]*(n+1) for _ in range(m+1)]",
      "If text1[i-1]==text2[j-1]: dp[i][j]=dp[i-1][j-1]+1",
      "Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])"
    ],
    "time": "O(m·n)",
    "space": "O(m·n) → O(n) with rolling row",
    "pitfalls": [
      "LCS ≠ LCS substring — characters don't need to be contiguous",
      "Indices are 1-based for dp but 0-based for string access: text1[i-1]",
      "Rolling row optimization: only need previous row"
    ],
    "code": "int m=text1.length(),n=text2.length();\nint[][] dp=new int[m+1][n+1];\nfor(int i=1;i<=m;i++) for(int j=1;j<=n;j++){\n    if(text1.charAt(i-1)==text2.charAt(j-1)) dp[i][j]=dp[i-1][j-1]+1;\n    else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);\n}\nreturn dp[m][n];",
    "variants": [
      "Longest Common Substring",
      "Delete Operation for Two Strings (LC 583)",
      "Edit Distance (LC 72)"
    ],
    "summary": "Find the length of the longest subsequence present in both strings."
  },
  {
    "id": 309,
    "name": "Best Time to Buy and Sell Stock with Cooldown",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "max profit with unlimited transactions but 1-day cooldown after selling",
      "state machine DP"
    ],
    "coreIdea": "Three states: holding, sold (just sold — cooldown next), cooldown. Transitions: holding → hold or sell; sold → cooldown; cooldown → hold or stay.",
    "coreIdeaHinglish": "Teen states: holding, sold (abhi sell kiya), cooldown. Holding se sell karo ya hold karo. Sold ke baad cooldown. Cooldown ke baad buy karo ya wait karo.",
    "approach": [
      "hold = -inf, sold = 0, cool = 0",
      "For price: new_hold = max(hold, cool - price)",
      "new_sold = hold + price; new_cool = max(cool, sold)",
      "hold, sold, cool = new_hold, new_sold, new_cool"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Compute all three new states SIMULTANEOUSLY from old values — order of assignment matters",
      "Initial hold = -inf (can't sell before buying); sold = cool = 0",
      "cool absorbs the 'wait' state — max(cool, sold) means either waiting from yesterday's cool or just finished cooldown"
    ],
    "code": "int n=prices.length;\nint hold=Integer.MIN_VALUE, sold=0, rest=0;\nfor(int p:prices){\n    int newHold=Math.max(hold,rest-p), newSold=hold+p, newRest=Math.max(rest,sold);\n    hold=newHold; sold=newSold; rest=newRest;\n}\nreturn Math.max(sold,rest);",
    "variants": [
      "Buy and Sell Stock (LC 121)",
      "Buy and Sell Stock with Transaction Fee (LC 714)"
    ],
    "summary": "Find the maximum profit from stock buy/sell transactions with a mandatory 1-day cooldown after each sale."
  },
  {
    "id": 518,
    "name": "Coin Change II",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "number of ways to make amount using coins (combinations, not permutations)",
      "unbounded knapsack — count combinations"
    ],
    "coreIdea": "dp[j] = ways to make amount j. For each coin, forward-iterate j from coin to amount: dp[j] += dp[j-coin]. Coin-outer loop ensures combinations (each coin considered once).",
    "coreIdeaHinglish": "dp[j] = amount j banane ke ways. Har coin ke liye forward iterate karo (coin se amount tak). dp[j] += dp[j-coin]. Coin outer loop = combinations (order nahi chahiye).",
    "approach": [
      "dp = [0]*(amount+1); dp[0]=1",
      "For coin: for j in range(coin, amount+1): dp[j] += dp[j-coin]"
    ],
    "time": "O(amount × n)",
    "space": "O(amount)",
    "pitfalls": [
      "Coin-OUTER loop gives combinations; amount-outer gives permutations (different problem)",
      "Forward iteration (unlike 0/1 knapsack) — coins are reusable",
      "dp[0]=1 — one way to make 0 (use no coins)"
    ],
    "code": "int[] dp=new int[amount+1]; dp[0]=1;\nfor(int c:coins) for(int a=c;a<=amount;a++) dp[a]+=dp[a-c];\nreturn dp[amount];",
    "variants": [
      "Coin Change (LC 322) — min coins",
      "Combination Sum IV (LC 377) — permutations (order matters)"
    ],
    "summary": "Count the number of combinations of coins that sum to a given amount, using each denomination unlimited times."
  },
  {
    "id": 494,
    "name": "Target Sum",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "count ways to assign + or - to each number to reach target",
      "subset sum DP (reduce to P-N=target, P+N=sum)"
    ],
    "coreIdea": "Let P = sum of positives, N = sum of negatives. P - N = target, P + N = total. So P = (total + target) / 2. Count subsets summing to P — exactly LC 416 (count variant).",
    "coreIdeaHinglish": "Math reduce karo: P + N = total, P - N = target. P = (total+target)/2. Ab count karo kitne subsets ka sum P hai — 0/1 knapsack count variant.",
    "approach": [
      "If (total+target) is odd or target > total: return 0",
      "P = (total+target)//2",
      "dp[0]=1; for num: for j in range(P, num-1, -1): dp[j] += dp[j-num]"
    ],
    "time": "O(n × P)",
    "space": "O(P)",
    "pitfalls": [
      "(total + target) must be even for P to be integer",
      "abs(target) > total → impossible (even assigning all to one side falls short)",
      "Reverse iterate j (0/1 knapsack — each num used once)"
    ],
    "code": "Map<Integer,Integer> memo=new HashMap<>();\nint dfs(int[] nums,int i,int total){\n    if(i==nums.length) return total==target?1:0;\n    int key=i*2001+total+1000; // encode state\n    if(memo.containsKey(key)) return memo.get(key);\n    int res=dfs(nums,i+1,total+nums[i])+dfs(nums,i+1,total-nums[i]);\n    memo.put(key,res); return res;\n}\nreturn dfs(nums,0,0);",
    "variants": [
      "Partition Equal Subset Sum (LC 416)",
      "Last Stone Weight II (LC 1049)"
    ],
    "summary": "Assign + or − to each element and count how many expressions equal a target sum."
  },
  {
    "id": 97,
    "name": "Interleaving String",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "can s3 be formed by interleaving s1 and s2?",
      "2D DP on (i, j) = can s3[:i+j] be formed from s1[:i] and s2[:j]?"
    ],
    "coreIdea": "dp[i][j] = True if s3[:i+j] can be formed by interleaving s1[:i] and s2[:j]. Transition: from dp[i-1][j] (match s1[i-1]) or dp[i][j-1] (match s2[j-1]).",
    "coreIdeaHinglish": "dp[i][j] = s3 ke pehle i+j chars bana sakte hain s1[:i] aur s2[:j] se? Transition: s1 se ek char lo ya s2 se ek char lo — match hona chahiye s3[i+j-1] se.",
    "approach": [
      "If len(s1)+len(s2)!=len(s3): return False",
      "dp[i][j] = (dp[i-1][j] and s1[i-1]==s3[i+j-1]) or (dp[i][j-1] and s2[j-1]==s3[i+j-1])"
    ],
    "time": "O(m·n)",
    "space": "O(m·n) → O(n) rolling",
    "pitfalls": [
      "Check length first: if m+n != len(s3): return False",
      "dp[0][0]=True; first row: dp[0][j] = dp[0][j-1] and s2[j-1]==s3[j-1]",
      "i+j-1 indexes into s3 (0-indexed)"
    ],
    "code": "int m=s1.length(),n=s2.length();\nif(m+n!=s3.length()) return false;\nboolean[][] dp=new boolean[m+1][n+1]; dp[0][0]=true;\nfor(int i=0;i<=m;i++) for(int j=0;j<=n;j++){\n    if(i>0) dp[i][j]|=dp[i-1][j]&&s1.charAt(i-1)==s3.charAt(i+j-1);\n    if(j>0) dp[i][j]|=dp[i][j-1]&&s2.charAt(j-1)==s3.charAt(i+j-1);\n}\nreturn dp[m][n];",
    "variants": [
      "Longest Common Subsequence (LC 1143)"
    ],
    "summary": "Determine if string s3 is formed by interleaving the characters of s1 and s2."
  },
  {
    "id": 329,
    "name": "Longest Increasing Path in a Matrix",
    "difficulty": "Hard",
    "pattern": "2-D DP",
    "trigger": [
      "longest strictly increasing path in a matrix (any direction)",
      "DFS + memoization on DAG"
    ],
    "coreIdea": "DFS from each cell. memo[r][c] = longest increasing path starting at (r,c). Only move to strictly larger neighbors. Because paths only go in increasing direction, no cycles → DAG → memoize safely.",
    "coreIdeaHinglish": "Har cell se DFS karo. memo[r][c] = yahan se shuru hone wali sabse lambi increasing path. Sirf bade neighbors pe jao. No cycles (strictly increasing) → memoize.",
    "approach": [
      "memo = {}; for each cell: ans = max(ans, dfs(r,c))",
      "dfs(r,c): if memo: return; for 4 dirs: if in bounds and grid[nr][nc]>grid[r][c]: explore",
      "memo[r][c] = 1 + max of neighbors; return memo[r][c]"
    ],
    "time": "O(M·N)",
    "space": "O(M·N)",
    "pitfalls": [
      "No need to track visited — strictly increasing guarantees no cycles",
      "Memoize by (r,c) — a cell's longest path is fixed regardless of how you reach it",
      "Topological sort + DP is the alternative O(M·N) approach"
    ],
    "code": "int m=matrix.length,n=matrix[0].length;\nint[][] dp=new int[m][n];\nint dfs(int r,int c){\n    if(dp[r][c]!=0) return dp[r][c];\n    int best=1;\n    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};\n    for(int[] d:dirs){ int nr=r+d[0],nc=c+d[1]; if(nr>=0&&nr<m&&nc>=0&&nc<n&&matrix[nr][nc]>matrix[r][c]) best=Math.max(best,1+dfs(nr,nc)); }\n    return dp[r][c]=best;\n}\nint res=0;\nfor(int r=0;r<m;r++) for(int c=0;c<n;c++) res=Math.max(res,dfs(r,c));\nreturn res;",
    "variants": [
      "Number of Islands (LC 200)",
      "Pacific Atlantic Water Flow (LC 417)"
    ],
    "summary": "Find the length of the longest strictly increasing path in a matrix, moving in four directions."
  },
  {
    "id": 221,
    "name": "Maximal Square",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "largest square submatrix of all 1s",
      "dp[r][c] = side length of largest square with bottom-right at (r,c)"
    ],
    "coreIdea": "dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 when matrix[r][c]=='1'. The min of three neighbors limits the square size.",
    "coreIdeaHinglish": "dp[r][c] = yahan bottom-right pe khatam hone wale sabse bade square ki side. Agar cell 1 hai: min(upar, left, diagonal) + 1. Max dp value ka square = answer.",
    "approach": [
      "dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 if matrix[r][c]=='1'",
      "ans = max(dp[r][c]); return ans²"
    ],
    "time": "O(M·N)",
    "space": "O(M·N) → O(N) rolling",
    "pitfalls": [
      "Answer is the AREA (side²), not the side length",
      "The min of three neighbors is the bottleneck — one smaller neighbor caps the square",
      "First row and column: dp[r][c] = int(matrix[r][c]) directly"
    ],
    "code": "if (matrix==null||matrix.length==0) return 0;\nint m=matrix.length, n=matrix[0].length, res=0;\nint[][] dp=new int[m+1][n+1];\nfor (int r=1;r<=m;r++) for (int c=1;c<=n;c++) {\n    if (matrix[r-1][c-1]=='1') {\n        dp[r][c]=Math.min(dp[r-1][c],Math.min(dp[r][c-1],dp[r-1][c-1]))+1;\n        res=Math.max(res,dp[r][c]);\n    }\n}\nreturn res*res;",
    "variants": [
      "Maximal Rectangle (LC 85)"
    ],
    "summary": "Find the area of the largest square containing only 1s in a binary matrix."
  },
  {
    "id": 583,
    "name": "Delete Operation for Two Strings",
    "difficulty": "Medium",
    "pattern": "2-D DP",
    "trigger": [
      "minimum deletions to make two strings equal",
      "reduce to LCS: deletions = m + n - 2×LCS"
    ],
    "coreIdea": "Minimum deletions = (m - LCS) + (n - LCS) = m + n - 2×LCS. Compute LCS of word1 and word2, then apply the formula.",
    "coreIdeaHinglish": "Minimum deletions = m + n - 2 × LCS. Pehle LCS nikalo, phir formula apply karo. LCS jo bacha woh common hai, baaki delete karna hai.",
    "approach": [
      "Compute LCS(word1, word2) as in LC 1143",
      "Return len(word1) + len(word2) - 2*lcs"
    ],
    "time": "O(m·n)",
    "space": "O(m·n) → O(n)",
    "pitfalls": [
      "Don't re-derive the DP — recognize it's LCS + formula",
      "Alternative: edit distance (LC 72) restricted to only deletions",
      "Formula: (chars to delete from word1) + (chars to delete from word2)"
    ],
    "code": "int m=word1.length(), n=word2.length();\nint[][] dp=new int[m+1][n+1];\nfor (int i=1;i<=m;i++) for (int j=1;j<=n;j++) {\n    if (word1.charAt(i-1)==word2.charAt(j-1)) dp[i][j]=dp[i-1][j-1]+1;\n    else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);\n}\nint lcs=dp[m][n];\nreturn (m-lcs)+(n-lcs);",
    "variants": [
      "Longest Common Subsequence (LC 1143)",
      "Edit Distance (LC 72)"
    ],
    "summary": "Find the minimum number of character deletions needed to make two strings equal."
  }
]);
