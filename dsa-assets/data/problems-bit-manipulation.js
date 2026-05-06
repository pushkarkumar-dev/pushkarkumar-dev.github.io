// Bit Manipulation — 8 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 191,
    "name": "Number of 1 Bits",
    "difficulty": "Easy",
    "pattern": "Bit Manipulation",
    "trigger": [
      "count set bits",
      "Hamming weight",
      "popcount"
    ],
    "coreIdea": "n & (n-1) clears the lowest set bit. Count how many operations until n == 0.",
    "coreIdeaHinglish": "n & (n-1) sabse neeche wala set bit clear karta hai. Jab tak n != 0 yahi karte raho aur count badhate raho. Simple aur fast.",
    "approach": [
      "count = 0",
      "While n: n &= n-1; count++",
      "Return count"
    ],
    "time": "O(k) where k = set bits",
    "space": "O(1)",
    "pitfalls": [
      "n &= (n-1) is much faster than n &= 1 + right-shift (skips zero bits entirely)",
      "Python ints are arbitrary precision — no unsigned 32-bit issue",
      "bin(n).count('1') works too, but the bit-trick is what interviewers want to see"
    ],
    "code": "int res=0;\nwhile(n!=0){ res+=n&1; n>>>=1; }\nreturn res;",
    "variants": [
      "Counting Bits (LC 338)",
      "Hamming Distance (LC 461)"
    ],
    "summary": "Count the number of '1' bits (Hamming weight) in the binary representation of a 32-bit integer."
  },
  {
    "id": 338,
    "name": "Counting Bits",
    "difficulty": "Easy",
    "pattern": "Bit Manipulation",
    "trigger": [
      "count set bits for every number 0..n",
      "DP on bit patterns",
      "popcount array in O(n)"
    ],
    "coreIdea": "dp[i] = dp[i >> 1] + (i & 1). Right-shifting drops the LSB; the remainder tells us if there's one extra set bit.",
    "coreIdeaHinglish": "dp[i] = dp[i >> 1] + (i & 1). i ko right shift karo — ek bit drop ho gaya. Agar i odd tha toh +1, otherwise +0. Linear time mein 0 se n tak sab set-bit counts nikal aate hain.",
    "approach": [
      "dp = [0] * (n+1)",
      "For i in 1..n: dp[i] = dp[i >> 1] + (i & 1)",
      "Return dp"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "dp[0] = 0 base case (0 has no set bits)",
      "i >> 1 not i - 1 — we're exploiting bit structure, not adjacent values",
      "Works because i >> 1 always has a precomputed answer (it's smaller than i)"
    ],
    "code": "int[] dp=new int[n+1];\nfor(int i=1;i<=n;i++) dp[i]=dp[i>>1]+(i&1);\nreturn dp;",
    "variants": [
      "Number of 1 Bits (LC 191)",
      "Sum of All Subsets XOR Totals (LC 1863)"
    ],
    "summary": "For every number from 0 to n, return how many 1 bits it has in its binary representation."
  },
  {
    "id": 190,
    "name": "Reverse Bits",
    "difficulty": "Easy",
    "pattern": "Bit Manipulation",
    "trigger": [
      "reverse all 32 bits of an unsigned integer",
      "bit reversal"
    ],
    "coreIdea": "Build result by extracting the LSB of n (n & 1) and OR-ing it into the left-shifted result. Repeat 32 times.",
    "coreIdeaHinglish": "32 baar loop karo. Har baar result ko left shift karo aur n ka LSB OR karo. n ko right shift karo. Exactly 32 iterations — leading zeros bhi matter karte hain.",
    "approach": [
      "result = 0",
      "For _ in range(32): result = (result << 1) | (n & 1); n >>= 1",
      "Return result"
    ],
    "time": "O(1) — exactly 32 iters",
    "space": "O(1)",
    "pitfalls": [
      "Always loop exactly 32 times (even after n becomes 0 — leading zeros matter in output)",
      "Shift result left FIRST, then OR the new bit (not the other way around)",
      "Python: mask result with 0xFFFFFFFF if unsigned 32-bit output is required"
    ],
    "code": "int res=0;\nfor(int i=0;i<32;i++){ res=(res<<1)|(n&1); n>>>=1; }\nreturn res;",
    "variants": [
      "Number of 1 Bits (LC 191)",
      "Bitwise AND of Numbers Range (LC 201)"
    ],
    "summary": "Reverse all 32 bits of an unsigned integer."
  },
  {
    "id": 268,
    "name": "Missing Number",
    "difficulty": "Easy",
    "pattern": "Bit Manipulation",
    "trigger": [
      "find missing number in 0..n",
      "XOR trick for missing element",
      "sum formula"
    ],
    "coreIdea": "XOR all indices 0..n with all array values. Numbers present cancel their index; the one missing index remains.",
    "coreIdeaHinglish": "0 se n tak sab indices ko XOR karo, phir array ke saare values ko bhi XOR karo. Jo number dono mein hai woh cancel ho jaata hai — jo bacha woh missing number hai.",
    "approach": [
      "missing = len(nums)  (starts with index n — not in enumerate)",
      "For i, v in enumerate(nums): missing ^= i ^ v",
      "Return missing"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Initialize missing = n (not 0) — index n is never covered by enumerate",
      "XOR approach avoids overflow vs. sum formula in languages with fixed-width ints",
      "Alternatively: n*(n+1)//2 - sum(nums) — simpler but less impressive"
    ],
    "code": "int res=0;\nfor(int i=0;i<=nums.length;i++) res^=i;\nfor(int n:nums) res^=n;\nreturn res;",
    "variants": [
      "Find the Duplicate Number (LC 287)",
      "Single Number (LC 136)"
    ],
    "summary": "Find the one missing number from a range [0, n] given n distinct numbers drawn from that range."
  },
  {
    "id": 7,
    "name": "Reverse Integer",
    "difficulty": "Medium",
    "pattern": "Bit Manipulation",
    "trigger": [
      "reverse digits of a 32-bit signed integer",
      "handle integer overflow",
      "digit manipulation"
    ],
    "coreIdea": "Pop digits from right (n % 10) and push onto reversed. After full reversal, check 32-bit signed bounds and return 0 if out of range.",
    "coreIdeaHinglish": "n % 10 se ek-ek digit nikalo aur rev = rev * 10 + digit se build karo. n //= 10 karte jao. Jab n == 0 ruk jao. Phir check karo — 32-bit range se bahar hai? Toh 0 return karo.",
    "approach": [
      "sign = 1 if x >= 0 else -1; x = abs(x)",
      "rev = 0",
      "While x: rev = rev * 10 + x % 10; x //= 10",
      "rev *= sign; return rev if -(2**31) <= rev <= 2**31-1 else 0"
    ],
    "time": "O(log x)",
    "space": "O(1)",
    "pitfalls": [
      "Check 32-bit overflow AFTER building the full reversed number",
      "Abs() trick simplifies mod handling for negatives in Python",
      "Don't forget the sign when returning"
    ],
    "code": "long res=0; int sign=n<0?-1:1; long x=Math.abs((long)n);\nwhile (x>0) { res=res*10+x%10; x/=10; }\nres*=sign;\nreturn (res>Integer.MAX_VALUE||res<Integer.MIN_VALUE) ? 0 : (int)res;",
    "variants": [
      "Palindrome Number (LC 9)",
      "Reverse Integer — follow-up: no string conversion"
    ],
    "summary": "Reverse the digits of a 32-bit signed integer and return 0 if the result overflows."
  },
  {
    "id": 371,
    "name": "Sum of Two Integers",
    "difficulty": "Medium",
    "pattern": "Bit Manipulation",
    "trigger": [
      "add without + or - operators",
      "simulate addition with XOR and AND",
      "carry propagation via bits"
    ],
    "coreIdea": "XOR gives sum without carry. AND << 1 gives the carry. Loop until carry is zero. In Python, mask to 32 bits to handle overflow simulation.",
    "coreIdeaHinglish": "XOR se carry ke bina sum nikalte hain. AND << 1 se carry milta hai. Carry ko sum mein add karte rehte hain jab tak carry 0 na ho. Python mein 32-bit mask lagani padegi warna infinite loop.",
    "approach": [
      "mask = 0xFFFFFFFF",
      "While b & mask: a, b = a ^ b, (a & b) << 1",
      "Return a if a <= 0x7FFFFFFF else ~(a ^ mask)"
    ],
    "time": "O(1)",
    "space": "O(1)",
    "pitfalls": [
      "Python integers are unbounded — must mask to 32-bit to simulate carry overflow correctly",
      "After loop, convert from two's complement if bit 31 is set (negative result)",
      "b holds the carry; loop until carry is 0"
    ],
    "code": "while(b!=0){ int carry=(a&b)<<1; a=a^b; b=carry; }\nreturn a;",
    "variants": [
      "Number of 1 Bits (LC 191)",
      "Missing Number (LC 268)"
    ],
    "summary": "Compute the sum of two integers without using the + or − operators."
  },
  {
    "id": 89,
    "name": "Gray Code",
    "difficulty": "Medium",
    "pattern": "Bit Manipulation",
    "trigger": [
      "Gray code sequence",
      "consecutive integers differ by exactly one bit",
      "generate n-bit Gray code"
    ],
    "coreIdea": "The i-th Gray code is simply i ^ (i >> 1). No complex generation needed.",
    "coreIdeaHinglish": "i-th Gray code = i XOR (i right shift 1). Formula yaad karo. 0 se 2^n - 1 tak generate karo — consecutive elements exactly ek bit se differ karte hain.",
    "approach": [
      "Return [i ^ (i >> 1) for i in range(1 << n)]"
    ],
    "time": "O(2^n)",
    "space": "O(2^n)",
    "pitfalls": [
      "Formula is i ^ (i >> 1) — memorize it, don't derive under pressure",
      "Result has 2^n elements starting with 0",
      "Sequence wraps around: last and first element also differ by exactly 1 bit"
    ],
    "code": "List<Integer> res=new ArrayList<>();\nfor (int i=0;i<(1<<n);i++) res.add(i^(i>>1));\nreturn res;",
    "variants": [
      "Number of 1 Bits (LC 191)",
      "Minimum Number of Operations to Make Array Continuous (LC 2009)"
    ],
    "summary": "Generate an n-bit Gray code sequence where consecutive values differ by exactly one bit."
  },
  {
    "id": 137,
    "name": "Single Number II",
    "difficulty": "Medium",
    "pattern": "Bit Manipulation",
    "trigger": [
      "every element appears 3 times except one",
      "find the unique element with mod-3 bit counting"
    ],
    "coreIdea": "For each of 32 bit positions, count how many numbers have that bit set and take mod 3. Remaining bits reconstruct the unique number.",
    "coreIdeaHinglish": "Har bit position ke liye saare numbers ke bits ko sum karo. Sum % 3 lo — tripled numbers cancel out. Jo bacha woh unique number ka bit hai. Saare 32 positions ke results reconstruct karo.",
    "approach": [
      "result = 0",
      "For bit in range(32): total = sum((n >> bit) & 1 for n in nums) % 3; result |= total << bit",
      "Handle Python negative: if result >= 2^31: result -= 2^32",
      "Return result"
    ],
    "time": "O(32n) = O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Works because 3k mod 3 = 0 — any tripled number's contribution cancels out",
      "Python: if bit 31 is set, convert from two's complement (subtract 2^32)",
      "Alternative: ones/twos bitmask trick is O(n) in one pass but harder to recall"
    ],
    "code": "int ones=0, twos=0;\nfor(int n:nums){ ones=(ones^n)&~twos; twos=(twos^n)&~ones; }\nreturn ones;",
    "variants": [
      "Single Number (LC 136)",
      "Single Number III (LC 260)"
    ],
    "summary": "Find the only element that appears once in an array where every other element appears exactly three times."
  }
]);
