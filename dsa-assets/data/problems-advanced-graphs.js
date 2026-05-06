// Advanced Graphs — 5 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 743,
    "name": "Network Delay Time",
    "difficulty": "Medium",
    "pattern": "Advanced Graphs",
    "trigger": [
      "shortest time for signal to reach all nodes from source",
      "Dijkstra's single-source shortest path"
    ],
    "coreIdea": "Dijkstra from source k. Min-heap of (time, node). Relax edges greedily. Answer is the max shortest path across all nodes — if any node is unreachable, return -1.",
    "coreIdeaHinglish": "Dijkstra karo source k se. Min-heap me (time, node). Sabse kam time wala pehle process karo. Sabhi nodes ka shortest path ka max = answer. Koi unreachable? Return -1.",
    "approach": [
      "Build adjacency list; dist = {k: 0}; heap = [(0, k)]",
      "While heap: t, node = heappop; if t > dist[node]: skip; relax neighbors",
      "Return max(dist.values()) if len(dist)==n else -1"
    ],
    "time": "O((V+E) log V)",
    "space": "O(V+E)",
    "pitfalls": [
      "Skip stale heap entries: if t > dist[node]: continue",
      "Dijkstra only works with non-negative weights",
      "Answer is MAX of all shortest paths (slowest to reach all nodes)"
    ],
    "code": "Map<Integer,List<int[]>> adj=new HashMap<>();\nfor(int[] e:times){ adj.computeIfAbsent(e[0],k->new ArrayList<>()).add(new int[]{e[1],e[2]}); }\nint[] dist=new int[n+1]; Arrays.fill(dist,Integer.MAX_VALUE); dist[k]=0;\nPriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);\npq.offer(new int[]{0,k});\nwhile(!pq.isEmpty()){\n    int[] cur=pq.poll(); int d=cur[0],u=cur[1];\n    if(d>dist[u]) continue;\n    for(int[] e:adj.getOrDefault(u,List.of())){\n        int nd=d+e[1];\n        if(nd<dist[e[0]]){ dist[e[0]]=nd; pq.offer(new int[]{nd,e[0]}); }\n    }\n}\nint ans=0;\nfor(int i=1;i<=n;i++){ if(dist[i]==Integer.MAX_VALUE) return -1; ans=Math.max(ans,dist[i]); }\nreturn ans;",
    "variants": [
      "Cheapest Flights Within K Stops (LC 787)",
      "Path with Minimum Effort (LC 1631)"
    ],
    "summary": "Given a weighted directed graph, find the time for all nodes to receive a signal sent from node k."
  },
  {
    "id": 332,
    "name": "Reconstruct Itinerary",
    "difficulty": "Hard",
    "pattern": "Advanced Graphs",
    "trigger": [
      "use all flight tickets exactly once; lexicographically smallest itinerary",
      "Eulerian path — Hierholzer's algorithm"
    ],
    "coreIdea": "Sort neighbors lexicographically. DFS: always take the smallest available destination first. Append to result AFTER all edges from a node are used (post-order). Reverse at the end.",
    "coreIdeaHinglish": "Neighbors ko sort karo. DFS: hamesha sabse chhota destination pehle. Node ke saare edges use ho jaayein, tab result me add karo (post-order). Reverse karo akhir me.",
    "approach": [
      "adj = {src: sorted(dests) for each ticket}",
      "dfs(node): while adj[node]: dfs(adj[node].pop(0)); result.append(node)",
      "Return result reversed"
    ],
    "time": "O(E log E) sorting",
    "space": "O(V+E)",
    "pitfalls": [
      "Post-order append — add node AFTER all its outgoing edges are exhausted",
      "Use a sorted list and pop from front (or sort reversed, pop from end for efficiency)",
      "Guaranteed to have a valid Eulerian path from 'JFK'"
    ],
    "code": "Map<String,PriorityQueue<String>> adj=new HashMap<>();\nfor(String[] t:tickets) adj.computeIfAbsent(t[0],k->new PriorityQueue<>()).add(t[1]);\nList<String> route=new ArrayList<>();\nvoid dfs(String airport) {\n    PriorityQueue<String> pq=adj.get(airport);\n    while(pq!=null&&!pq.isEmpty()) dfs(pq.poll());\n    route.add(0,airport);\n}\ndfs(\"JFK\");\nreturn route;",
    "variants": [
      "Network Delay Time (LC 743)"
    ],
    "summary": "Reconstruct a valid flight itinerary from a list of tickets, using every ticket exactly once."
  },
  {
    "id": 778,
    "name": "Swim in Rising Water",
    "difficulty": "Hard",
    "pattern": "Advanced Graphs",
    "trigger": [
      "minimum time to swim from (0,0) to (n-1,n-1) where you can move when water >= cell value",
      "Dijkstra or binary search + BFS"
    ],
    "coreIdea": "Modified Dijkstra: min-heap of (max_elevation_on_path, r, c). For each neighbor, the cost is max(current_max, grid[nr][nc]). Find the path that minimizes the maximum cell value.",
    "coreIdeaHinglish": "Dijkstra karo, par cost = max elevation path pe. Har step pe max(current_max, grid[nr][nc]) track karo. Bottom-right tak minimum max elevation = answer.",
    "approach": [
      "heap = [(grid[0][0], 0, 0)]; visited = set()",
      "Pop (cost, r, c): if (n-1,n-1): return cost",
      "Push neighbors with max(cost, grid[nr][nc])"
    ],
    "time": "O(n² log n)",
    "space": "O(n²)",
    "pitfalls": [
      "Cost is the MAX elevation on the path, not sum — modified Dijkstra",
      "Mark visited before pushing (or on pop) to avoid reprocessing",
      "Binary search + BFS is an alternative: binary search on answer, BFS to check feasibility"
    ],
    "code": "int n=grid.length;\nint[][] dist=new int[n][n];\nfor (int[] r:dist) Arrays.fill(r,Integer.MAX_VALUE);\ndist[0][0]=grid[0][0];\nPriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);\npq.offer(new int[]{grid[0][0],0,0});\nint[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};\nwhile (!pq.isEmpty()) {\n    int[] cur=pq.poll(); int d=cur[0],r=cur[1],c=cur[2];\n    if (d>dist[r][c]) continue;\n    if (r==n-1&&c==n-1) return d;\n    for (int[] dir:dirs) {\n        int nr=r+dir[0],nc=c+dir[1];\n        if (nr>=0&&nr<n&&nc>=0&&nc<n) {\n            int nd=Math.max(d,grid[nr][nc]);\n            if (nd<dist[nr][nc]) { dist[nr][nc]=nd; pq.offer(new int[]{nd,nr,nc}); }\n        }\n    }\n}\nreturn dist[n-1][n-1];",
    "variants": [
      "Path with Minimum Effort (LC 1631)",
      "Network Delay Time (LC 743)"
    ],
    "summary": "Find the minimum time (elevation level) at which you can swim from the top-left to the bottom-right of a grid."
  },
  {
    "id": 269,
    "name": "Alien Dictionary",
    "difficulty": "Hard",
    "pattern": "Advanced Graphs",
    "trigger": [
      "derive character ordering from sorted alien word list",
      "topological sort on character dependency graph"
    ],
    "coreIdea": "Compare adjacent words to extract ordering constraints (u comes before v). Build a directed graph and topological sort (Kahn's BFS). If cycle → return ''.",
    "coreIdeaHinglish": "Adjacent words compare karo — pehla alag char batata hai order. Graph banao, topological sort karo. Cycle hai? Return empty string.",
    "approach": [
      "Extract edges: for each adjacent word pair, find first differing char",
      "Kahn's BFS: in-degree, process 0-in-degree nodes",
      "If output length < unique chars: cycle exists"
    ],
    "time": "O(C) where C = total chars in all words",
    "space": "O(1) — 26 chars max",
    "pitfalls": [
      "If word2 is a prefix of word1 and comes first → invalid (['abc','ab']) return ''",
      "Only compare adjacent words (not all pairs)",
      "All unique chars must appear in the output — check length for cycle detection"
    ],
    "code": "List<Character> order=new ArrayList<>();\nMap<Character,Set<Character>> adj=new HashMap<>();\nMap<Character,Integer> inDeg=new HashMap<>();\nfor(String w:words) for(char c:w.toCharArray()){ adj.putIfAbsent(c,new HashSet<>()); inDeg.putIfAbsent(c,0); }\nfor(int i=0;i<words.length-1;i++){\n    String a=words[i],b=words[i+1]; int len=Math.min(a.length(),b.length());\n    if(a.length()>b.length()&&a.startsWith(b)) return \"\";\n    for(int j=0;j<len;j++) if(a.charAt(j)!=b.charAt(j)){ if(!adj.get(a.charAt(j)).contains(b.charAt(j))){ adj.get(a.charAt(j)).add(b.charAt(j)); inDeg.merge(b.charAt(j),1,Integer::sum); } break; }\n}\nQueue<Character> q=new LinkedList<>();\nfor(char c:inDeg.keySet()) if(inDeg.get(c)==0) q.add(c);\nwhile(!q.isEmpty()){ char c=q.poll(); order.add(c); for(char nb:adj.get(c)){ if(inDeg.merge(nb,-1,Integer::sum)==0) q.add(nb); } }\nif(order.size()!=inDeg.size()) return \"\";\nStringBuilder sb=new StringBuilder(); for(char c:order) sb.append(c); return sb.toString();",
    "variants": [
      "Course Schedule II (LC 210)",
      "Sequence Reconstruction (LC 444)"
    ],
    "summary": "Given words sorted in an alien alphabet, determine the character ordering of that alphabet."
  },
  {
    "id": 787,
    "name": "Cheapest Flights Within K Stops",
    "difficulty": "Medium",
    "pattern": "Advanced Graphs",
    "trigger": [
      "cheapest flight from src to dst with at most k stops",
      "Bellman-Ford for k relaxations (not Dijkstra — K-stop constraint)"
    ],
    "coreIdea": "Bellman-Ford with exactly k+1 relaxations. After i relaxations, prices[v] = cheapest price using at most i edges. Use a copy of prices per round to avoid using edges from the same round.",
    "coreIdeaHinglish": "Bellman-Ford k+1 rounds chalao. i-th round ke baad prices[v] = i edges me cheapest cost. Har round me copy use karo — same round ke edges avoid karne ke liye.",
    "approach": [
      "prices = [inf]*n; prices[src]=0",
      "For _ in range(k+1): tmp = prices.copy(); for each edge (u,v,w): tmp[v] = min(tmp[v], prices[u]+w)",
      "prices = tmp; Return prices[dst] if != inf else -1"
    ],
    "time": "O(K·E)",
    "space": "O(n)",
    "pitfalls": [
      "Use a COPY of prices at the start of each round — prevents using multiple edges from the same round",
      "k STOPS means k+1 edges — run k+1 rounds",
      "Dijkstra doesn't work here — the K constraint changes which path is optimal"
    ],
    "code": "int[] dist=new int[n]; Arrays.fill(dist,Integer.MAX_VALUE); dist[src]=0;\nfor(int i=0;i<k;i++){\n    int[] tmp=dist.clone();\n    for(int[] f:flights){\n        int u=f[0],v=f[1],w=f[2];\n        if(dist[u]!=Integer.MAX_VALUE && dist[u]+w<tmp[v]) tmp[v]=dist[u]+w;\n    }\n    dist=tmp;\n}\nreturn dist[dst]==Integer.MAX_VALUE ? -1 : dist[dst];",
    "variants": [
      "Network Delay Time (LC 743) — Dijkstra (no K constraint)",
      "Path with Maximum Probability (LC 1514)"
    ],
    "summary": "Find the cheapest price to fly from source to destination with at most k stops."
  }
]);
