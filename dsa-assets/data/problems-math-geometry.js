// Math & Geometry — 8 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 48,
    "name": "Rotate Image",
    "difficulty": "Medium",
    "pattern": "Math & Geometry",
    "trigger": [
      "rotate matrix 90 degrees clockwise in-place",
      "no extra space matrix rotation"
    ],
    "coreIdea": "Transpose (swap matrix[i][j] with matrix[j][i] for i < j), then reverse each row.",
    "coreIdeaHinglish": "Pehle matrix ko transpose karo — rows ko columns banao (sirf upper triangle swap karo). Phir har row ko reverse karo. Done — 90 degree clockwise rotation ho gayi.",
    "approach": [
      "Transpose: for i in range(n): for j in range(i+1, n): swap matrix[i][j] and matrix[j][i]",
      "Reverse each row: for row in matrix: row.reverse()"
    ],
    "time": "O(n²)",
    "space": "O(1)",
    "pitfalls": [
      "Transpose only upper triangle (j starts from i+1, not 0) — full matrix swap undoes itself",
      "Reverse rows AFTER transpose, not before (before gives counter-clockwise)",
      "Counter-clockwise: reverse each row first, then transpose"
    ],
    "code": "int n=matrix.length;\nfor(int i=0;i<n;i++) for(int j=i+1;j<n;j++){ int t=matrix[i][j]; matrix[i][j]=matrix[j][i]; matrix[j][i]=t; }\nfor(int[] row:matrix){ int l=0,r=row.length-1; while(l<r){ int t=row[l]; row[l]=row[r]; row[r]=t; l++;r--; } }",
    "variants": [
      "Spiral Matrix (LC 54)",
      "Transpose Matrix (LC 867)"
    ],
    "summary": "Rotate an n×n integer matrix 90 degrees clockwise in-place."
  },
  {
    "id": 54,
    "name": "Spiral Matrix",
    "difficulty": "Medium",
    "pattern": "Math & Geometry",
    "trigger": [
      "traverse matrix in spiral order",
      "layer-by-layer traversal",
      "output all elements in clockwise spiral"
    ],
    "coreIdea": "Maintain four shrinking boundaries (top, bottom, left, right). Peel one direction at a time, shrinking the boundary after each pass.",
    "coreIdeaHinglish": "Char boundaries rakho: top, bottom, left, right. Ek-ek direction mein traverse karo — left→right, top→bottom, right→left, bottom→top. Har direction ke baad boundary shrink karo. Guard conditions lagao jab single row/col bachi ho.",
    "approach": [
      "top=left=0, bottom=rows-1, right=cols-1, res=[]",
      "While top<=bottom and left<=right:",
      "  L→R along top row; top++",
      "  Top→bottom along right col; right--",
      "  If top<=bottom: R→L along bottom row; bottom--",
      "  If left<=right: Bottom→top along left col; left++"
    ],
    "time": "O(m·n)",
    "space": "O(1)",
    "pitfalls": [
      "Check top<=bottom before traversing bottom row (duplicate elements on single-row case)",
      "Check left<=right before traversing left column (duplicate on single-col case)",
      "Shrink boundary immediately after traversing that edge"
    ],
    "code": "List<Integer> res=new ArrayList<>();\nint top=0,bottom=matrix.length-1,left=0,right=matrix[0].length-1;\nwhile(top<=bottom&&left<=right){\n    for(int c=left;c<=right;c++) res.add(matrix[top][c]); top++;\n    for(int r=top;r<=bottom;r++) res.add(matrix[r][right]); right--;\n    if(top<=bottom){ for(int c=right;c>=left;c--) res.add(matrix[bottom][c]); bottom--; }\n    if(left<=right){ for(int r=bottom;r>=top;r--) res.add(matrix[r][left]); left++; }\n}\nreturn res;",
    "variants": [
      "Rotate Image (LC 48)",
      "Spiral Matrix II (LC 59)"
    ],
    "animation": "spiralMatrix",
    "summary": "Return all elements of an m×n matrix traversed in clockwise spiral order."
  },
  {
    "id": 73,
    "name": "Set Matrix Zeroes",
    "difficulty": "Medium",
    "pattern": "Math & Geometry",
    "trigger": [
      "zero out entire row and column when a cell is zero",
      "in-place matrix modification without extra space"
    ],
    "coreIdea": "Use first row and first column as zero-markers. Scan the interior, mark; then apply markers; handle first row/col separately.",
    "coreIdeaHinglish": "First row aur first column ko markers ki jagah use karo — unka khud ka state pehle note karo. Interior scan karo, markers set karo. Markers se rows/cols zero karo. Last mein first row/col ko fix karo.",
    "approach": [
      "Note row0 = any zero in row 0, col0 = any zero in col 0",
      "Scan interior [1:][1:]: if zero, set matrix[r][0] = matrix[0][c] = 0",
      "Zero interior rows using col-0 markers; zero interior cols using row-0 markers",
      "Apply row0 and col0 flags to first row and first column"
    ],
    "time": "O(m·n)",
    "space": "O(1)",
    "pitfalls": [
      "Record row0/col0 BEFORE overwriting them as markers (they serve dual duty)",
      "Process interior first, then apply markers (not simultaneously — avoids cascading zeros)",
      "Handle first row and first column as separate final steps"
    ],
    "code": "boolean r0=false, c0=false;\nfor(int c=0;c<matrix[0].length;c++) if(matrix[0][c]==0) r0=true;\nfor(int r=0;r<matrix.length;r++) if(matrix[r][0]==0) c0=true;\nfor(int r=1;r<matrix.length;r++) for(int c=1;c<matrix[0].length;c++) if(matrix[r][c]==0){ matrix[r][0]=0; matrix[0][c]=0; }\nfor(int r=1;r<matrix.length;r++) if(matrix[r][0]==0) Arrays.fill(matrix[r],0);\nfor(int c=1;c<matrix[0].length;c++) if(matrix[0][c]==0) for(int r=0;r<matrix.length;r++) matrix[r][c]=0;\nif(r0) Arrays.fill(matrix[0],0);\nif(c0) for(int r=0;r<matrix.length;r++) matrix[r][0]=0;",
    "variants": [
      "Game of Life (LC 289)",
      "Rotate Image (LC 48)"
    ],
    "summary": "For a matrix, set the entire row and column to zero for any cell that contains zero, in-place."
  },
  {
    "id": 202,
    "name": "Happy Number",
    "difficulty": "Easy",
    "pattern": "Math & Geometry",
    "trigger": [
      "sum of squares of digits repeatedly",
      "detect cycle in number transformation"
    ],
    "coreIdea": "Compute digit-square sum with slow/fast pointers. If we hit 1, happy. If slow meets fast in a cycle, not happy.",
    "coreIdeaHinglish": "Digit-square sum nikalo slow aur fast pointer se. Fast pointer do steps, slow ek step. Agar 1 pe pahuncho — happy. Slow aur fast mile bina 1 ke — cycle hai, not happy.",
    "approach": [
      "def sq(n): return sum(int(d)**2 for d in str(n))",
      "slow = n, fast = sq(n)",
      "While fast != 1 and slow != fast: slow = sq(slow); fast = sq(sq(fast))",
      "Return fast == 1"
    ],
    "time": "O(log n)",
    "space": "O(1)",
    "pitfalls": [
      "Without cycle detection, non-happy numbers loop forever",
      "Floyd's two-pointer works; alternatively a seen-set is simpler but O(k) space",
      "Digit extraction: sum(int(d)**2 for d in str(n)) is clean and readable"
    ],
    "code": "int sq(int n){ int s=0; while(n>0){ int d=n%10; s+=d*d; n/=10; } return s; }\nint slow=n, fast=sq(n);\nwhile(fast!=1&&slow!=fast){ slow=sq(slow); fast=sq(sq(fast)); }\nreturn fast==1;",
    "variants": [
      "Linked List Cycle (LC 141)",
      "Ugly Number (LC 263)"
    ],
    "summary": "Determine if a number is 'happy': repeatedly replace it with the sum of its squared digits until it reaches 1 or loops."
  },
  {
    "id": 50,
    "name": "Pow(x, n)",
    "difficulty": "Medium",
    "pattern": "Math & Geometry",
    "trigger": [
      "fast exponentiation",
      "binary exponentiation",
      "implement x^n in O(log n)"
    ],
    "coreIdea": "Binary exponentiation: if n even, square x and halve n; if n odd, pull out one x and subtract 1. Handle negative n by inverting x.",
    "coreIdeaHinglish": "n ko adha karte jao. n even ho toh x ko square karo, n ko half karo. n odd ho toh ek x multiply karo aur n ko even banao. Negative n ke liye 1/x se karo aur n ko positive karo.",
    "approach": [
      "If n < 0: return myPow(1/x, -n)",
      "If n == 0: return 1",
      "If n % 2 == 0: return myPow(x*x, n//2)",
      "Return x * myPow(x, n-1)"
    ],
    "time": "O(log n)",
    "space": "O(log n)",
    "pitfalls": [
      "Handle negative n first (x^-n = 1/x^n)",
      "n odd: multiply by x then recurse with n-1 (cleanest), or use n//2 with x * myPow(x*x, n//2)",
      "Python has no 32-bit overflow issues; other languages need long"
    ],
    "code": "double myPow(double x, long n){\n    if(n<0){ x=1/x; n=-n; }\n    if(n==0) return 1;\n    if(n%2==0) return myPow(x*x,n/2);\n    return x*myPow(x,n-1);\n}",
    "variants": [
      "Sqrt(x) (LC 69)",
      "Super Pow (LC 372)"
    ],
    "summary": "Implement fast exponentiation to compute x raised to the power n in O(log n)."
  },
  {
    "id": 43,
    "name": "Multiply Strings",
    "difficulty": "Medium",
    "pattern": "Math & Geometry",
    "trigger": [
      "multiply large numbers stored as strings",
      "grade-school multiplication",
      "no BigInteger"
    ],
    "coreIdea": "Simulate grade-school: digit num1[i] × num2[j] contributes to result positions i+j and i+j+1. Sum contributions, propagate carries, strip leading zeros.",
    "coreIdeaHinglish": "Grade-school multiplication simulate karo. num1[i] aur num2[j] ka product result ke i+j+1 position pe jaata hai, carry i+j pe jaati hai. Sab positions fill karo, phir leading zeros strip karo.",
    "approach": [
      "res = [0] * (len(num1) + len(num2))",
      "For i reverse(num1), j reverse(num2): mul = d1*d2; p1=i+j, p2=i+j+1; s=mul+res[p2]; res[p2]=s%10; res[p1]+=s//10",
      "Return ''.join(map(str, res)).lstrip('0') or '0'"
    ],
    "time": "O(m·n)",
    "space": "O(m+n)",
    "pitfalls": [
      "Index: i-th digit from end of num1 × j-th digit from end of num2 → position i+j+1 (not i+j)",
      "Strip leading zeros with lstrip('0'), but guard against empty string with or '0'",
      "Iterate in reverse so index 0 = rightmost digit"
    ],
    "code": "int m=num1.length(),n=num2.length();\nint[] res=new int[m+n];\nfor(int i=m-1;i>=0;i--) for(int j=n-1;j>=0;j--){\n    int mul=(num1.charAt(i)-'0')*(num2.charAt(j)-'0');\n    int p1=i+j,p2=i+j+1, sum=mul+res[p2];\n    res[p2]=sum%10; res[p1]+=sum/10;\n}\nStringBuilder sb=new StringBuilder();\nfor(int d:res) if(!(sb.length()==0&&d==0)) sb.append(d);\nreturn sb.length()==0?\"0\":sb.toString();",
    "variants": [
      "Add Strings (LC 415)",
      "Pow(x, n) (LC 50)"
    ],
    "summary": "Given two non-negative integers as strings, return their product as a string without using big-integer libraries."
  },
  {
    "id": 66,
    "name": "Plus One",
    "difficulty": "Easy",
    "pattern": "Math & Geometry",
    "trigger": [
      "increment number represented as digit array",
      "carry propagation",
      "all-9 edge case"
    ],
    "coreIdea": "Traverse from right. If digit < 9, increment and return early. If 9, set to 0 and continue left. If all digits were 9, prepend 1.",
    "coreIdeaHinglish": "Right se left iterate karo. Agar digit 9 se chhota hai, seedha +1 karo aur return karo. Agar 9 hai, 0 karo aur carry aage le jao. Sab 9 the? [1] + digits prepend karo.",
    "approach": [
      "For i in range(len(digits)-1, -1, -1): if digits[i] < 9: digits[i]++; return digits",
      "digits[i] = 0 (carry continues)",
      "Return [1] + digits (all nines case)"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Return inside the loop as soon as carry stops — don't keep going",
      "All-9 case: array becomes all zeros, prepend 1",
      "The [1] + digits at the end only runs when ALL digits were 9"
    ],
    "code": "for(int i=digits.length-1;i>=0;i--){\n    if(digits[i]<9){ digits[i]++; return digits; }\n    digits[i]=0;\n}\nint[] res=new int[digits.length+1]; res[0]=1;\nreturn res;",
    "variants": [
      "Add Binary (LC 67)",
      "Add Strings (LC 415)"
    ],
    "summary": "Increment a non-negative integer represented as an array of digits by one."
  },
  {
    "id": 2013,
    "name": "Detect Squares",
    "difficulty": "Medium",
    "pattern": "Math & Geometry",
    "trigger": [
      "count axis-aligned squares from a point set",
      "online add/count operations on points"
    ],
    "coreIdea": "For query (px, py): iterate all points sharing py as a potential diagonal corner. For each (x, py) where x ≠ px, the two missing corners are (px, py±side) and (x, py±side). Multiply their counts.",
    "coreIdeaHinglish": "Query (px, py) ke liye: same y wale saare points ko diagonal corner maano. Har aise (x, py) ke liye side = |x - px|. Baaki do corners (px, py±side) aur (x, py±side) count karo aur multiply karo.",
    "approach": [
      "cnt = Counter of (x,y) tuples; pts_by_y = {y: list of x values}",
      "add(x, y): cnt[(x,y)]++; pts_by_y[y].append(x)",
      "count(px, py): for x in pts_by_y[py] (x != px): side = abs(x-px); for y in [py+side, py-side]: ans += cnt[(x,py)] * cnt[(px,y)] * cnt[(x,y)]"
    ],
    "time": "O(n) per query",
    "space": "O(n)",
    "pitfalls": [
      "Skip diagonal corner where x == px (degenerate — not a square)",
      "Check both above and below the query row (py+side and py-side)",
      "Multiply all three corner counts — not checking both corners means missing valid squares"
    ],
    "code": "Map<int[],Integer> cnt=new HashMap<>(); // Use long encoding instead\nMap<Long,Integer> counter=new HashMap<>();\nMap<Integer,List<Integer>> pby=new HashMap<>();\n\nvoid add(int x, int y){\n    long key=((long)x<<32)|((long)y&0xFFFFFFFFL);\n    counter.merge(key,1,Integer::sum);\n    pby.computeIfAbsent(y,k->new ArrayList<>()).add(x);\n}\nint count(int px, int py){\n    int ans=0;\n    for(int x:pby.getOrDefault(py,List.of())){\n        if(x==px) continue;\n        int side=Math.abs(x-px);\n        for(int dy:new int[]{side,-side}){\n            long k1=((long)x<<32)|((long)(py)&0xFFFFFFFFL);\n            long k2=((long)px<<32)|((long)(py+dy)&0xFFFFFFFFL);\n            long k3=((long)x<<32)|((long)(py+dy)&0xFFFFFFFFL);\n            ans+=counter.getOrDefault(k1,0)*counter.getOrDefault(k2,0)*counter.getOrDefault(k3,0);\n        }\n    }\n    return ans;\n}",
    "variants": [
      "Valid Square (LC 593)",
      "Count Lattice Points Inside a Circle (LC 2249)"
    ],
    "summary": "Design a system to add 2D integer points and count how many axis-aligned squares can be formed by stored points."
  }
]);
