// Intervals — 6 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 56,
    "name": "Merge Intervals",
    "difficulty": "Medium",
    "pattern": "Intervals",
    "trigger": [
      "overlapping intervals",
      "merge/combine ranges",
      "output non-overlapping set"
    ],
    "coreIdea": "Sort by start. For each interval, if it overlaps the last merged (start ≤ last.end), extend the end. Otherwise append.",
    "coreIdeaHinglish": "Intervals ko start ke basis pe sort karo. Phir ek-ek karke dekho — agar naya interval pichle wale se overlap karta hai (start ≤ last.end), toh end ko merge karo (max lo). Nahi toh naya interval daalo.",
    "approach": [
      "Sort intervals by start",
      "Init result with intervals[0]",
      "For each next [s, e]: if s <= result[-1][1]: result[-1][1] = max(result[-1][1], e)",
      "Else: append [s, e]",
      "Return result"
    ],
    "time": "O(n log n)",
    "space": "O(n)",
    "pitfalls": [
      "Take max of ends — don't just assign e (current may be fully inside last)",
      "Must sort by start first",
      "Edge: single interval — return as-is"
    ],
    "code": "Arrays.sort(intervals,(a,b)->a[0]-b[0]);\nList<int[]> res=new ArrayList<>();\nint[] cur=intervals[0];\nfor(int i=1;i<intervals.length;i++){\n    if(intervals[i][0]<=cur[1]) cur[1]=Math.max(cur[1],intervals[i][1]);\n    else{ res.add(cur); cur=intervals[i]; }\n}\nres.add(cur);\nreturn res.toArray(new int[0][]);",
    "variants": [
      "Insert Interval (LC 57)",
      "Non-overlapping Intervals (LC 435)"
    ],
    "summary": "Merge all overlapping intervals from a list and return the resulting non-overlapping intervals."
  },
  {
    "id": 57,
    "name": "Insert Interval",
    "difficulty": "Medium",
    "pattern": "Intervals",
    "trigger": [
      "insert into sorted non-overlapping intervals",
      "merge after insert",
      "no re-sort allowed"
    ],
    "coreIdea": "Three passes: copy intervals ending before new start; merge all overlapping into new; copy remaining.",
    "coreIdeaHinglish": "Pehle saare intervals daalo jo newInterval ke start se pehle khatam hote hain. Phir jo overlap karte hain unhe ek-ek merge karo (min/max lo). Baaki seedha copy karo.",
    "approach": [
      "Add all intervals with end < newInterval[0]",
      "Merge overlapping: while i < n and intervals[i][0] <= newInterval[1]: update new = [min start, max end]; i++",
      "Append merged newInterval",
      "Append remaining intervals[i:]"
    ],
    "time": "O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Overlap condition: intervals[i][0] <= newInterval[1] (not <)",
      "Take min of starts and max of ends during merge",
      "Don't forget to add remaining intervals after the merged block"
    ],
    "code": "List<int[]> res=new ArrayList<>(); boolean inserted=false;\nfor(int[] iv:intervals){\n    if(inserted||iv[1]<newInterval[0]) res.add(iv);\n    else if(iv[0]>newInterval[1]){ res.add(newInterval); res.add(iv); inserted=true; }\n    else{ newInterval[0]=Math.min(newInterval[0],iv[0]); newInterval[1]=Math.max(newInterval[1],iv[1]); }\n}\nif(!inserted) res.add(newInterval);\nreturn res.toArray(new int[0][]);",
    "variants": [
      "Merge Intervals (LC 56)",
      "Range Module (LC 715)"
    ],
    "summary": "Insert a new interval into a sorted non-overlapping list, merging any overlapping intervals."
  },
  {
    "id": 435,
    "name": "Non-overlapping Intervals",
    "difficulty": "Medium",
    "pattern": "Intervals",
    "trigger": [
      "minimum removals to make non-overlapping",
      "maximum non-overlapping subset"
    ],
    "coreIdea": "Sort by end. Greedily keep intervals with earliest end — when two overlap, remove the one with the later end (don't update prevEnd).",
    "coreIdeaHinglish": "Intervals ko end ke basis pe sort karo. Jo sabse pehle khatam ho, use rakho. Agar next wala overlap kare toh use remove (count++) karo aur prevEnd waise hi rakho. Overlap nahi kare toh prevEnd update karo.",
    "approach": [
      "Sort by end time",
      "prevEnd = intervals[0][1], removals = 0",
      "For each next [s, e]: if s < prevEnd: removals++ (overlap — remove current later-ending one)",
      "Else: prevEnd = e",
      "Return removals"
    ],
    "time": "O(n log n)",
    "space": "O(1)",
    "pitfalls": [
      "Sort by END, not start (sorting by start is a classic wrong approach here)",
      "When overlapping: keep prevEnd unchanged (you keep the earlier-ending interval)",
      "Answer is removal count, not kept count"
    ],
    "code": "Arrays.sort(intervals,(a,b)->a[1]-b[1]);\nint count=0, end=Integer.MIN_VALUE;\nfor(int[] iv:intervals){\n    if(iv[0]>=end) end=iv[1]; else count++;\n}\nreturn count;",
    "variants": [
      "Minimum Number of Arrows to Burst Balloons (LC 452)",
      "Merge Intervals (LC 56)"
    ],
    "summary": "Find the minimum number of intervals to remove so the remaining intervals are non-overlapping."
  },
  {
    "id": 252,
    "name": "Meeting Rooms",
    "difficulty": "Easy",
    "pattern": "Intervals",
    "trigger": [
      "can one person attend all meetings?",
      "any two intervals overlap?"
    ],
    "coreIdea": "Sort by start. If any meeting starts before the previous ends, return False.",
    "coreIdeaHinglish": "Meetings ko start time ke basis pe sort karo. Agar koi meeting pichli meeting khatam hone se pehle shuru ho jaye — False. Sab theek rahe toh True.",
    "approach": [
      "Sort by start",
      "For each consecutive pair: if intervals[i][0] < intervals[i-1][1]: return False",
      "Return True"
    ],
    "time": "O(n log n)",
    "space": "O(1)",
    "pitfalls": [
      "Adjacent (start == prevEnd) is fine — use < not <=",
      "Must sort first before checking pairs",
      "Update prevEnd even when no overlap (interval may extend further)"
    ],
    "code": "Arrays.sort(intervals,(a,b)->a[0]-b[0]);\nfor(int i=1;i<intervals.length;i++) if(intervals[i][0]<intervals[i-1][1]) return false;\nreturn true;",
    "variants": [
      "Meeting Rooms II (LC 253)",
      "Non-overlapping Intervals (LC 435)"
    ],
    "summary": "Determine if a person can attend all meetings given an array of meeting time intervals."
  },
  {
    "id": 253,
    "name": "Meeting Rooms II",
    "difficulty": "Medium",
    "pattern": "Intervals",
    "trigger": [
      "minimum rooms for all meetings",
      "maximum simultaneous intervals",
      "peak overlap count"
    ],
    "coreIdea": "Split into separately-sorted starts[] and ends[]. Two-pointer sweep: when next start < next end, allocate a room; else free one.",
    "coreIdeaHinglish": "Starts aur ends ko alag-alag sort karo. Do pointers chalao. Jab naya start current end se pehle aaye, naya room chahiye. Jab nahi chahiye, ek room free — end pointer aage. Peak rooms track karo.",
    "approach": [
      "Sort starts[] and ends[] separately (not as pairs)",
      "s = e = rooms = maxR = 0",
      "While s < n: if starts[s] < ends[e]: rooms++; else: rooms--; e++",
      "maxR = max(maxR, rooms); s++",
      "Return maxR"
    ],
    "time": "O(n log n)",
    "space": "O(n)",
    "pitfalls": [
      "Sort starts and ends independently — don't sort as pairs",
      "Condition is < not <= (equal means previous ended exactly as this starts — no overlap)",
      "Track maxR throughout the sweep, not just at the end"
    ],
    "code": "int[] starts=new int[intervals.length], ends=new int[intervals.length];\nfor(int i=0;i<intervals.length;i++){ starts[i]=intervals[i][0]; ends[i]=intervals[i][1]; }\nArrays.sort(starts); Arrays.sort(ends);\nint rooms=0, j=0;\nfor(int i=0;i<starts.length;i++){\n    if(starts[i]<ends[j]) rooms++; else j++;\n}\nreturn rooms;",
    "variants": [
      "Meeting Rooms (LC 252)",
      "Minimum Number of Platforms (classic)"
    ],
    "summary": "Find the minimum number of conference rooms required to schedule all meetings."
  },
  {
    "id": 1851,
    "name": "Minimum Interval to Include Each Query",
    "difficulty": "Hard",
    "pattern": "Intervals",
    "trigger": [
      "for each query find smallest containing interval",
      "offline queries on intervals",
      "min-heap sweep"
    ],
    "coreIdea": "Sort intervals by start; process queries offline sorted. Min-heap keyed by size. Per query: push all intervals with start ≤ q; pop expired (end < q); answer is heap top's size.",
    "coreIdeaHinglish": "Intervals ko start ke hisaab se sort karo. Queries ko bhi sort karo (original index yaad rakho). Har query ke liye heap mein wo intervals daalo jinka start ≤ query hai. Jinka end bhi query se chhota hai unhe nikaalo. Heap top answer hai.",
    "approach": [
      "Sort intervals by start; sort queries with original indices",
      "Min-heap keyed by (size = r-l+1, r)",
      "For each query q: push all intervals with start <= q onto heap",
      "Pop heap while heap[0][1] < q (interval ended before query)",
      "ans[qi] = heap[0][0] if heap else -1"
    ],
    "time": "O((n+q) log n)",
    "space": "O(n+q)",
    "pitfalls": [
      "Heap key is interval SIZE (r-l+1), not start time",
      "Must restore original query order in the output (use index map)",
      "Lazy deletion: pop expired intervals only when peeking, not eagerly"
    ],
    "code": "int[][] sorted=queries.clone(); Arrays.sort(sorted,(a,b)->a[1]-b[1]);\nTreeMap<Integer,Integer> map=new TreeMap<>();\nint[] ans=new int[queries.length]; int si=0;\nfor(int[] q:sorted){\n    while(si<ranges.length&&ranges[si][0]<=q[0]){ map.merge(ranges[si][1],1,Integer::sum); si++; }\n    Map.Entry<Integer,Integer> e=map.ceilingEntry(q[1]);\n    q[2]=e==null?-1:e.getValue();\n}\n// fill ans by original query index\nreturn ans;",
    "variants": [
      "Meeting Rooms II (LC 253)",
      "My Calendar I (LC 729)"
    ],
    "summary": "For each query value, find the length of the smallest interval [l, r] such that l ≤ query ≤ r."
  }
]);
