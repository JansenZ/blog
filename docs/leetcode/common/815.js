// 815. 公交路线
// 我们有一系列公交路线。每一条路线 routes[i] 上都有一辆公交车在上面循环行驶。例如，有一条路线 routes[0] = [1, 5, 7]，表示第一辆 (下标为0) 公交车会一直按照 1->5->7->1->5->7->1->... 的车站路线行驶。

// 假设我们从 S 车站开始（初始时不在公交车上），要去往 T 站。 期间仅可乘坐公交车，求出最少乘坐的公交车数量。返回 -1 表示不可能到达终点车站。

// 示例:
// 输入:
// routes = [[1, 2, 7], [3, 6, 7]]
// S = 1
// T = 6
// 输出: 2
// 解释:
// 最优策略是先乘坐第一辆公交车到达车站 7, 然后换乘第二辆公交车到车站 6。
// 说明:

// 1 <= routes.length <= 500.
// 1 <= routes[i].length <= 500.
// 0 <= routes[i][j] < 10 ^ 6.

// 最后几个用例超时
var numBusesToDestination = function(routes, S, T) {
  if (S == T) return 0;
  var c = new Set();
  var level = 1;

  for (let i = 0; i < routes.length; i++) {
    let target = routes[i];
    if (target.includes(S)) {
      if (target.includes(T)) return 1;
      target.forEach(k => k != S && c.add(k));
      target = false;
    }
  }

  var frr = [...c];

  while (frr.length) {
    let flen = frr.length;
    while (flen) {
      let tt = frr.shift();
      for (var i = 0; i < routes.length; i++) {
        let target = routes[i];
        if (target && target.includes(tt)) {
          if (target.includes(T)) {
            return level;
          }
          target.forEach(k => {
            if (k != tt && !c.has(k)) {
              c.add(k);
              frr.push(k);
            }
          });
          target = false;
        }
      }
      flen--;
    }
    level++;
  }
  return -1;
};

// 这个方法可以用，至少最后几个用例不超时了。
// 上面的和下面的方法，其实本质的区别就是一个是建立线路和成set，然后再while的时候因此会需要额外判断一次
// 下面的方法就是建立一个新的邻接矩阵，然后去对应的那条线路里一个一个找
// 本质上都是图的BFS
// 还有，可以发现，set数据结构要比数组快一点，我把obj[routes[i][j]]那个从set改成数组就要超时了。
var numBusesToDestination = function(routes, S, T) {
    if (S == T) return 0;
    let g = {};
    let c = new Set();
    for (let i = 0; i < routes.length; i++) {
      for (let j = 0; j < routes[i].length; j++) {
        if (!g[routes[i][j]]) {
          g[routes[i][j]] = new Set();
        }
        g[routes[i][j]].add(i);
      }
    }
    let level = 1;
    let frr = [S];
    c.add(S);
    while (frr.length) {
      let flen = frr.length;
      while (flen) {
        const dd = frr.shift();
  
        for (let line of g[dd]) {
          for (let jj of routes[line]) {
            // 说明这条线都已经被发现过了，和第一次的false类似
            if (c.has(jj)) continue;
            if (jj == T) {
              return level;
            }
            frr.push(jj);
            c.add(jj);
          }
        }
        flen--;
      }
      level++;
    }
    return -1;
  };

// 我又改了一点，标记已经访问的线路和站，这样速度最快可以达到148ms，
// 当然了，这个其实主要就是剪枝的事，和上述的没有本质的算法区别
var numBusesToDestination = function(routes, S, T) {
  if (S == T) return 0;
  let graph = {};
  let markedLine = {};
  let markedSt = {};
  for (let line = 0; line < routes.length; line++) {
    for(let st of routes[line]) {
        if(!graph[st]) {
            graph[st] = [];
        }
        graph[st].push(line);
    }
  }

  let step = 1;
  let arr = [S];

  while (arr.length) {
    let len = arr.length;
    while (len) {
      const ss = arr.shift();

      for (let line of graph[ss]) {
        if (markedLine[line]) continue
        markedLine[line] = true
        for (let st of routes[line]) {
          if (markedSt[st]) continue;
          if (st == T) {
            return step;
          }
          arr.push(st);
          markedSt[st] = true
        }
      }
      len--;
    }
    step++;
  }
  return -1;
};