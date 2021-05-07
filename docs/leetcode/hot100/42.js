// 每轮减一。
// 开局遇到非0开始。从两边往里收缩。
// 本方案思路没太大问题，但是结果被320用例制裁。
var trap = function(height) {

    let res = 0;

    let low = 0;
    let high = height.length - 1;
    // 默认只减1
    let offset = 1;

    while(low < high) {
         while(height[low] == 0) {
            low++;
        }
        while(height[high] == 0) {
            high--;
        }
        // 找到起始位置的low，和high
        // 每轮把当前数值减1.找里面有几个0。有0就代表是洼地。
        // 但是如果只减1的话，个别恶心人的用例会超时，所以，取除了0以外的最小值，是不是可以多减一点。作为offset。
        let min = Number.MAX_SAFE_INTEGER;
        for(var i = low; i <= high; i ++) {
            if(height[i] == 0) {
                res+=offset;
            } else {
                height[i] -=offset;
                (height[i] < min) && (min = height[i])
            }
        }
        // 一次性多搞一点。
        offset = min == Number.MAX_SAFE_INTEGER ? 1 : min;
    }
    return res;
};


// 其实原来的那个思路还凑合
// 但是核心就是
// 每个下标位子它能加的值，就是它的左边的最大值，和它的右边的最大值，两个人的最小的，减去当前的值。
// 所以同样利用双指针来做
var trap = function(height) {
    let ans = 0;
    let low = 0;
    let high = height.length - 1;
    let leftMax = 0, rightMax = 0;

    while(low < high) {
        leftMax = Math.max(leftMax, height[low]);
        rightMax = Math.max(rightMax, height[high]);
        // 说明左边的max肯定也是小值
        if(height[low] < height[high]) {
            ans += leftMax - height[low];
            low++;
        } else {
            ans += rightMax - height[high];
            high --;
        }
    }

    return ans;
};