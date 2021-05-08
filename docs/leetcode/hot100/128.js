/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = (nums) => {
    const set = new Set(nums) // set存放数组的全部数字
    let max = 0
      //   遍历
    for (let i = 0; i < nums.length; i++) {
      //   如果有左邻居，就跳过，因为这个一定会在某个点在里面的while跑
      // 如果没有，代表这次的数字是起点。
      if (!set.has(nums[i] - 1)) {
        let cur = nums[i]
        let count = 1
        while (set.has(cur + 1)) { // cur有右邻居cur+1
          cur++ // 更新cur
          count++ 
        }
        max = Math.max(max, count) // cur不再有右邻居，检查count是否最大
      }
    }
    return max
  }
//   低端做法就是onlogn。去重，排序，然后找