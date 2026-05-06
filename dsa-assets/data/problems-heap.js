// Heap / Priority Queue — 6 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 973,
    "name": "K Closest Points to Origin",
    "difficulty": "Medium",
    "pattern": "Heap / Priority Queue",
    "trigger": [
      "k closest points by Euclidean distance",
      "maintain a top-k set without full sort"
    ],
    "coreIdea": "Max-heap of size k. For each point push (-dist², x, y). If heap grows beyond k, pop the farthest. Remaining heap is the k closest.",
    "coreIdeaHinglish": "Size k ka max-heap banao (distance negate karo). Har point push karo. K se bada hua? Farthest pop karo. Akhir me k closest bachte hain.",
    "approach": [
      "For each (x, y): heappush(heap, (-x²-y², x, y))",
      "If len(heap) > k: heappop (removes farthest)",
      "Return [[x,y] for _,x,y in heap]"
    ],
    "time": "O(n log k)",
    "space": "O(k)",
    "pitfalls": [
      "Python heapq is min-heap — negate distance² for max-heap semantics",
      "No need for sqrt — comparing distance² preserves ordering",
      "Alternative: heapq.nsmallest(k, points, key=lambda p: p[0]**2+p[1]**2)"
    ],
    "code": "PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> b[0]*b[0]+b[1]*b[1] - a[0]*a[0]-a[1]*a[1]);\nfor (int[] p : points) {\n    pq.offer(p);\n    if (pq.size() > k) pq.poll();\n}\nreturn pq.toArray(new int[k][]);",
    "variants": [
      "Kth Largest Element in Array (LC 215)",
      "Top K Frequent Elements (LC 347)"
    ],
    "summary": "Return the k points closest to the origin from a list of 2D points."
  },
  {
    "id": 621,
    "name": "Task Scheduler",
    "difficulty": "Medium",
    "pattern": "Heap / Priority Queue",
    "trigger": [
      "minimum intervals to schedule tasks with cooldown n between same tasks",
      "greedy — most frequent task drives the schedule"
    ],
    "coreIdea": "The most frequent task creates idle slots. Formula: (max_freq - 1) × (n + 1) + count_of_tasks_at_max_freq. If enough other tasks fill all idles, answer is just len(tasks).",
    "coreIdeaHinglish": "Sabse frequent task kitni baar aata hai? Woh (n+1) ke blocks me fit hota hai. Baaki tasks idle slots me fill karo. Result = max(total tasks, formula).",
    "approach": [
      "count = Counter(tasks)",
      "max_freq = max(count.values())",
      "max_count = number of tasks with frequency == max_freq",
      "return max(len(tasks), (max_freq-1)*(n+1) + max_count)"
    ],
    "time": "O(n)",
    "space": "O(1) — 26 distinct tasks max",
    "pitfalls": [
      "Formula is (max_freq-1)*(n+1) + max_count — NOT (max_freq)*(n+1)",
      "If len(tasks) > formula, there are no idle slots — answer is len(tasks)",
      "No simulation needed for the basic version"
    ],
    "code": "int[] freq = new int[26];\nfor (char c : tasks) freq[c-'A']++;\nArrays.sort(freq);\nint maxFreq = freq[25], idleSlots = (maxFreq-1)*n;\nfor (int i = 24; i >= 0; i--) idleSlots -= Math.min(freq[i], maxFreq-1);\nreturn tasks.length + Math.max(0, idleSlots);",
    "variants": [
      "Rearrange String K Distance Apart (LC 358)"
    ],
    "summary": "Find the minimum number of CPU intervals to execute all tasks, with n cooldown between identical tasks."
  },
  {
    "id": 215,
    "name": "Kth Largest Element in an Array",
    "difficulty": "Medium",
    "pattern": "Heap / Priority Queue",
    "trigger": [
      "kth largest element (not kth distinct largest)",
      "O(n log k) heap or O(n) QuickSelect"
    ],
    "coreIdea": "Min-heap of size k. Push each element; if heap grows > k, pop the minimum. The heap's root is the kth largest.",
    "coreIdeaHinglish": "Size k ka min-heap banao. Har element push karo. K se bada hua? Minimum pop karo. Akhir me heap ka top kth largest hai — kyunki k-1 bade elements bhi heap me hain.",
    "approach": [
      "heap = []",
      "For n in nums: heappush(n); if len > k: heappop",
      "Return heap[0]"
    ],
    "time": "O(n log k)",
    "space": "O(k)",
    "pitfalls": [
      "Min-heap of size k: root is the kth largest (k-1 larger elements sit above it)",
      "kth LARGEST, not kth smallest — don't negate",
      "QuickSelect gives O(n) avg but is interview-risky; heap is safer"
    ],
    "code": "PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nfor (int n : nums) {\n    minHeap.offer(n);\n    if (minHeap.size() > k) minHeap.poll();\n}\nreturn minHeap.peek();",
    "variants": [
      "K Closest Points to Origin (LC 973)",
      "Top K Frequent Elements (LC 347)"
    ],
    "summary": "Find the kth largest element in an unsorted array without fully sorting it."
  },
  {
    "id": 355,
    "name": "Design Twitter",
    "difficulty": "Medium",
    "pattern": "Heap / Priority Queue",
    "trigger": [
      "social feed: post, follow/unfollow, get top 10 recent tweets from followees",
      "merge k sorted lists with a max-heap"
    ],
    "coreIdea": "Store tweets as (timestamp, tweetId) lists per user. getNewsFeed: seed a max-heap with each followee's most recent tweet, then iteratively pop-and-push-next to merge.",
    "coreIdeaHinglish": "Har user ke tweets list me rakho (latest last). getNewsFeed me sabhi followees ke latest tweet heap me dalo. Pop karo, us user ka next tweet push karo — top 10 lo.",
    "approach": [
      "tweets = defaultdict(list); follows = defaultdict(set)",
      "postTweet: tweets[u].append((global_ts, tid))",
      "getNewsFeed: seed heap with latest tweet per followee; pop + push-next until 10 results"
    ],
    "time": "O(f log f) per getNewsFeed (f = followees)",
    "space": "O(T) total tweets",
    "pitfalls": [
      "User follows themselves implicitly for their own feed",
      "Negate timestamp for max-heap (most recent first)",
      "After popping a tweet, push that user's previous tweet (index-1) if it exists"
    ],
    "code": "Map<Integer, List<int[]>> tweets = new HashMap<>(); // userId -> [[tweetId,time]]\nMap<Integer, Set<Integer>> follows = new HashMap<>();\nint timer = 0;\nvoid postTweet(int u, int tId) { tweets.computeIfAbsent(u,k->new ArrayList<>()).add(new int[]{tId,timer++}); }\nvoid follow(int u, int f) { follows.computeIfAbsent(u,k->new HashSet<>()).add(f); }\nvoid unfollow(int u, int f) { if(follows.containsKey(u)) follows.get(u).remove(f); }\nList<Integer> getNewsFeed(int u) {\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->b[1]-a[1]);\n    Set<Integer> feed = new HashSet<>(follows.getOrDefault(u, new HashSet<>()));\n    feed.add(u);\n    for (int id : feed) for (int[] t : tweets.getOrDefault(id, List.of())) pq.offer(t);\n    List<Integer> res = new ArrayList<>();\n    while (!pq.isEmpty() && res.size() < 10) res.add(pq.poll()[0]);\n    return res;\n}",
    "variants": [
      "Merge K Sorted Lists (LC 23)"
    ],
    "summary": "Design a simplified Twitter supporting tweet, follow, unfollow, and a 10-tweet news feed."
  },
  {
    "id": 1834,
    "name": "Single-Threaded CPU",
    "difficulty": "Medium",
    "pattern": "Heap / Priority Queue",
    "trigger": [
      "simulate CPU: pick available task with smallest processing time",
      "greedy scheduling with time jumps when CPU is idle"
    ],
    "coreIdea": "Sort tasks by enqueue time. Simulate current_time. When CPU is free, push all tasks with enqueue ≤ current_time to a min-heap (processing_time, original_idx). Pop the shortest. If heap is empty, jump to next task's enqueue time.",
    "coreIdeaHinglish": "Enqueue time se sort karo. current_time simulate karo. Heap me available tasks rakho (processing time order). Heap empty? Time jump karo next task ke enqueue time pe.",
    "approach": [
      "Sort tasks by enqueue time (keep original index)",
      "While unprocessed or heap non-empty: push all available; if empty: jump time",
      "Pop (proc_time, orig_idx); advance time; append to result"
    ],
    "time": "O(n log n)",
    "space": "O(n)",
    "pitfalls": [
      "Jump time to tasks[i][1][0] when heap is empty — don't simulate idle ticks",
      "Heap key: (processing_time, original_index) — ties by original index",
      "Must preserve original index after sorting — use enumerate before sort"
    ],
    "code": "// Sort by enqueue time; use min-heap by processing time\nArrays.sort(tasks,(a,b)->a[0]-b[0]);\nPriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);\nint[] order=new int[tasks.length]; int idx=0, time=0, i=0;\nwhile (idx<tasks.length) {\n    while (i<tasks.length && tasks[i][0]<=time) { pq.offer(new int[]{tasks[i][1],tasks[i][2]}); i++; }\n    if (pq.isEmpty()) { time=tasks[i][0]; continue; }\n    int[] t=pq.poll(); time+=t[0]; order[idx++]=t[1];\n}\nreturn order;",
    "variants": [
      "Task Scheduler (LC 621)"
    ],
    "summary": "Given tasks with enqueue times and processing times, output the order a single-threaded CPU processes them."
  },
  {
    "id": 295,
    "name": "Find Median from Data Stream",
    "difficulty": "Hard",
    "pattern": "Heap / Priority Queue",
    "trigger": [
      "median of a growing stream in O(log n) add, O(1) find",
      "two heaps: max-heap (lower half) + min-heap (upper half)"
    ],
    "coreIdea": "Maintain two heaps balanced in size (diff ≤ 1): max-heap for the lower half, min-heap for the upper half. Median is the top of the larger heap, or average of both tops.",
    "coreIdeaHinglish": "Do heaps: max-heap left half ke liye, min-heap right half ke liye. Sizes balance rakho — diff max 1. Median = bade heap ka top, ya dono tops ka average.",
    "approach": [
      "addNum: push to max-heap (small); rebalance cross-heap invariant; balance sizes",
      "findMedian: if equal size: average of tops; else: top of larger heap"
    ],
    "time": "O(log n) add, O(1) find",
    "space": "O(n)",
    "pitfalls": [
      "Python has only min-heap — negate values in small (max-heap)",
      "After each add, check max of small ≤ min of large; if violated, transfer one element",
      "Balance sizes: if |small| > |large|+1 or vice versa, move top between heaps"
    ],
    "code": "PriorityQueue<Integer> small=new PriorityQueue<>(Collections.reverseOrder()); // max-heap\nPriorityQueue<Integer> large=new PriorityQueue<>(); // min-heap\n\nvoid addNum(int num) {\n    small.offer(num);\n    large.offer(small.poll());\n    if (large.size()>small.size()) small.offer(large.poll());\n}\ndouble findMedian() {\n    return small.size()>large.size() ? small.peek() : (small.peek()+large.peek())/2.0;\n}",
    "variants": [
      "Sliding Window Median (LC 480)"
    ],
    "summary": "Design a data structure that supports adding numbers and finding the current median in O(log n)."
  }
]);
