// Graphs — 12 problems
window.PROBLEMS = (window.PROBLEMS || []).concat([
  {
    "id": 200,
    "name": "Number of Islands",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "count connected components of '1's in a grid"
    ],
    "coreIdea": "DFS/BFS from each unvisited '1'. Mark all reachable '1's as visited (overwrite with '0'). Count how many times you start a DFS.",
    "coreIdeaHinglish": "Har unvisited '1' se DFS shuru karo. Saare reachable '1' ko '0' se mark karo. Kitni baar DFS start hua, utne islands.",
    "approach": [
      "For each (r,c) where grid[r][c]=='1': count++; dfs(r,c)",
      "dfs: grid[r][c]='0'; recurse all 4 neighbors in bounds with value '1'"
    ],
    "time": "O(M·N)",
    "space": "O(M·N) recursion",
    "pitfalls": [
      "Mark '0' BEFORE recursing — prevents infinite loops on cycles (there are none in a grid, but marks avoid revisiting)",
      "Bounds check before value check in DFS",
      "BFS alternative: use a queue, same marking"
    ],
    "code": "int count = 0;\nvoid dfs(char[][] grid, int r, int c) {\n    if (r<0||r>=grid.length||c<0||c>=grid[0].length||grid[r][c]!='1') return;\n    grid[r][c]='0';\n    dfs(grid,r+1,c); dfs(grid,r-1,c); dfs(grid,r,c+1); dfs(grid,r,c-1);\n}\nfor (int r=0; r<grid.length; r++) for (int c=0; c<grid[0].length; c++)\n    if (grid[r][c]=='1') { dfs(grid,r,c); count++; }\nreturn count;",
    "variants": [
      "Max Area of Island (LC 695)",
      "Number of Connected Components (LC 323)"
    ],
    "animation": "floodFill",
    "summary": "Count the number of islands — groups of connected '1' (land) cells — in a binary grid."
  },
  {
    "id": 133,
    "name": "Clone Graph",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "deep copy an undirected graph with cycles"
    ],
    "coreIdea": "DFS/BFS with a visited HashMap: original_node → clone_node. Before cloning neighbors, check if they're already in the map to handle cycles.",
    "coreIdeaHinglish": "HashMap banao: original → clone. DFS/BFS karo. Neighbor already map me hai? Wahi use karo (cycles handle hote hain). Nahi hai? New node banao.",
    "approach": [
      "cloned = {}",
      "dfs(node): if node in cloned: return cloned[node]",
      "cloned[node] = Node(node.val)",
      "cloned[node].neighbors = [dfs(n) for n in node.neighbors]"
    ],
    "time": "O(V+E)",
    "space": "O(V)",
    "pitfalls": [
      "Create the clone BEFORE recursing into neighbors — otherwise cycles cause infinite recursion",
      "Return cloned[node] immediately if already visited",
      "Handle null input (empty graph)"
    ],
    "code": "Map<Node,Node> visited = new HashMap<>();\nNode clone(Node node) {\n    if (node==null) return null;\n    if (visited.containsKey(node)) return visited.get(node);\n    Node copy = new Node(node.val);\n    visited.put(node, copy);\n    for (Node n : node.neighbors) copy.neighbors.add(clone(n));\n    return copy;\n}\nreturn clone(node);",
    "variants": [
      "Copy List with Random Pointer (LC 138)"
    ],
    "summary": "Return a deep copy of a connected undirected graph, given a reference to any of its nodes."
  },
  {
    "id": 207,
    "name": "Course Schedule",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "detect cycle in a directed graph (can all courses be finished?)",
      "topological sort feasibility"
    ],
    "coreIdea": "DFS cycle detection with 3 states per node: unvisited (0), in-progress (1), done (2). If DFS reaches a node in state 1 → cycle exists.",
    "coreIdeaHinglish": "Har node ke teen states: unvisited, in-progress, done. DFS karo. Agar in-progress node dobara mile, cycle hai. Cycle nahi? Courses possible.",
    "approach": [
      "Build adjacency list; state = [0]*numCourses",
      "dfs(node): if state==1: return False (cycle); if state==2: return True",
      "state=1; recurse neighbors; state=2; return True"
    ],
    "time": "O(V+E)",
    "space": "O(V+E)",
    "pitfalls": [
      "Three states (not two) — 'done' state lets you skip already-verified nodes",
      "Call DFS for every node (graph may be disconnected)",
      "Kahn's BFS (in-degree reduction) is the alternative"
    ],
    "code": "List<List<Integer>> adj = new ArrayList<>();\nfor (int i=0;i<numCourses;i++) adj.add(new ArrayList<>());\nfor (int[] p:prerequisites) adj.get(p[1]).add(p[0]);\nint[] state=new int[numCourses]; // 0=unvisited,1=visiting,2=done\nboolean dfs(int u) {\n    if(state[u]==1) return false; if(state[u]==2) return true;\n    state[u]=1;\n    for (int v:adj.get(u)) if(!dfs(v)) return false;\n    state[u]=2; return true;\n}\nfor (int i=0;i<numCourses;i++) if(!dfs(i)) return false;\nreturn true;",
    "variants": [
      "Course Schedule II (LC 210) — return order",
      "Alien Dictionary (LC 269)"
    ],
    "summary": "Given course prerequisites, determine if it is possible to finish all courses (detect cycle)."
  },
  {
    "id": 210,
    "name": "Course Schedule II",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "topological sort order of courses",
      "return one valid ordering or [] if cycle"
    ],
    "coreIdea": "DFS post-order topological sort. After all neighbors of a node are processed (state=2), append it to the result. Reverse at the end for topological order.",
    "coreIdeaHinglish": "DFS post-order: saare neighbors process ho jaayein, tab node ko result me add karo. Reverse karo akhir me — yeh topological order hai.",
    "approach": [
      "Same 3-state DFS as LC 207",
      "When marking state=2: result.append(node)",
      "If cycle detected: return []",
      "Return result reversed"
    ],
    "time": "O(V+E)",
    "space": "O(V+E)",
    "pitfalls": [
      "Post-order append (AFTER recursing all neighbors) gives reverse topological order",
      "Must reverse the result at the end",
      "Kahn's BFS: use in-degree array and queue — appends in forward topo order directly"
    ],
    "code": "List<List<Integer>> adj=new ArrayList<>();\nfor(int i=0;i<numCourses;i++) adj.add(new ArrayList<>());\nfor(int[] p:prerequisites) adj.get(p[1]).add(p[0]);\nint[] state=new int[numCourses]; List<Integer> order=new ArrayList<>();\nboolean dfs(int u) {\n    if(state[u]==1) return false; if(state[u]==2) return true;\n    state[u]=1; for(int v:adj.get(u)) if(!dfs(v)) return false;\n    state[u]=2; order.add(u); return true;\n}\nfor(int i=0;i<numCourses;i++) if(!dfs(i)) return new int[]{};\nCollections.reverse(order);\nreturn order.stream().mapToInt(Integer::intValue).toArray();",
    "variants": [
      "Course Schedule (LC 207)",
      "Alien Dictionary (LC 269)"
    ],
    "summary": "Return a valid ordering to finish all courses given prerequisites, or empty if impossible."
  },
  {
    "id": 695,
    "name": "Max Area of Island",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "maximum area of a connected island of 1s in a grid"
    ],
    "coreIdea": "DFS from each unvisited 1. DFS returns the area of that island (count of connected cells). Track the maximum across all islands.",
    "coreIdeaHinglish": "Har unvisited 1 se DFS karo. DFS us island ka area return kare. Maximum track karo.",
    "approach": [
      "For each (r,c)==1: ans = max(ans, dfs(r,c))",
      "dfs: if out-of-bounds or not 1: return 0; grid[r][c]=0; return 1 + dfs(4 dirs)"
    ],
    "time": "O(M·N)",
    "space": "O(M·N) recursion",
    "pitfalls": [
      "Mark 0 BEFORE recursing to avoid revisiting",
      "DFS returns area (1 + sum of neighbor areas) — not just True/False",
      "Same as LC 200 but return area instead of just counting starts"
    ],
    "code": "int dfs(int[][] grid, int r, int c) {\n    if (r<0||r>=grid.length||c<0||c>=grid[0].length||grid[r][c]==0) return 0;\n    grid[r][c]=0;\n    return 1+dfs(grid,r+1,c)+dfs(grid,r-1,c)+dfs(grid,r,c+1)+dfs(grid,r,c-1);\n}\nint max=0;\nfor (int r=0;r<grid.length;r++) for (int c=0;c<grid[0].length;c++) max=Math.max(max,dfs(grid,r,c));\nreturn max;",
    "variants": [
      "Number of Islands (LC 200)",
      "Making a Large Island (LC 827)"
    ],
    "summary": "Find the area of the largest island — connected group of '1' cells — in a binary grid."
  },
  {
    "id": 417,
    "name": "Pacific Atlantic Water Flow",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "cells from which water can flow to both Pacific and Atlantic",
      "reverse BFS from ocean borders"
    ],
    "coreIdea": "BFS/DFS BACKWARDS from ocean borders. Pacific reachable = cells that can drain to top/left borders. Atlantic reachable = cells that drain to bottom/right. Intersection is the answer.",
    "coreIdeaHinglish": "Ulta sochlo. Ocean ke border se backward BFS karo — height >= current pe ja sakte hain (backwards flow). Pacific aur Atlantic dono se reachable cells ka intersection answer hai.",
    "approach": [
      "BFS from all Pacific border cells (flow backwards: move to equal or higher cells)",
      "BFS from all Atlantic border cells",
      "Return cells in both visited sets"
    ],
    "time": "O(M·N)",
    "space": "O(M·N)",
    "pitfalls": [
      "Reverse the flow direction — from border inward, move to cells with height >= current",
      "Two separate BFS runs (not one combined)",
      "Initialize Pacific queue with top row + left col; Atlantic with bottom row + right col"
    ],
    "code": "int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\nint m=heights.length, n=heights[0].length;\nboolean[][] pac=new boolean[m][n], atl=new boolean[m][n];\nvoid dfs(boolean[][] visited, int r, int c) {\n    visited[r][c]=true;\n    for (int[] d:dirs) { int nr=r+d[0],nc=c+d[1]; if(nr>=0&&nr<m&&nc>=0&&nc<n&&!visited[nr][nc]&&heights[nr][nc]>=heights[r][c]) dfs(visited,nr,nc); }\n}\nfor (int r=0;r<m;r++) { dfs(pac,r,0); dfs(atl,r,n-1); }\nfor (int c=0;c<n;c++) { dfs(pac,0,c); dfs(atl,m-1,c); }\nList<List<Integer>> res=new ArrayList<>();\nfor (int r=0;r<m;r++) for (int c=0;c<n;c++) if(pac[r][c]&&atl[r][c]) res.add(Arrays.asList(r,c));\nreturn res;",
    "variants": [
      "Walls and Gates (LC 286)",
      "Surrounded Regions (LC 130)"
    ],
    "summary": "Find all cells from which rainwater can flow to both the Pacific and Atlantic oceans."
  },
  {
    "id": 130,
    "name": "Surrounded Regions",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "flip all 'O's NOT connected to the border to 'X'",
      "reverse thinking: find border-connected 'O's first"
    ],
    "coreIdea": "DFS/BFS from every 'O' on the border. Mark those as 'S' (safe). Then scan the whole board: 'S' → 'O' (keep); 'O' → 'X' (flip); 'X' stays 'X'.",
    "coreIdeaHinglish": "Border ke saare 'O' se DFS karo, unhe aur unke connected 'O' ko 'S' mark karo. Phir pure board me: 'S' ko 'O' banao, 'O' ko 'X'.",
    "approach": [
      "DFS from every 'O' on the 4 borders; mark connected 'O' as 'S'",
      "Second pass: 'O'→'X', 'S'→'O', 'X'→'X'"
    ],
    "time": "O(M·N)",
    "space": "O(M·N) recursion",
    "pitfalls": [
      "Don't flip border 'O's directly — mark them and restore after",
      "Only border cells initiate the DFS — not interior cells",
      "Four borders: top row, bottom row, left col, right col"
    ],
    "code": "int m=board.length, n=board[0].length;\nvoid dfs(int r, int c) {\n    if (r<0||r>=m||c<0||c>=n||board[r][c]!='O') return;\n    board[r][c]='S';\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n}\nfor (int r=0;r<m;r++) { dfs(r,0); dfs(r,n-1); }\nfor (int c=0;c<n;c++) { dfs(0,c); dfs(m-1,c); }\nfor (int r=0;r<m;r++) for (int c=0;c<n;c++)\n    board[r][c] = board[r][c]=='S' ? 'O' : 'X';",
    "variants": [
      "Number of Islands (LC 200)",
      "Pacific Atlantic Water Flow (LC 417)"
    ],
    "summary": "Flip all 'O' cells that are fully surrounded by 'X' cells on all four sides to 'X'."
  },
  {
    "id": 994,
    "name": "Rotting Oranges",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "multi-source BFS spreading corruption level by level",
      "minimum time for all reachable cells to rot"
    ],
    "coreIdea": "Multi-source BFS from all initially rotten oranges simultaneously. Each BFS level = 1 minute. After BFS, if any fresh orange remains, return -1.",
    "coreIdeaHinglish": "Sab rotten oranges ek saath BFS queue me daal do. Har BFS level = 1 minute. BFS ke baad koi fresh bacha? Return -1.",
    "approach": [
      "Count fresh; init queue with all rotten cells",
      "BFS: for each level (minute): spread rot to adjacent fresh; fresh--; time++",
      "Return time if fresh==0 else -1"
    ],
    "time": "O(M·N)",
    "space": "O(M·N)",
    "pitfalls": [
      "Start ALL rotten oranges in queue simultaneously — not one at a time",
      "Count time by BFS levels (not individual pops) — track level size",
      "If no fresh oranges initially, return 0 immediately"
    ],
    "code": "int fresh=0, minutes=0;\nQueue<int[]> q=new LinkedList<>();\nfor (int r=0;r<grid.length;r++) for (int c=0;c<grid[0].length;c++) {\n    if (grid[r][c]==2) q.add(new int[]{r,c}); if (grid[r][c]==1) fresh++;\n}\nint[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};\nwhile (!q.isEmpty() && fresh>0) {\n    for (int i=q.size();i>0;i--) {\n        int[] p=q.poll();\n        for (int[] d:dirs) { int nr=p[0]+d[0],nc=p[1]+d[1]; if(nr>=0&&nr<grid.length&&nc>=0&&nc<grid[0].length&&grid[nr][nc]==1) { grid[nr][nc]=2; fresh--; q.add(new int[]{nr,nc}); } }\n    }\n    minutes++;\n}\nreturn fresh==0 ? minutes : -1;",
    "variants": [
      "Walls and Gates (LC 286)",
      "Number of Islands (LC 200)"
    ],
    "summary": "Find the minimum minutes for all fresh oranges to rot; adjacent fresh oranges rot each minute. Return -1 if impossible."
  },
  {
    "id": 286,
    "name": "Walls and Gates",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "fill each empty room with distance to nearest gate",
      "multi-source BFS from all gates simultaneously"
    ],
    "coreIdea": "Multi-source BFS starting from all gates (value 0) simultaneously. The BFS naturally fills each reachable room with the minimum distance.",
    "coreIdeaHinglish": "Saare gates (0) ek saath BFS queue me daal do. BFS khud hi har room ko minimum distance se fill kar deta hai — closer gates naturally win.",
    "approach": [
      "Queue all gate positions (rooms[r][c]==0)",
      "BFS: for each cell, spread to adjacent INF cells with dist+1"
    ],
    "time": "O(M·N)",
    "space": "O(M·N)",
    "pitfalls": [
      "Multi-source BFS (all gates simultaneously) — NOT running BFS from each gate separately",
      "Only update INF cells (value == 2^31 - 1) — walls are -1",
      "This is identical in structure to LC 994 Rotting Oranges"
    ],
    "code": "int m=rooms.length, n=rooms[0].length;\nQueue<int[]> q=new LinkedList<>();\nfor (int r=0;r<m;r++) for (int c=0;c<n;c++) if(rooms[r][c]==0) q.add(new int[]{r,c});\nint[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};\nwhile (!q.isEmpty()) {\n    int[] p=q.poll();\n    for (int[] d:dirs) {\n        int nr=p[0]+d[0], nc=p[1]+d[1];\n        if (nr>=0&&nr<m&&nc>=0&&nc<n&&rooms[nr][nc]==Integer.MAX_VALUE) {\n            rooms[nr][nc]=rooms[p[0]][p[1]]+1; q.add(new int[]{nr,nc});\n        }\n    }\n}",
    "variants": [
      "Rotting Oranges (LC 994)",
      "01 Matrix (LC 542)"
    ],
    "summary": "Fill each empty room with its distance to the nearest gate in a rooms-and-gates grid."
  },
  {
    "id": 684,
    "name": "Redundant Connection",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "find the edge that creates a cycle in an undirected graph (return the last one)",
      "Union-Find"
    ],
    "coreIdea": "Union-Find. Process edges in order. For each edge (u, v): if find(u) == find(v), they're already connected — this edge is redundant. Otherwise union them.",
    "coreIdeaHinglish": "Union-Find se edges process karo. Har edge (u,v) ke liye: find(u) == find(v)? Woh already connected hain — yeh edge redundant hai. Warna union karo.",
    "approach": [
      "parent = list(range(n+1))",
      "find(x): path compression",
      "union(x, y): if find(x)==find(y): return False (cycle found); else merge"
    ],
    "time": "O(n·α(n)) ≈ O(n)",
    "space": "O(n)",
    "pitfalls": [
      "Use 1-indexed parent array (nodes are 1 to n)",
      "Path compression in find: parent[x] = find(parent[x])",
      "Return the FIRST edge that creates a cycle — process in given order"
    ],
    "code": "int[] parent = new int[n+1];\nfor (int i=0;i<=n;i++) parent[i]=i;\nint find(int x) { return parent[x]==x ? x : (parent[x]=find(parent[x])); }\nfor (int[] e : edges) {\n    int a=find(e[0]), b=find(e[1]);\n    if (a==b) return e;\n    parent[a]=b;\n}\nreturn new int[]{};",
    "variants": [
      "Graph Valid Tree (LC 261)",
      "Number of Connected Components (LC 323)"
    ],
    "summary": "Find the redundant directed edge whose removal makes a graph with n nodes and n edges a valid tree."
  },
  {
    "id": 261,
    "name": "Graph Valid Tree",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "check if n nodes and given edges form a valid tree",
      "valid tree: connected + no cycles (exactly n-1 edges)"
    ],
    "coreIdea": "A valid tree has exactly n-1 edges AND is connected. Check: (1) if len(edges) != n-1, return False. (2) Union-Find — if any edge creates a cycle, return False. All nodes connected? True.",
    "coreIdeaHinglish": "Valid tree = n-1 edges AND connected. Pehle edge count check karo. Phir Union-Find se cycle check karo. Sab nodes connected hain? Valid tree.",
    "approach": [
      "If len(edges) != n-1: return False",
      "Union-Find: for each edge, if already same component → cycle → False",
      "Return True if all edges processed without cycle"
    ],
    "time": "O(n·α(n))",
    "space": "O(n)",
    "pitfalls": [
      "n-1 edges check filters most invalid cases upfront",
      "With exactly n-1 edges and no cycles, connectivity is guaranteed",
      "Don't forget to check 0-indexed vs 1-indexed nodes"
    ],
    "code": "// Valid Tree: n-1 edges, no cycle, single component\nif (edges.length != n-1) return false;\nint[] parent=new int[n]; for(int i=0;i<n;i++) parent[i]=i;\nint find(int x){return parent[x]==x?x:(parent[x]=find(parent[x]));}\nfor (int[] e:edges) { int a=find(e[0]),b=find(e[1]); if(a==b) return false; parent[a]=b; }\nreturn true;",
    "variants": [
      "Redundant Connection (LC 684)",
      "Number of Connected Components (LC 323)"
    ],
    "summary": "Given n nodes and a list of edges, determine if they form a valid tree."
  },
  {
    "id": 323,
    "name": "Number of Connected Components in an Undirected Graph",
    "difficulty": "Medium",
    "pattern": "Graphs",
    "trigger": [
      "count connected components in a graph",
      "Union-Find or DFS"
    ],
    "coreIdea": "Union-Find. Start with n components. For each edge (u, v): if different components, union them and decrement count. Return final count.",
    "coreIdeaHinglish": "n components se shuru karo. Har edge pe union karo — alag components the? Count ghatao. Ya DFS: har unvisited node se DFS, count++.",
    "approach": [
      "parent = list(range(n)), count = n",
      "For each edge: if find(u) != find(v): union, count--",
      "Return count"
    ],
    "time": "O((n+e)·α(n))",
    "space": "O(n)",
    "pitfalls": [
      "Start count at n — each node is its own component initially",
      "Decrement only when two DIFFERENT components merge",
      "DFS alternative: visited set, DFS from each unvisited node"
    ],
    "code": "// Count connected components using Union-Find\nint[] parent = new int[n];\nfor (int i=0;i<n;i++) parent[i]=i;\nint find(int x) { return parent[x]==x ? x : (parent[x]=find(parent[x])); }\nint count=n;\nfor (int[] e:edges) { int a=find(e[0]),b=find(e[1]); if(a!=b){parent[a]=b; count--;} }\nreturn count;",
    "variants": [
      "Graph Valid Tree (LC 261)",
      "Redundant Connection (LC 684)"
    ],
    "summary": "Count the number of connected components in an undirected graph with n nodes."
  }
]);
