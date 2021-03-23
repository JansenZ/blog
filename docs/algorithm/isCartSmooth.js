// arr 先快排
function isSmooth(arr) {
    for(var i = 0; i< arr.length - 1; i++) {
        if(arr[i] == 0) {
            continue;
        }
        if(arr[i] == arr[i + 1]) {
            return false;
        }
    }
    return (arr[arr.length - 1] - arr[0]) < 5
}

function ridstr(arr) {
    for(var i = 0; i < arr.length - 1; i ++) {
        if(arr[i] == arr[i + 1]) {
            arr.splice(i, 2);
            ridstr(arr);
            break;
        }
    }
    return arr;
}