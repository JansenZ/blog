// 3[a]2[c] = aaacc
// 3[a2[c]] = accaccacc
// 3[ab]2[cd]ef = abababcdcdef

//100[ab]???

function decodeStrings(str) {
    const arr = str.split('');
    while(arr.includes('[')) {
        const leftIndex = arr.lastIndexOf('[');
        const rightIndex = arr.indexOf(']', leftIndex + 1);
        let number = '';
        let index = leftIndex - 1;
        let flag = 0;
        while(!isNaN(Number(arr[index])) && index >= 0) {
            number = arr[index] + number;
            index --;
            flag ++;
        }
        const strs = arr.slice(leftIndex + 1, rightIndex).join('');
        const ss = strs.repeat(number);
        const deleteCount = rightIndex - leftIndex + flag + 1;
        arr.splice(leftIndex - flag, deleteCount, ss);
    }
    return arr.join('');
}