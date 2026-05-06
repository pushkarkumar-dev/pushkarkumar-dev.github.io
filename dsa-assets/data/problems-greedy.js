// Greedy — 7 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 55,
    "name": "Jump Game",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "trigger": [
      "can you reach the end?",
      "each element is max jump length",
      "reachability check"
    ],
    "coreIdea": "Track the farthest reachable index. If current index exceeds it, we're stuck — return False.",
    "coreIdeaHinglish": "Ek 'reach' variable rakho — ab tak kitna door ja sakte ho. Har index pe check karo: agar index hi reach se aage nikal gaya, matlab wahan pahunche hi nahi — False. Nahi toh reach update karo.",
    "approach": [
      "reach = 0",
      "For i in range(len(nums)): if i > reach: return False",
      "reach = max(reach, i + nums[i])",
      "Return True"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Check i > reach BEFORE updating (can't stand on an unreachable index)",
      "reach = i + nums[i], not nums[i] alone",
      "No need to check reach >= n-1 separately — the loop handles it"
    ],
    "code": "int reach=0;\nfor(int i=0;i<nums.length;i++){\n    if(i>reach) return false;\n    reach=Math.max(reach,i+nums[i]);\n}\nreturn true;",
    "variants": [
      "Jump Game II (LC 45)",
      "Jump Game III (LC 1306)"
    ],
    "summary": "Determine if you can reach the last index of an array, where each element is the maximum jump length from that position."
  },
  {
    "id": 134,
    "name": "Gas Station",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "trigger": [
      "circular route feasibility",
      "net gain/loss per stop",
      "can you complete the circuit?"
    ],
    "coreIdea": "If total gas < total cost, impossible. Otherwise a unique valid start exists: reset start whenever running tank goes negative.",
    "coreIdeaHinglish": "Pehle check karo total gas >= total cost — nahi hai toh -1. Hai toh ek valid start zaroor milega. Running tank negative ho jaye toh start ko agle station pe reset karo aur tank zero karo.",
    "approach": [
      "If sum(gas) < sum(cost): return -1",
      "tank = 0, start = 0",
      "For i: tank += gas[i] - cost[i]",
      "If tank < 0: start = i+1; tank = 0",
      "Return start"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Check total feasibility first — if net negative, no start works",
      "When resetting, set tank = 0 (don't carry the negative leftover)",
      "You don't need to verify the found start — the feasibility check guarantees it's correct"
    ],
    "code": "int total=0, tank=0, start=0;\nfor(int i=0;i<gas.length;i++){\n    int d=gas[i]-cost[i]; total+=d; tank+=d;\n    if(tank<0){ start=i+1; tank=0; }\n}\nreturn total>=0 ? start : -1;",
    "variants": [
      "Jump Game (LC 55)",
      "Minimum Cost to Complete a Trip (LC 2187)"
    ],
    "summary": "Find the starting gas station from which a car can complete a full circular route, or -1 if impossible."
  },
  {
    "id": 45,
    "name": "Jump Game II",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "trigger": [
      "minimum jumps to reach end",
      "fewest steps with BFS-level sweep"
    ],
    "coreIdea": "Maintain current jump boundary (curEnd) and farthest reachable. Increment jumps only when forced to cross to the next level.",
    "coreIdeaHinglish": "Ek 'curEnd' aur 'farthest' tracker rakho. Jab current index curEnd pe pahunche, ek jump use hua — jumps++ aur curEnd ko farthest pe le jao. Greedy: har jump mein maximum coverage lo.",
    "approach": [
      "jumps = curEnd = farthest = 0",
      "For i in range(len(nums)-1): farthest = max(farthest, i + nums[i])",
      "If i == curEnd: jumps++; curEnd = farthest",
      "Return jumps"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Loop to len(nums)-1 (not len), to avoid counting a phantom jump past the end",
      "Increment jumps only when i == curEnd, not every step",
      "farthest is max reachable anywhere; curEnd is boundary of the current jump level"
    ],
    "code": "int jumps=0, curEnd=0, farthest=0;\nfor(int i=0;i<nums.length-1;i++){\n    farthest=Math.max(farthest,i+nums[i]);\n    if(i==curEnd){ jumps++; curEnd=farthest; }\n}\nreturn jumps;",
    "variants": [
      "Jump Game (LC 55)",
      "Jump Game III (LC 1306)"
    ],
    "summary": "Find the minimum number of jumps to reach the last index of an array."
  },
  {
    "id": 846,
    "name": "Hand of Straights",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "trigger": [
      "group cards into consecutive sequences of size W",
      "can you rearrange into straights?"
    ],
    "coreIdea": "Sort unique card values. For the smallest unplaced card, force-consume W consecutive cards by its count. Fail if any consecutive slot is missing.",
    "coreIdeaHinglish": "Cards ko sort karo. Sabse chhote unplaced card se W consecutive cards ki group banao — count ke hisaab se. Counter se ghataao. Koi card count mein nahi? False.",
    "approach": [
      "If len(hand) % W != 0: return False",
      "cnt = Counter(hand)",
      "For k in sorted(cnt): if cnt[k] > 0: n = cnt[k]; for i in 0..W-1: if cnt[k+i] < n: return False; cnt[k+i] -= n",
      "Return True"
    ],
    "time": "O(n log n)",
    "space": "O(n)",
    "pitfalls": [
      "Early check: total cards not divisible by W means impossible",
      "Process keys in sorted order — must start with smallest unplaced",
      "Subtract cnt[k] from each of the W consecutive slots (not just 1 at a time)"
    ],
    "code": "// Hand of Straights — greedy with TreeMap\nTreeMap<Integer,Integer> cnt=new TreeMap<>();\nfor(int c:hand) cnt.merge(c,1,Integer::sum);\nwhile(!cnt.isEmpty()){\n    int first=cnt.firstKey();\n    for(int i=0;i<groupSize;i++){\n        int k=first+i;\n        if(cnt.getOrDefault(k,0)==0) return false;\n        cnt.merge(k,-1,Integer::sum);\n        if(cnt.get(k)==0) cnt.remove(k);\n    }\n}\nreturn true;",
    "variants": [
      "Divide Array in Sets of K Consecutive Numbers (LC 1296)",
      "Task Scheduler (LC 621)"
    ],
    "summary": "Determine if an array of cards can be rearranged into groups of groupSize consecutive cards."
  },
  {
    "id": 1899,
    "name": "Merge Triplets to Form Target Triplet",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "trigger": [
      "element-wise max merge to reach target",
      "select subset of triplets",
      "filter then union"
    ],
    "coreIdea": "Skip any triplet where any element exceeds the target's corresponding value (it corrupts the result). Union valid triplets element-wise (take max). Check if result equals target.",
    "coreIdeaHinglish": "Koi bhi triplet jiska koi element target se bada ho, use skip karo — woh target bigad dega. Baaki valid triplets ko merge karo (element-wise max). End mein check karo result == target.",
    "approach": [
      "res = [0, 0, 0]; a, b, c = target",
      "For each triplet [x, y, z]: if x > a or y > b or z > c: skip",
      "Else: res[i] = max(res[i], triplet[i]) for i in 0..2",
      "Return res == [a, b, c]"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Filter BEFORE merging — a triplet exceeding target in any dimension is useless",
      "Merging is element-wise max, not addition or overwrite",
      "res starts as [0,0,0] — if no valid triplet covers a dimension, answer is False"
    ],
    "code": "// Merge Triplets to Form Target — greedy\nboolean[] good=new boolean[3];\nfor(int[] t:triplets){\n    if(t[0]>target[0]||t[1]>target[1]||t[2]>target[2]) continue;\n    for(int i=0;i<3;i++) if(t[i]==target[i]) good[i]=true;\n}\nreturn good[0]&&good[1]&&good[2];",
    "variants": [
      "Maximum AND Sum of Array (LC 2172)"
    ],
    "summary": "Select and merge triplets using element-wise max to form an exact target triplet; determine if it is possible."
  },
  {
    "id": 763,
    "name": "Partition Labels",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "trigger": [
      "partition string so each letter appears in at most one part",
      "last-occurrence boundary expansion"
    ],
    "coreIdea": "Precompute each char's last index. Sweep, extending current partition's end to the last occurrence of each char seen. Emit partition size when index reaches end.",
    "coreIdeaHinglish": "Har character ki last position yaad rakho. Sweep karo — jab bhi koi char mile, current partition ki end ko us char ki last occurrence tak extend karo. Jab current index end pe pahunche, partition daalo aur naya shuru karo.",
    "approach": [
      "last = {c: i for i, c in enumerate(s)} (keeps rightmost — correct)",
      "start = end = 0, result = []",
      "For i, c in enumerate(s): end = max(end, last[c])",
      "If i == end: result.append(end - start + 1); start = i + 1",
      "Return result"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "Dict comprehension naturally overwrites to rightmost index — that's correct, don't second-guess it",
      "After emitting partition: start = i+1 (not i)",
      "Partition size is end - start + 1"
    ],
    "code": "int[] last=new int[26];\nfor (int i=0;i<s.length();i++) last[s.charAt(i)-'a']=i;\nList<Integer> res=new ArrayList<>();\nint start=0, end=0;\nfor (int i=0;i<s.length();i++) {\n    end=Math.max(end,last[s.charAt(i)-'a']);\n    if (i==end) { res.add(end-start+1); start=i+1; }\n}\nreturn res;",
    "variants": [
      "Non-overlapping Intervals (LC 435)",
      "Merge Intervals (LC 56)"
    ],
    "summary": "Partition a string into as many parts as possible so that each letter appears in at most one part."
  },
  {
    "id": 678,
    "name": "Valid Parenthesis String",
    "difficulty": "Medium",
    "pattern": "Greedy",
    "trigger": [
      "'*' as wildcard for '(' or ')' or empty",
      "valid parens with flexible chars"
    ],
    "coreIdea": "Track range [lo, hi] of possible open-paren counts. '*' fans the range (lo--, hi++). Clamp lo to 0. hi < 0 means impossible. Return lo == 0.",
    "coreIdeaHinglish": "lo aur hi — possible open parens ki min aur max range track karo. '(' pe dono badhao, ')' pe dono ghataao, '*' pe lo ghataao aur hi badhao. Hi 0 se neeche gaya? Impossible. lo ko 0 se neeche kabhi mat jaane do. End mein lo == 0 chahiye.",
    "approach": [
      "lo = hi = 0",
      "For c in s: '(' → lo++, hi++; ')' → lo--, hi--; '*' → lo--, hi++",
      "If hi < 0: return False",
      "lo = max(lo, 0)",
      "Return lo == 0"
    ],
    "time": "O(n)",
    "space": "O(1)",
    "pitfalls": [
      "lo can go negative when '*' acts as ')' — clamp to 0",
      "hi < 0 means even the best case has unmatched ')' — return False immediately",
      "Return lo == 0 (minimum unmatched opens), not hi == 0"
    ],
    "code": "int lo=0, hi=0;\nfor(char c:s.toCharArray()){\n    if(c=='('){lo++;hi++;}\n    else if(c==')'){lo=Math.max(lo-1,0);hi--;}\n    else{lo=Math.max(lo-1,0);hi++;}\n    if(hi<0) return false;\n}\nreturn lo==0;",
    "variants": [
      "Valid Parentheses (LC 20)",
      "Minimum Add to Make Parentheses Valid (LC 921)"
    ],
    "summary": "Determine if a string with '(', ')', and '*' (wildcard for either bracket or empty) is valid."
  }
]);
