// Stack — 8 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 739,
    "name": "Daily Temperatures",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "next warmer day for each index",
      "monotonic decreasing stack"
    ],
    "coreIdea": "Monotonic decreasing stack of (temp, index). When a warmer day arrives, pop all colder days — their wait time is now known (current index - stored index).",
    "coreIdeaHinglish": "Stack me (temp, index) rakho. Warmer day mila? Sab colder elements pop karo aur unka answer fill karo. Stack sirf un elements ka hai jinka answer abhi pata nahi.",
    "approach": [
      "ans = [0]*n, stack = []",
      "For i, t: while stack and t > stack[-1][0]: _, i0 = pop; ans[i0] = i - i0",
      "stack.append((t, i))"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Store INDEX in the stack — needed to compute the distance",
      "Initialize ans = [0]*n — remaining zeros correctly mean 'no warmer day'",
      "Strictly greater (t > top): equal temperature is NOT warmer"
    ],
    "code": "int[] res = new int[temperatures.length];\nDeque<Integer> stack = new ArrayDeque<>();\nfor (int i = 0; i < temperatures.length; i++) {\n    while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()])\n        res[stack.peek()] = i - stack.pop();\n    stack.push(i);\n}\nreturn res;",
    "variants": [
      "Next Greater Element I (LC 496)",
      "Online Stock Span (LC 901)"
    ],
    "animation": "monoStack",
    "summary": "For each day's temperature, return how many days you must wait for a warmer temperature (0 if none)."
  },
  {
    "id": 22,
    "name": "Generate Parentheses",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "all valid combinations of n pairs of parentheses",
      "backtracking with open/close count constraints"
    ],
    "coreIdea": "Backtrack with two rules: add '(' only when open < n; add ')' only when close < open. When both reach n, record the string.",
    "coreIdeaHinglish": "Backtrack karo. '(' tabhi add karo jab open < n. ')' tabhi add karo jab close < open — kyunki close kabhi open se aage nahi ja sakta. Dono n ho gaye? Result me daalo.",
    "approach": [
      "bt(open, close, curr): if open == close == n: append; return",
      "If open < n: bt(open+1, close, curr+'(')",
      "If close < open: bt(open, close+1, curr+')')"
    ],
    "time": "O(4ⁿ / √n) — Catalan number",
    "space": "O(n) stack depth",
    "pitfalls": [
      "close < open (not <=) — closing bracket can't precede a matching open bracket",
      "n is number of PAIRS — total string length is 2n",
      "No explicit validity check needed — constraints guarantee validity"
    ],
    "code": "List<String> res = new ArrayList<>();\nvoid bt(StringBuilder cur, int open, int close, int n) {\n    if (cur.length() == 2*n) { res.add(cur.toString()); return; }\n    if (open < n)  { cur.append('('); bt(cur, open+1, close, n); cur.deleteCharAt(cur.length()-1); }\n    if (close < open) { cur.append(')'); bt(cur, open, close+1, n); cur.deleteCharAt(cur.length()-1); }\n}\nbt(new StringBuilder(), 0, 0, n);\nreturn res;",
    "variants": [
      "Letter Combinations of a Phone Number (LC 17)",
      "Valid Parentheses (LC 20)"
    ],
    "summary": "Generate all combinations of n pairs of well-formed parentheses."
  },
  {
    "id": 150,
    "name": "Evaluate Reverse Polish Notation",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "evaluate postfix (RPN) expression",
      "operators applied to the last two stack elements"
    ],
    "coreIdea": "Stack. Numbers → push. Operator → pop b then a, compute a op b, push result. Order matters: b is popped first.",
    "coreIdeaHinglish": "Number mila? Push. Operator mila? Do pop karo — pehla pop b, doosra pop a. a op b compute karo aur push. Note karo: b pehle nikalta hai, a baad me.",
    "approach": [
      "For each token: if operator: b = pop, a = pop; push(a op b)",
      "Else: push(int(token))",
      "Return stack[0]"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Pop order: b = stack.pop() first, then a — compute a-b and a/b, not b-a",
      "Division truncates toward zero: use int(a/b), NOT a//b (Python floor-divides negatives differently)",
      "Check token in a SET {'+','-','*','/'} to avoid catching negative number strings"
    ],
    "code": "Deque<Long> stack = new ArrayDeque<>();\nfor (String tok : tokens) {\n    if (\"+-*/\".contains(tok)) {\n        long b = stack.pop(), a = stack.pop();\n        stack.push(tok.equals(\"+\") ? a+b : tok.equals(\"-\") ? a-b : tok.equals(\"*\") ? a*b : a/b);\n    } else stack.push(Long.parseLong(tok));\n}\nreturn (int) stack.pop();",
    "variants": [
      "Basic Calculator (LC 224)",
      "Basic Calculator II (LC 227)"
    ],
    "summary": "Evaluate an arithmetic expression given in Reverse Polish Notation."
  },
  {
    "id": 853,
    "name": "Car Fleet",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "count fleets reaching destination — cars that can't overtake merge",
      "sort by position + monotonic stack of arrival times"
    ],
    "coreIdea": "Sort cars by position descending (closest to target first). Compute time-to-destination per car. If a car's time ≤ the fleet ahead's time, it merges. Stack tracks distinct fleet times.",
    "coreIdeaHinglish": "Position se descending sort karo. Har car ka time = (target - pos) / speed. Agar time ≤ pichle fleet ka time hai, woh merge ho jaati hai — push mat karo. Stack ka size = fleet count.",
    "approach": [
      "Sort (position, speed) by -position",
      "For each car: t = (target - pos) / speed",
      "If stack and t <= stack[-1]: skip (merged)",
      "Else: stack.append(t); return len(stack)"
    ],
    "time": "O(n log n)",
    "space": "O(n)",
    "pitfalls": [
      "Sort DESCENDING by position — process cars closest to target first",
      "Merge when time ≤ (not <) stack top — equal arrival = simultaneous = same fleet",
      "Answer is len(stack), not any other count"
    ],
    "code": "// Fleet count: cars behind faster ones join their fleet\nint fleets = 0;\ndouble[] times = new double[position.length];\nInteger[] idx = IntStream.range(0, position.length).boxed().toArray(Integer[]::new);\nArrays.sort(idx, (a,b) -> position[b] - position[a]);\ndouble prev = 0;\nfor (int i : idx) {\n    double t = (double)(target - position[i]) / speed[i];\n    if (t > prev) { fleets++; prev = t; }\n}\nreturn fleets;",
    "variants": [
      "Car Fleet II (LC 1776)"
    ],
    "summary": "Find how many groups of cars (fleets) arrive at a destination, where a faster car behind a slower one merges into its fleet."
  },
  {
    "id": 71,
    "name": "Simplify Path",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "simplify Unix path: handle '..', '.', and multiple consecutive slashes"
    ],
    "coreIdea": "Split on '/'. For each part: '..' → pop stack (if non-empty); '.' or '' → skip; else → push. Rejoin with '/' and prepend '/'.",
    "coreIdeaHinglish": "Path ko '/' pe split karo. '..' mila? Stack se pop. '.' ya empty string? Skip. Baaki sab push. Akhir me '/' + '/'.join(stack) return karo.",
    "approach": [
      "stack = []",
      "For part in path.split('/'): if '..': pop if stack; elif '' or '.': skip; else: push",
      "Return '/' + '/'.join(stack)"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Multiple slashes produce empty strings from split — skip '' tokens",
      "'..' on empty stack → do nothing (already at root)",
      "Always prepend '/' — root is always present in an absolute path"
    ],
    "code": "Deque<String> stack=new ArrayDeque<>();\nfor (String part : path.split(\"/\")) {\n    if (part.equals(\"..\")) { if (!stack.isEmpty()) stack.pop(); }\n    else if (!part.isEmpty() && !part.equals(\".\")) stack.push(part);\n}\nStringBuilder sb=new StringBuilder();\nfor (String s : stack) sb.insert(0,\"/\"+s);\nreturn sb.length()==0 ? \"/\" : sb.toString();",
    "variants": [
      "Longest Absolute File Path (LC 388)"
    ],
    "summary": "Simplify a Unix-style file path by resolving dots, double-dots, and consecutive slashes."
  },
  {
    "id": 394,
    "name": "Decode String",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "decode nested k[encoded_string] format",
      "brackets can be nested — stack handles depth"
    ],
    "coreIdea": "Two stacks: multipliers and strings. On '[': push state and reset. On ']': pop previous string and repeat current k times, prepend.",
    "coreIdeaHinglish": "Do stacks — ek multipliers ke liye, ek strings ke liye. '[' mila? Dono push karo, reset. ']' mila? Pop karo, current string ko k baar repeat karo aur pehle wali string se jodo.",
    "approach": [
      "count_stack, str_stack, curr='', k=0",
      "Digit: k = k*10 + int(c)",
      "'[': push k, curr; reset curr='', k=0",
      "']': curr = str_stack.pop() + count_stack.pop() * curr"
    ],
    "time": "O(n × max_k)",
    "space": "O(n)",
    "pitfalls": [
      "k can be multi-digit: k = k*10 + int(c), not just int(c)",
      "On ']': old string PREPENDS — curr = old_str + k * curr (order matters)",
      "Letters outside brackets accumulate naturally into curr"
    ],
    "code": "Deque<Integer> countStack=new ArrayDeque<>();\nDeque<StringBuilder> strStack=new ArrayDeque<>();\nStringBuilder cur=new StringBuilder(); int k=0;\nfor (char c : s.toCharArray()) {\n    if (Character.isDigit(c)) k=k*10+(c-'0');\n    else if (c=='[') { countStack.push(k); strStack.push(cur); cur=new StringBuilder(); k=0; }\n    else if (c==']') {\n        int rep=countStack.pop(); StringBuilder prev=strStack.pop();\n        for (int i=0;i<rep;i++) prev.append(cur);\n        cur=prev;\n    } else cur.append(c);\n}\nreturn cur.toString();",
    "variants": [
      "Number of Atoms (LC 726)",
      "Basic Calculator (LC 224)"
    ],
    "summary": "Decode a string encoded as k[encoded_string] where k is the repeat count; nesting is possible."
  },
  {
    "id": 901,
    "name": "Online Stock Span",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "consecutive days (including today) where price ≤ today (streaming)",
      "monotonic decreasing stack with span accumulation"
    ],
    "coreIdea": "Stack of (price, span). When today's price ≥ top, pop and add its span to today's. O(1) amortized — each element is pushed and popped exactly once.",
    "coreIdeaHinglish": "Stack me (price, span) rakho. Aaj ka price pichle se bada ya barabar? Pop karo aur unka span accumulate karo. Sirf decreasing prices stack me rehte hain.",
    "approach": [
      "self.stack = []  # (price, span)",
      "next(price): span = 1",
      "While stack and price >= stack[-1][0]: span += stack.pop()[1]",
      "stack.append((price, span)); return span"
    ],
    "time": "O(1) amortized",
    "space": "O(n)",
    "pitfalls": [
      "Store SPAN in stack, not index — spans accumulate across pops",
      "Pop when price >= top (equal prices count as continuation of span)",
      "Reset span = 1 at start of each next() call, then accumulate popped spans"
    ],
    "code": "// Stock Span — monotone stack storing [price, span]\nDeque<int[]> stack = new ArrayDeque<>();\nint next(int price) {\n    int span = 1;\n    while (!stack.isEmpty() && stack.peek()[0] <= price)\n        span += stack.pop()[1];\n    stack.push(new int[]{price, span});\n    return span;\n}",
    "variants": [
      "Daily Temperatures (LC 739)",
      "Next Greater Element II (LC 503)"
    ],
    "summary": "Design a stock price tracker that, for each day's price, returns how many consecutive days the price was at most as high."
  },
  {
    "id": 402,
    "name": "Remove K Digits",
    "difficulty": "Medium",
    "pattern": "Stack",
    "trigger": [
      "remove k digits to form the smallest possible number",
      "monotonic increasing stack — greedily remove larger leading digits"
    ],
    "coreIdea": "Build a monotonic increasing stack. When a new digit is smaller than the top, pop (one removal). After k removals, append remaining as-is. Strip leading zeros.",
    "coreIdeaHinglish": "Monotonic increasing stack banao. Naya digit top se chota hai? Pop karo — woh ek removal hai. k removals ke baad ruk jao. Leading zeros hatao. Agar k bache, end se katao.",
    "approach": [
      "stack = [], k_rem = k",
      "For d: while k_rem and stack and d < stack[-1]: pop, k_rem--; push d",
      "If k_rem: stack = stack[:-k_rem]",
      "Return ''.join(stack).lstrip('0') or '0'"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "After loop: if k_rem > 0, remove last k_rem digits (they're the largest remaining)",
      "Strip leading zeros then return '0' if string is empty",
      "Use strict < for pop — equal digits stay in order (preserves smallest)"
    ],
    "code": "Deque<Character> stack=new ArrayDeque<>();\nfor (char c : num.toCharArray()) {\n    while (k>0 && !stack.isEmpty() && stack.peek()<c) { stack.pop(); k--; }\n    stack.push(c);\n}\nwhile (k-->0) stack.pop();\nStringBuilder sb=new StringBuilder();\nboolean leadingZero=true;\nfor (char c : stack) { if (leadingZero && c=='0') continue; leadingZero=false; sb.append(c); }\nreturn sb.length()==0 ? \"0\" : sb.toString();",
    "variants": [
      "Remove Duplicate Letters (LC 316)",
      "Find the Most Competitive Subsequence (LC 1673)"
    ],
    "summary": "Remove k digits from a number string to produce the smallest possible remaining number."
  }
]);
