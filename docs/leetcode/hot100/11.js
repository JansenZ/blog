// 盛最多水的容器
// 这题别去动态规划上想了
// 采用双指针的方法
// start在头,end在尾巴，每次往里收一个
// 这样的话，只要最大的面积在里面，就一定会被找出来。
var maxArea = function(height) {
    let max = 0;
    let start = 0;
    let end = height.length - 1;
    while(start < end) {
        max = Math.max(max, (end - start) * Math.min(height[start], height[end]));
        // 每次只滑一个
        if(height[start] < height[end]) {
            start ++
        } else {
            end --;
        }
    }
    return max;
};
